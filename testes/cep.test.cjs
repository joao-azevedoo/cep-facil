const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const contexto = { AbortController, setTimeout, clearTimeout };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../js/cep.js'), 'utf8'), contexto);
const regras = contexto.CepBasico;
const estados = [
  { sigla: 'RJ', nome: 'Rio de Janeiro', regiao: { nome: 'Sudeste' } },
  { sigla: 'SP', nome: 'São Paulo', regiao: { nome: 'Sudeste' } }
];
const dadosViaCep = { cep: '20040-002', logradouro: 'Avenida Rio Branco', bairro: 'Centro', localidade: 'Rio de Janeiro', uf: 'RJ' };
const dadosBrasilApi = { cep: '20040002', street: 'Avenida Rio Branco', neighborhood: 'Centro', city: 'Rio de Janeiro', state: 'RJ' };
const resposta = dados => ({ ok: true, json: async () => dados });
function obterComViaCep(responder) {
  return async function (url, opcoes) {
    if (url.includes('ibge.gov.br')) return resposta(estados);
    if (url.includes('brasilapi.com.br')) throw new Error('Alternativa indisponível neste cenário');
    return responder(url, opcoes);
  };
}

test('valida e formata o CEP, preservando zeros à esquerda', () => {
  for (const valor of ['01001000', '01001-000']) {
    assert.equal(regras.normalizarCep(valor), '01001000');
  }
  assert.equal(regras.formatarCep('01001000'), '01001-000');
});

test('consulta um CEP fora dos antigos exemplos e transforma o JSON do ViaCEP', async () => {
  for (const entrada of ['20040002', '20040-002']) {
    const consulta = await regras.consultarCep(entrada, obterComViaCep(async url => {
      assert.equal(url, 'https://viacep.com.br/ws/20040002/json/');
      return { ok: true, json: async () => ({ cep: '20040-002', logradouro: 'Avenida Rio Branco', bairro: 'Centro', localidade: 'Rio de Janeiro', uf: 'RJ' }) };
    }));
    assert.equal(consulta.sucesso, true);
    assert.equal(consulta.endereco.cep, '20040-002');
    assert.equal(consulta.endereco.logradouro, 'Avenida Rio Branco');
    assert.equal(consulta.endereco.cidade, 'Rio de Janeiro');
    assert.equal(consulta.endereco.uf, 'RJ');
  }
});

test('entrada incompleta, letras e números extras são rejeitados antes da requisição', async () => {
  let requisicoes = 0;
  for (const entrada of ['', '123', '01001A000', '010010000', '01001 000']) {
    const consulta = await regras.consultarCep(entrada, () => { requisicoes++; });
    assert.equal(consulta.sucesso, false);
    assert.match(consulta.mensagem, /oito números/);
  }
  assert.equal(requisicoes, 0);
});

test('CEP inexistente tem mensagem diferente de falha de conexão', async () => {
  for (const erro of [true, 'true']) {
    const consulta = await regras.consultarCep('99999999', obterComViaCep(async () => resposta({ erro })));
    assert.equal(consulta.sucesso, false);
    assert.match(consulta.mensagem, /CEP não encontrado/);
  }
});

test('falha de rede, HTTP e JSON inválido retornam uma mensagem recuperável', async () => {
  const falhar = async () => { throw new Error('Falha simulada'); };
  for (const obter of [falhar, async () => ({ ok: false, status: 503 }), async () => ({ ok: true, json: falhar })]) {
    const consulta = await regras.consultarCep('20040002', obterComViaCep(obter));
    assert.equal(consulta.sucesso, false);
    assert.match(consulta.mensagem, /conexão e tente novamente/);
  }
});

test('resposta incompleta ou com outro CEP não produz um endereço incorreto', async () => {
  const endereco = { cep: '20040-002', logradouro: 'Avenida Rio Branco', bairro: 'Centro', localidade: 'Rio de Janeiro', uf: 'RJ' };
  for (const dados of [null, [], {}, { ...endereco, cep: '01001-000' }, { ...endereco, localidade: '' }, { ...endereco, uf: null }, { ...endereco, bairro: 123 }]) {
    const consulta = await regras.consultarCep('20040002', obterComViaCep(async () => resposta(dados)));
    assert.equal(consulta.sucesso, false);
    assert.match(consulta.mensagem, /Não foi possível consultar/);
  }
});

test('CEP geral com rua e bairro vazios preserva cidade e UF', async () => {
  const consulta = await regras.consultarCep('12345678', obterComViaCep(async () => resposta({ cep: '12345-678', logradouro: '', bairro: '', localidade: 'Cidade Exemplo', uf: 'SP' })));
  assert.equal(consulta.sucesso, true);
  assert.equal(consulta.endereco.logradouro, 'CEP geral de Cidade Exemplo');
  assert.equal(consulta.endereco.bairro, 'Não informado');
  assert.equal(consulta.endereco.cidade, 'Cidade Exemplo');
});

test('endereço e estados começam em paralelo e o complemento corresponde à UF encontrada', async () => {
  const iniciadas = [];
  const liberar = new Map();
  const consultaPendente = regras.consultarCep('20040002', url => {
    iniciadas.push(url);
    return new Promise(resolver => liberar.set(url.includes('ibge.gov.br') ? 'estados' : 'endereco', resolver));
  });
  assert.equal(iniciadas.length, 2);
  assert.ok(iniciadas.some(url => url.includes('viacep.com.br')));
  assert.ok(iniciadas.some(url => url.includes('ibge.gov.br')));
  liberar.get('endereco')(resposta(dadosViaCep));
  liberar.get('estados')(resposta(estados));
  const consulta = await consultaPendente;
  assert.equal(consulta.fonte, 'ViaCEP');
  assert.equal(consulta.complemento.estado, 'Rio de Janeiro');
  assert.equal(consulta.complemento.regiao, 'Sudeste');
});

test('falha ou resposta inválida do IBGE mantém o endereço com aviso', async () => {
  for (const dados of [null, {}, [], [{ sigla: 'RJ', nome: 'Rio de Janeiro', regiao: {} }], [{ sigla: 'SP', nome: 'São Paulo', regiao: { nome: 'Sudeste' } }]]) {
    const consulta = await regras.consultarCep('20040002', async url => resposta(url.includes('ibge.gov.br') ? dados : dadosViaCep));
    assert.equal(consulta.sucesso, true);
    assert.equal(consulta.endereco.cidade, 'Rio de Janeiro');
    assert.equal(consulta.complemento, undefined);
    assert.match(consulta.aviso, /IBGE.*indisponíveis/);
  }
  const consulta = await regras.consultarCep('20040002', async url => {
    if (url.includes('ibge.gov.br')) throw new Error('IBGE indisponível');
    return resposta(dadosViaCep);
  });
  assert.equal(consulta.sucesso, true);
  assert.match(consulta.aviso, /IBGE/);
});

test('a BrasilAPI fornece o endereço quando o ViaCEP falha', async () => {
  const fontes = [];
  const consulta = await regras.consultarCep('20040002', async url => {
    fontes.push(url);
    if (url.includes('viacep.com.br')) throw new Error('ViaCEP indisponível');
    if (url.includes('ibge.gov.br')) return resposta(estados);
    assert.equal(url, 'https://brasilapi.com.br/api/cep/v1/20040002');
    return resposta(dadosBrasilApi);
  });
  assert.equal(consulta.sucesso, true);
  assert.equal(consulta.fonte, 'BrasilAPI');
  assert.equal(consulta.endereco.cep, '20040-002');
  assert.equal(consulta.endereco.logradouro, 'Avenida Rio Branco');
  assert.equal(consulta.complemento.regiao, 'Sudeste');
  assert.equal(fontes.length, 3);
});

test('CEP inexistente no ViaCEP não aciona a alternativa', async () => {
  let alternativas = 0;
  const consulta = await regras.consultarCep('99999999', async url => {
    if (url.includes('brasilapi.com.br')) alternativas++;
    return resposta(url.includes('ibge.gov.br') ? estados : { erro: true });
  });
  assert.match(consulta.mensagem, /CEP não encontrado/);
  assert.equal(alternativas, 0);
});

test('resposta da alternativa com outro CEP é rejeitada', async () => {
  const consulta = await regras.consultarCep('20040002', async url => {
    if (url.includes('ibge.gov.br')) return resposta(estados);
    if (url.includes('viacep.com.br')) return { ok: false, status: 503 };
    return resposta({ ...dadosBrasilApi, cep: '01001000' });
  });
  assert.equal(consulta.sucesso, false);
  assert.match(consulta.mensagem, /conexão e tente novamente/);
});

test('404 da alternativa informa CEP não encontrado', async () => {
  const consulta = await regras.consultarCep('99999999', async url => {
    if (url.includes('ibge.gov.br')) return resposta(estados);
    return { ok: false, status: url.includes('viacep.com.br') ? 503 : 404 };
  });
  assert.match(consulta.mensagem, /CEP não encontrado/);
});

test('tempo limite aborta a fonte principal e permite usar a alternativa', { timeout: 1500 }, async () => {
  let sinalPrincipal;
  const consulta = await regras.consultarCep('20040002', (url, opcoes) => {
    if (url.includes('ibge.gov.br')) return Promise.resolve(resposta(estados));
    if (url.includes('brasilapi.com.br')) return Promise.resolve(resposta(dadosBrasilApi));
    sinalPrincipal = opcoes.signal;
    return new Promise(() => {});
  }, { tempoLimite: 20 });
  assert.equal(sinalPrincipal.aborted, true);
  assert.equal(consulta.fonte, 'BrasilAPI');
});

test('tempo limite inclui JSON pendente e um IBGE lento não oculta o endereço', { timeout: 1500 }, async () => {
  const consulta = await regras.consultarCep('20040002', async url => {
    if (url.includes('ibge.gov.br')) return { ok: true, json: () => new Promise(() => {}) };
    return resposta(dadosViaCep);
  }, { tempoLimite: 20 });
  assert.equal(consulta.sucesso, true);
  assert.match(consulta.aviso, /IBGE/);
});

test('cancelamento antes do início não faz requisições', async () => {
  const controlador = new AbortController();
  controlador.abort();
  let requisicoes = 0;
  const consulta = await regras.consultarCep('20040002', () => { requisicoes++; }, { signal: controlador.signal });
  assert.equal(consulta.cancelada, true);
  assert.equal(requisicoes, 0);
});

test('cancelamento interrompe endereço e IBGE sem acionar a alternativa', { timeout: 1500 }, async () => {
  const controlador = new AbortController();
  const sinais = [];
  let alternativas = 0;
  const pendente = regras.consultarCep('20040002', (url, opcoes) => {
    if (url.includes('brasilapi.com.br')) alternativas++;
    sinais.push(opcoes.signal);
    return new Promise(() => {});
  }, { signal: controlador.signal });
  controlador.abort();
  const consulta = await pendente;
  assert.equal(consulta.cancelada, true);
  assert.equal(sinais.length, 2);
  assert.ok(sinais.every(sinal => sinal.aborted));
  assert.equal(alternativas, 0);
});

test('tempo limite em todas as fontes encerra a consulta com mensagem recuperável', { timeout: 1500 }, async () => {
  const consulta = await regras.consultarCep('20040002', () => new Promise(() => {}), { tempoLimite: 20 });
  assert.equal(consulta.sucesso, false);
  assert.equal(consulta.cancelada, undefined);
  assert.match(consulta.mensagem, /conexão e tente novamente/);
});
