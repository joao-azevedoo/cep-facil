// Etapa 1: o formulário HTML recarrega a página; não há interceptação de eventos.
const parametros = new URLSearchParams(window.location.search);
if (parametros.has('cep')) {
  const entrada = parametros.get('cep');
  const consulta = window.CepBasico.consultarCep(entrada);
  document.getElementById('cep').value = entrada;
  document.getElementById('vazio').hidden = true;
  if (consulta.sucesso) {
    const endereco = consulta.endereco;
    document.getElementById('cep').value = endereco.cep;
    document.getElementById('cep-resultado').textContent = endereco.cep;
    document.getElementById('logradouro').textContent = endereco.logradouro;
    document.getElementById('bairro').textContent = endereco.bairro;
    document.getElementById('cidade').textContent = endereco.cidade + ' / ' + endereco.uf;
    document.getElementById('resultado').hidden = false;
  } else {
    document.getElementById('mensagem').textContent = consulta.mensagem;
    document.getElementById('mensagem').hidden = false;
    document.getElementById('cep').setAttribute('aria-invalid', 'true');
  }
}
