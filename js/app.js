// Etapas 2 a 4: eventos, histórico local e apresentação da consulta assíncrona.
const formulario = document.getElementById('formulario-consulta');
const botaoConsultar = formulario.querySelector('button[type="submit"]');
const campoCep = document.getElementById('cep');
const mensagem = document.getElementById('mensagem');
const resultado = document.getElementById('resultado');
const vazio = document.getElementById('vazio');
const logradouro = document.getElementById('logradouro');
const historico = window.CepHistorico.criarHistorico();
const listaHistorico = document.getElementById('lista-historico');
const limparHistorico = document.getElementById('limpar-historico');
let consultando = false;

function apresentarHistorico() {
  const ceps = historico.listar();
  listaHistorico.replaceChildren();
  for (const cep of ceps) {
    const item = document.createElement('li');
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'botao-sutil';
    botao.disabled = consultando;
    botao.textContent = cep;
    botao.setAttribute('aria-label', 'Consultar novamente o CEP ' + cep);
    botao.addEventListener('click', function () {
      campoCep.value = cep;
      apresentarConsulta(cep, true);
    });
    item.appendChild(botao);
    listaHistorico.appendChild(item);
  }
  limparHistorico.disabled = consultando || ceps.length === 0;
  document.getElementById('historico-vazio').hidden = ceps.length > 0;
  document.getElementById('aviso-historico').hidden = historico.persistente();
}

function limparApresentacao() {
  mensagem.hidden = true;
  mensagem.textContent = '';
  mensagem.removeAttribute('data-tipo');
  resultado.hidden = true;
  campoCep.removeAttribute('aria-invalid');
}

function alterarCarregamento(ativo) {
  consultando = ativo;
  formulario.setAttribute('aria-busy', String(ativo));
  campoCep.disabled = ativo;
  botaoConsultar.disabled = ativo;
  botaoConsultar.textContent = ativo ? 'Consultando…' : 'Consultar';
  for (const botao of listaHistorico.querySelectorAll('button')) botao.disabled = ativo;
  limparHistorico.disabled = ativo || historico.listar().length === 0;
}

async function apresentarConsulta(entrada, orientarFoco, incluirNoHistorico = true) {
  // Nesta etapa, permita uma consulta por vez. Cancelamento entra na etapa 5.
  if (consultando) return;
  limparApresentacao();
  vazio.hidden = true;
  if (window.CepBasico.normalizarCep(entrada)) {
    alterarCarregamento(true);
    mensagem.textContent = 'Consultando o ViaCEP…';
    mensagem.setAttribute('data-tipo', 'carregando');
    mensagem.hidden = false;
  }
  let consulta;
  try { consulta = await window.CepBasico.consultarCep(entrada); }
  finally { alterarCarregamento(false); }
  mensagem.hidden = true;
  mensagem.removeAttribute('data-tipo');
  if (consulta.sucesso) {
    const endereco = consulta.endereco;
    campoCep.value = endereco.cep;
    document.getElementById('cep-resultado').textContent = endereco.cep;
    logradouro.textContent = endereco.logradouro;
    document.getElementById('bairro').textContent = endereco.bairro;
    document.getElementById('cidade').textContent = endereco.cidade + ' / ' + endereco.uf;
    resultado.hidden = false;
    if (incluirNoHistorico) {
      historico.registrar(endereco.cep);
      apresentarHistorico();
    }
    if (orientarFoco) logradouro.focus();
  } else {
    mensagem.textContent = consulta.mensagem;
    mensagem.hidden = false;
    if (!window.CepBasico.normalizarCep(entrada)) campoCep.setAttribute('aria-invalid', 'true');
    if (orientarFoco) campoCep.focus();
  }
}

formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();
  apresentarConsulta(campoCep.value, true);
});

campoCep.addEventListener('input', function () {
  // Ao corrigir a entrada, retire o erro e o endereço da consulta anterior.
  limparApresentacao();
  vazio.hidden = false;
});

limparHistorico.addEventListener('click', function () {
  historico.limpar();
  apresentarHistorico();
  document.getElementById('titulo-historico').focus();
});

apresentarHistorico();

// Preserve links da primeira etapa que já contêm o parâmetro de CEP.
const parametros = new URLSearchParams(window.location.search);
if (parametros.has('cep')) {
  const entrada = parametros.get('cep');
  campoCep.value = entrada;
  // Recarregar um link antigo não deve recriar um histórico recém-limpo.
  apresentarConsulta(entrada, false, false);
}
