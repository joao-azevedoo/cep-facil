// Etapa 3: persistência local de até cinco CEPs, do mais recente para o mais antigo.
(function (global) {
  'use strict';
  const chave = 'cep-facil.historico';
  const limite = 5;

  function validarLista(valor) {
    if (!Array.isArray(valor)) return [];
    const ceps = [];
    for (const entrada of valor) {
      if (typeof entrada !== 'string') continue;
      const cep = global.CepBasico.normalizarCep(entrada);
      if (!cep) continue;
      const formatado = global.CepBasico.formatarCep(cep);
      if (!ceps.includes(formatado)) ceps.push(formatado);
      if (ceps.length === limite) break;
    }
    return ceps;
  }

  function criarHistorico(obterArmazenamento = function () { return global.localStorage; }) {
    let armazenamento;
    let podePersistir = true;
    let ceps = [];
    try {
      armazenamento = obterArmazenamento();
      const salvo = armazenamento.getItem(chave);
      if (salvo !== null) {
        // Dados corrompidos não devem impedir novas consultas.
        try { ceps = validarLista(JSON.parse(salvo)); }
        catch { ceps = []; }
      }
    } catch {
      podePersistir = false;
    }

    function salvar() {
      if (!podePersistir) return;
      try {
        if (ceps.length) armazenamento.setItem(chave, JSON.stringify(ceps));
        else armazenamento.removeItem(chave);
      } catch {
        // Se o navegador bloquear a gravação, preserve o histórico nesta página.
        podePersistir = false;
      }
    }

    return {
      listar: function () { return ceps.slice(); },
      registrar: function (entrada) {
        if (typeof entrada !== 'string') return;
        const cep = global.CepBasico.normalizarCep(entrada);
        if (!cep) return;
        const formatado = global.CepBasico.formatarCep(cep);
        ceps = [formatado, ...ceps.filter(item => item !== formatado)].slice(0, limite);
        salvar();
      },
      limpar: function () { ceps = []; salvar(); },
      persistente: function () { return podePersistir; }
    };
  }

  global.CepHistorico = { criarHistorico };
})(globalThis);
