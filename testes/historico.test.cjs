const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const contexto = {};
for (const arquivo of ['cep.js', 'historico.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../js', arquivo), 'utf8'), contexto);
}
const criarHistorico = contexto.CepHistorico.criarHistorico;
const listar = historico => Array.from(historico.listar());

function criarArmazenamento(conteudo) {
  const dados = new Map(conteudo === undefined ? [] : [['cep-facil.historico', conteudo]]);
  return {
    getItem: chave => dados.get(chave) ?? null,
    setItem: (chave, valor) => dados.set(chave, valor),
    removeItem: chave => dados.delete(chave)
  };
}

test('reabrir a aplicação recupera consultas, sem duplicar CEP com e sem hífen', () => {
  const armazenamento = criarArmazenamento();
  const historico = criarHistorico(() => armazenamento);
  historico.registrar('01001000');
  historico.registrar('01310-100');
  historico.registrar('01001-000');
  assert.deepEqual(listar(criarHistorico(() => armazenamento)), ['01001-000', '01310-100']);
});

test('uma sexta consulta remove a mais antiga e repetir uma consulta a traz para o início', () => {
  const historico = criarHistorico(() => criarArmazenamento());
  for (const cep of ['01001000', '01310100', '20040002', '30140071', '40020000', '70040900']) historico.registrar(cep);
  assert.deepEqual(listar(historico), ['70040-900', '40020-000', '30140-071', '20040-002', '01310-100']);
  historico.registrar('20040-002');
  assert.deepEqual(listar(historico), ['20040-002', '70040-900', '40020-000', '30140-071', '01310-100']);
});

test('limpar remove os registros persistidos e não afeta outros dados do navegador', () => {
  const armazenamento = criarArmazenamento();
  armazenamento.setItem('outro-projeto', 'preservar');
  const historico = criarHistorico(() => armazenamento);
  historico.registrar('01001000');
  historico.limpar();
  assert.deepEqual(listar(criarHistorico(() => armazenamento)), []);
  assert.equal(armazenamento.getItem('outro-projeto'), 'preservar');
});

test('dados inválidos são descartados e um histórico corrompido pode ser substituído', () => {
  for (const conteudo of ['{quebrado', 'null', '{}']) {
    const armazenamento = criarArmazenamento(conteudo);
    const historico = criarHistorico(() => armazenamento);
    assert.deepEqual(listar(historico), []);
    historico.registrar('01001000');
    assert.deepEqual(listar(criarHistorico(() => armazenamento)), ['01001-000']);
  }
  const armazenamento = criarArmazenamento(JSON.stringify(['01001000', '01001-000', null, 123, '<script>', '01310100']));
  assert.deepEqual(listar(criarHistorico(() => armazenamento)), ['01001-000', '01310-100']);
});

test('leitura ou gravação bloqueada mantém um histórico temporário que ainda pode ser limpo', () => {
  const bloqueado = () => { throw new Error('Armazenamento bloqueado'); };
  const historicos = [
    criarHistorico(bloqueado),
    criarHistorico(() => ({ getItem: bloqueado })),
    criarHistorico(() => ({ getItem: () => null, setItem: bloqueado }))
  ];
  for (const historico of historicos) {
    historico.registrar('01001000');
    assert.equal(historico.persistente(), false);
    assert.deepEqual(listar(historico), ['01001-000']);
    historico.limpar();
    assert.deepEqual(listar(historico), []);
  }
});
