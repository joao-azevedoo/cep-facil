// Etapa 2: eventos atualizam o DOM sem recarregar a página.
const formulario = document.getElementById('formulario-consulta');
const campoCep = document.getElementById('cep');
const mensagem = document.getElementById('mensagem');
const resultado = document.getElementById('resultado');
const vazio = document.getElementById('vazio');
const logradouro = document.getElementById('logradouro');

function limparApresentacao() {
  mensagem.hidden = true;
  mensagem.textContent = '';
  resultado.hidden = true;
  campoCep.removeAttribute('aria-invalid');
}

function apresentarConsulta(entrada, orientarFoco) {
  limparApresentacao();
  vazio.hidden = true;
  const consulta = window.CepBasico.consultarCep(entrada);
  if (consulta.sucesso) {
    const endereco = consulta.endereco;
    campoCep.value = endereco.cep;
    document.getElementById('cep-resultado').textContent = endereco.cep;
    logradouro.textContent = endereco.logradouro;
    document.getElementById('bairro').textContent = endereco.bairro;
    document.getElementById('cidade').textContent = endereco.cidade + ' / ' + endereco.uf;
    resultado.hidden = false;
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

// Preserve links da primeira etapa que já contêm o parâmetro de CEP.
const parametros = new URLSearchParams(window.location.search);
if (parametros.has('cep')) {
  const entrada = parametros.get('cep');
  campoCep.value = entrada;
  apresentarConsulta(entrada, false);
}
