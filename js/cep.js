// Etapa 1: funções, condicionais, strings, arrays, objetos e laço de pesquisa.
(function (global) {
  'use strict';
  const enderecosDemonstracao = [
    { cep: '01001000', logradouro: 'Praça da Sé', bairro: 'Sé', cidade: 'São Paulo', uf: 'SP' },
    { cep: '01310100', logradouro: 'Avenida Paulista', bairro: 'Bela Vista', cidade: 'São Paulo', uf: 'SP' }
  ];

  function normalizarCep(valor) {
    const texto = String(valor ?? '').trim();
    if (!/^\d{5}-?\d{3}$/.test(texto)) return null;
    return texto.replace('-', '');
  }

  function formatarCep(cep) {
    return cep.slice(0, 5) + '-' + cep.slice(5);
  }

  function consultarCep(entrada) {
    const cep = normalizarCep(entrada);
    if (!cep) return { sucesso: false, mensagem: 'Digite um CEP com oito números, com ou sem hífen.' };
    for (let indice = 0; indice < enderecosDemonstracao.length; indice++) {
      const endereco = enderecosDemonstracao[indice];
      if (endereco.cep === cep) return { sucesso: true, endereco: { ...endereco, cep: formatarCep(cep) } };
    }
    return { sucesso: false, mensagem: 'Este CEP está fora da base de demonstração. Experimente 01001-000 ou 01310-100.' };
  }

  global.CepBasico = { normalizarCep, formatarCep, consultarCep };
})(globalThis);
