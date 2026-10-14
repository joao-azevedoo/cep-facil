// Etapa 5: fontes de endereço, IBGE em paralelo, tempo limite e cancelamento.
(function (global) {
  'use strict';

  function normalizarCep(valor) {
    const texto = String(valor ?? '').trim();
    if (!/^\d{5}-?\d{3}$/.test(texto)) return null;
    return texto.replace('-', '');
  }

  function formatarCep(cep) {
    return cep.slice(0, 5) + '-' + cep.slice(5);
  }

  function erroConsulta(tipo) {
    const erro = new Error(tipo);
    erro.tipo = tipo;
    return erro;
  }

  async function obterJson(url, obter, sinal, tempoLimite) {
    if (sinal?.aborted) throw erroConsulta('cancelada');
    const controlador = new global.AbortController();
    let interromper;
    const interrupcao = new Promise(function (_, rejeitar) { interromper = rejeitar; });
    function cancelar() {
      controlador.abort();
      interromper(erroConsulta('cancelada'));
    }
    sinal?.addEventListener('abort', cancelar, { once: true });
    const temporizador = global.setTimeout(function () {
      controlador.abort();
      interromper(erroConsulta('tempo_limite'));
    }, tempoLimite);
    try {
      // A disputa também limita a leitura do JSON e transportes que ignoram abort.
      return await Promise.race([
        (async function () {
          const resposta = await obter(url, { signal: controlador.signal });
          if (!resposta.ok) {
            const erro = erroConsulta('http');
            erro.status = resposta.status;
            throw erro;
          }
          return await resposta.json();
        })(),
        interrupcao
      ]);
    } finally {
      global.clearTimeout(temporizador);
      sinal?.removeEventListener('abort', cancelar);
    }
  }

  function montarEndereco(dados, cep) {
    if (!dados || Array.isArray(dados) || normalizarCep(dados.cep) !== cep ||
        typeof dados.localidade !== 'string' || !dados.localidade.trim() ||
        typeof dados.uf !== 'string' || !/^[A-Z]{2}$/.test(dados.uf) ||
        typeof dados.logradouro !== 'string' || typeof dados.bairro !== 'string') {
      throw erroConsulta('resposta_invalida');
    }
    return {
      cep: formatarCep(cep),
      logradouro: dados.logradouro || 'CEP geral de ' + dados.localidade,
      bairro: dados.bairro || 'Não informado',
      cidade: dados.localidade,
      uf: dados.uf
    };
  }

  function naoEncontrado() {
    return { sucesso: false, mensagem: 'CEP não encontrado. Confira os números e tente outro CEP.' };
  }

  async function consultarEndereco(cep, obter, sinal, tempoLimite) {
    try {
      const dados = await obterJson('https://viacep.com.br/ws/' + cep + '/json/', obter, sinal, tempoLimite);
      if (dados && (dados.erro === true || dados.erro === 'true')) return naoEncontrado();
      return { sucesso: true, endereco: montarEndereco(dados, cep), fonte: 'ViaCEP' };
    } catch (erro) {
      if (sinal?.aborted || erro.tipo === 'cancelada') throw erroConsulta('cancelada');
      // Só use a alternativa quando a fonte principal falhar, sem substituir CEP inexistente.
      try {
        const dados = await obterJson('https://brasilapi.com.br/api/cep/v1/' + cep, obter, sinal, tempoLimite);
        const endereco = montarEndereco(dados && {
          cep: dados.cep, localidade: dados.city, uf: dados.state,
          logradouro: dados.street ?? '', bairro: dados.neighborhood ?? ''
        }, cep);
        return { sucesso: true, endereco, fonte: 'BrasilAPI' };
      } catch (erroAlternativa) {
        if (sinal?.aborted || erroAlternativa.tipo === 'cancelada') throw erroConsulta('cancelada');
        if (erroAlternativa.status === 404) return naoEncontrado();
        return { sucesso: false, mensagem: 'Não foi possível consultar o endereço. Confira sua conexão e tente novamente.' };
      }
    }
  }

  async function consultarCep(entrada, obter = function (url, opcoes) { return global.fetch(url, opcoes); }, opcoes = {}) {
    const cep = normalizarCep(entrada);
    if (!cep) return { sucesso: false, mensagem: 'Digite um CEP com oito números, com ou sem hífen.' };
    const sinal = opcoes.signal;
    const tempoLimite = opcoes.tempoLimite ?? 6000;
    if (sinal?.aborted) return { sucesso: false, cancelada: true };
    try {
      const [consulta, estados] = await Promise.all([
        consultarEndereco(cep, obter, sinal, tempoLimite),
        obterJson('https://servicodados.ibge.gov.br/api/v1/localidades/estados', obter, sinal, tempoLimite)
          .catch(function () { return null; })
      ]);
      if (sinal?.aborted) return { sucesso: false, cancelada: true };
      if (!consulta.sucesso) return consulta;
      const estado = Array.isArray(estados) && estados.find(item => item?.sigla === consulta.endereco.uf);
      if (estado && typeof estado.nome === 'string' && estado.nome.trim() &&
          typeof estado.regiao?.nome === 'string' && estado.regiao.nome.trim()) {
        consulta.complemento = { estado: estado.nome, regiao: estado.regiao.nome };
      } else {
        consulta.aviso = 'Endereço encontrado. Os dados de estado e região do IBGE estão indisponíveis nesta consulta.';
      }
      return consulta;
    } catch (erro) {
      if (sinal?.aborted || erro.tipo === 'cancelada') return { sucesso: false, cancelada: true };
      return { sucesso: false, mensagem: 'Não foi possível consultar o endereço. Confira sua conexão e tente novamente.' };
    }
  }

  global.CepBasico = { normalizarCep, formatarCep, consultarCep };
})(globalThis);
