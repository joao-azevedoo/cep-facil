const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const contexto = {};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../js/cep.js'), 'utf8'), contexto);
const regras = contexto.CepBasico;

test('consulta os exemplos com e sem hífen, preservando zeros à esquerda', () => {
  for (const valor of ['01001000', '01001-000']) {
    const consulta = regras.consultarCep(valor);
    assert.equal(consulta.sucesso, true);
    assert.equal(consulta.endereco.cep, '01001-000');
    assert.equal(consulta.endereco.logradouro, 'Praça da Sé');
  }
  assert.equal(regras.consultarCep('01310100').endereco.logradouro, 'Avenida Paulista');
});
test('entrada incompleta, letras e números extras são rejeitados', () => {
  for (const entrada of ['', '123', '01001A000', '010010000', '01001 000']) {
    assert.equal(regras.consultarCep(entrada).sucesso, false);
    assert.match(regras.consultarCep(entrada).mensagem, /oito números/);
  }
});
test('CEP fora da base é identificado como limitação da demonstração', () => {
  const consulta = regras.consultarCep('99999999');
  assert.equal(consulta.sucesso, false);
  assert.match(consulta.mensagem, /fora da base de demonstração/);
});
