const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const contexto = {};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../js/cep.js'), 'utf8'), contexto);
const regras = contexto.CepBasico;

test('valida e formata o CEP, preservando zeros à esquerda', () => {
  for (const valor of ['01001000', '01001-000']) {
    assert.equal(regras.normalizarCep(valor), '01001000');
  }
  assert.equal(regras.formatarCep('01001000'), '01001-000');
});

test('consulta um CEP fora dos antigos exemplos e transforma o JSON do ViaCEP', async () => {
  for (const entrada of ['20040002', '20040-002']) {
    const consulta = await regras.consultarCep(entrada, async url => {
      assert.equal(url, 'https://viacep.com.br/ws/20040002/json/');
      return { ok: true, json: async () => ({ cep: '20040-002', logradouro: 'Avenida Rio Branco', bairro: 'Centro', localidade: 'Rio de Janeiro', uf: 'RJ' }) };
    });
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
    const consulta = await regras.consultarCep('99999999', async () => ({ ok: true, json: async () => ({ erro }) }));
    assert.equal(consulta.sucesso, false);
    assert.match(consulta.mensagem, /CEP não encontrado/);
  }
});

test('falha de rede, HTTP e JSON inválido retornam uma mensagem recuperável', async () => {
  const falhar = async () => { throw new Error('Falha simulada'); };
  for (const obter of [falhar, async () => ({ ok: false, status: 503 }), async () => ({ ok: true, json: falhar })]) {
    const consulta = await regras.consultarCep('20040002', obter);
    assert.equal(consulta.sucesso, false);
    assert.match(consulta.mensagem, /conexão e tente novamente/);
  }
});

test('resposta incompleta ou com outro CEP não produz um endereço incorreto', async () => {
  const endereco = { cep: '20040-002', logradouro: 'Avenida Rio Branco', bairro: 'Centro', localidade: 'Rio de Janeiro', uf: 'RJ' };
  for (const dados of [null, [], {}, { ...endereco, cep: '01001-000' }, { ...endereco, localidade: '' }, { ...endereco, uf: null }, { ...endereco, bairro: 123 }]) {
    const consulta = await regras.consultarCep('20040002', async () => ({ ok: true, json: async () => dados }));
    assert.equal(consulta.sucesso, false);
    assert.match(consulta.mensagem, /Não foi possível consultar/);
  }
});

test('CEP geral com rua e bairro vazios preserva cidade e UF', async () => {
  const consulta = await regras.consultarCep('12345678', async () => ({ ok: true, json: async () => ({ cep: '12345-678', logradouro: '', bairro: '', localidade: 'Cidade Exemplo', uf: 'SP' }) }));
  assert.equal(consulta.sucesso, true);
  assert.equal(consulta.endereco.logradouro, 'CEP geral de Cidade Exemplo');
  assert.equal(consulta.endereco.bairro, 'Não informado');
  assert.equal(consulta.endereco.cidade, 'Cidade Exemplo');
});
