// Etapa 4: validação local e consulta real ao ViaCEP com fetch e JSON.
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

  async function consultarCep(entrada, obter = function (url) { return global.fetch(url); }) {
    const cep = normalizarCep(entrada);
    if (!cep) return { sucesso: false, mensagem: 'Digite um CEP com oito números, com ou sem hífen.' };
    try {
      const resposta = await obter('https://viacep.com.br/ws/' + cep + '/json/');
      if (!resposta.ok) throw new Error('Falha HTTP');
      const dados = await resposta.json();
      if (dados && (dados.erro === true || dados.erro === 'true')) {
        return { sucesso: false, mensagem: 'CEP não encontrado. Confira os números e tente outro CEP.' };
      }
      if (!dados || Array.isArray(dados) || normalizarCep(dados.cep) !== cep ||
          typeof dados.localidade !== 'string' || !dados.localidade.trim() ||
          typeof dados.uf !== 'string' || !/^[A-Z]{2}$/.test(dados.uf) ||
          typeof dados.logradouro !== 'string' || typeof dados.bairro !== 'string') {
        throw new Error('Resposta inválida');
      }
      return { sucesso: true, endereco: {
        cep: formatarCep(cep),
        logradouro: dados.logradouro || 'CEP geral de ' + dados.localidade,
        bairro: dados.bairro || 'Não informado',
        cidade: dados.localidade,
        uf: dados.uf
      } };
    } catch {
      return { sucesso: false, mensagem: 'Não foi possível consultar o ViaCEP. Confira sua conexão e tente novamente.' };
    }
  }

  global.CepBasico = { normalizarCep, formatarCep, consultarCep };
})(globalThis);
