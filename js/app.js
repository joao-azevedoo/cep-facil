// Etapas 2 a 5: eventos, histórico e proteção contra respostas de consultas anteriores.
const formulario = document.getElementById('formulario-consulta');
const botaoCancelar = document.getElementById('cancelar-consulta');
const campoCep = document.getElementById('cep');
const mensagem = document.getElementById('mensagem');
const resultado = document.getElementById('resultado');
const vazio = document.getElementById('vazio');
const logradouro = document.getElementById('logradouro');
const historico = window.CepHistorico.criarHistorico();
const listaHistorico = document.getElementById('lista-historico');
const limparHistorico = document.getElementById('limpar-historico');
let consultaAtiva = null;
let numeroConsulta = 0;

function apresentarHistorico() {
  const ceps = historico.listar();
  listaHistorico.replaceChildren();
  for (const cep of ceps) {
    const item = document.createElement('li');
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'botao-sutil';
    botao.textContent = cep;
    botao.setAttribute('aria-label', 'Consultar novamente o CEP ' + cep);
    botao.addEventListener('click', function () {
      campoCep.value = cep;
      apresentarConsulta(cep, true);
    });
    item.appendChild(botao);
    listaHistorico.appendChild(item);
  }
  limparHistorico.disabled = ceps.length === 0;
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
  formulario.setAttribute('aria-busy', String(ativo));
  botaoCancelar.hidden = !ativo;
}

function cancelarConsulta() {
  numeroConsulta++;
  consultaAtiva?.abort();
  consultaAtiva = null;
  alterarCarregamento(false);
}

async function apresentarConsulta(entrada, orientarFoco, incluirNoHistorico = true) {
  cancelarConsulta();
  const numeroAtual = numeroConsulta;
  const controlador = new AbortController();
  consultaAtiva = controlador;
  limparApresentacao();
  vazio.hidden = true;
  if (window.CepBasico.normalizarCep(entrada)) {
    alterarCarregamento(true);
    mensagem.textContent = 'Consultando endereço e estado…';
    mensagem.setAttribute('data-tipo', 'carregando');
    mensagem.hidden = false;
  }
  let consulta;
  try { consulta = await window.CepBasico.consultarCep(entrada, undefined, { signal: controlador.signal }); }
  catch { consulta = { sucesso: false, mensagem: 'Não foi possível consultar o endereço. Tente novamente.' }; }
  // Uma resposta antiga não pode mudar o endereço, o foco nem o histórico atual.
  if (numeroAtual !== numeroConsulta) return;
  consultaAtiva = null;
  alterarCarregamento(false);
  mensagem.hidden = true;
  mensagem.removeAttribute('data-tipo');
  if (consulta.sucesso) {
    const endereco = consulta.endereco;
    campoCep.value = endereco.cep;
    document.getElementById('cep-resultado').textContent = endereco.cep;
    logradouro.textContent = endereco.logradouro;
    document.getElementById('bairro').textContent = endereco.bairro;
    document.getElementById('cidade').textContent = endereco.cidade + ' / ' + endereco.uf;
    const fonte = document.getElementById('fonte-endereco');
    fonte.textContent = consulta.fonte;
    fonte.href = consulta.fonte === 'BrasilAPI' ? 'https://brasilapi.com.br/' : 'https://viacep.com.br/';
    document.getElementById('dados-estado').hidden = !consulta.complemento;
    document.getElementById('estado').textContent = consulta.complemento?.estado || '';
    document.getElementById('regiao').textContent = consulta.complemento?.regiao || '';
    document.getElementById('aviso-estado').hidden = !consulta.aviso;
    document.getElementById('aviso-estado').textContent = consulta.aviso || '';
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
  // Editar a entrada cancela a busca anterior antes de limpar a apresentação.
  cancelarConsulta();
  limparApresentacao();
  vazio.hidden = false;
});

botaoCancelar.addEventListener('click', function () {
  cancelarConsulta();
  limparApresentacao();
  vazio.hidden = true;
  mensagem.textContent = 'Consulta cancelada. Você pode tentar outro CEP.';
  mensagem.setAttribute('data-tipo', 'informacao');
  mensagem.hidden = false;
  campoCep.focus();
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
