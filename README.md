# CEP Fácil — etapa 5 de 7

Projeto acadêmico para consultar um CEP e encontrar seu endereço, desenvolvido em sete incrementos diários. HTML, CSS e JavaScript puro, sem backend próprio.

**Repositório:** [joao-azevedoo/cep-facil](https://github.com/joao-azevedoo/cep-facil). A primeira etapa foi preparada em 06/10 e enviada em 11/10/2026, após a autorização da conta de destino. A publicação do site no GitHub Pages está prevista para a etapa 7.

## O que esta versão faz

Valida e formata o CEP, consulta o [ViaCEP](https://viacep.com.br/) pela internet e exibe logradouro, bairro e cidade/UF. Em paralelo, consulta o [IBGE](https://servicodados.ibge.gov.br/api/docs/localidades) para mostrar o nome do estado e sua região. Agora é possível buscar CEPs de todo o Brasil, como `01001-000` (São Paulo) e `20040-002` (Rio de Janeiro).

O formulário agora atualiza o endereço e as mensagens sem recarregar a página. Consulte pelo botão ou pela tecla Enter. Quando a entrada é inválida, o foco volta ao campo; quando o endereço é encontrado, o foco vai para o resultado. Alterar o CEP limpa a mensagem e o endereço anteriores. Os links da primeira etapa com `?cep=...` continuam funcionando.

Durante a busca, a página informa **Consultando endereço e estado…** e permite usar **Cancelar**, editar o campo ou iniciar outra consulta. Editar ou consultar novamente interrompe a busca anterior. Uma resposta antiga não muda o endereço, o foco nem o histórico da busca atual.

Cada requisição, incluindo a leitura do JSON, tem limite de **seis segundos**. Se o ViaCEP falhar ou exceder esse limite, a aplicação tenta a [BrasilAPI](https://brasilapi.com.br/docs), também com limite de seis segundos. O resultado identifica a fonte usada. Um CEP informado como inexistente pelo ViaCEP não aciona a alternativa; uma falha de ambas as fontes pede nova tentativa. É preciso estar conectado à internet.

Se o IBGE falhar, demorar ou não fornecer o estado correspondente à UF encontrada, o endereço continua disponível com um aviso; apenas o complemento de estado/região fica indisponível. Um CEP geral sem rua ou bairro ainda mostra cidade/UF, com textos explicativos para os campos vazios.

O histórico guarda até **cinco CEPs encontrados**, do mais recente para o mais antigo, neste navegador. Uma consulta repetida volta ao início sem duplicar o CEP. Clique em um CEP salvo para consultar novamente na API ou use **Limpar histórico**. O histórico continua disponível depois de recarregar; entradas inválidas, CEPs inexistentes e buscas que falharam não são acrescentados.

Somente os CEPs são guardados em `localStorage`; a lista do histórico permanece neste navegador. Cada consulta envia o CEP informado ao ViaCEP e, quando necessário, à BrasilAPI. O IBGE recebe uma consulta à lista de estados, sem o CEP. Se o navegador bloquear a gravação local, as consultas continuam funcionando com histórico temporário e um aviso informa a limitação. Recarregar um link antigo com `?cep=...` consulta seu endereço sem recriar um histórico recém-limpo. Consultas canceladas não são salvas.

## Abrir

Abra `index.html` no navegador. Para uma prévia com servidor estático local:

```sh
node ferramentas/servidor.cjs
```

Acesse `http://127.0.0.1:4176/`. Esse servidor serve apenas arquivos para desenvolvimento e não integra a aplicação publicada.

## Conceitos do primeiro incremento

Na etapa 1, a pesquisa usava uma base de demonstração. O histórico Git preserva essa implementação; a etapa 4 substitui a pesquisa local pela API.

- Variáveis `const` e `let`, strings e booleanos.
- Operações com strings para validar e formatar oito números.
- Condicionais para CEP inválido, encontrado e fora da base.
- Funções `normalizarCep`, `formatarCep` e `consultarCep`.
- Array `enderecosDemonstracao`, objetos de endereço e laço de busca.
- Ligação mínima entre JavaScript e HTML para mostrar o resultado do envio convencional do formulário.

## Conferir a etapa

```sh
node --test testes/cep.test.cjs testes/historico.test.cjs
```

No navegador, busque `20040002` pelo botão e `20040-002` pelo Enter: o resultado deve mostrar Avenida Rio Branco, Centro, Rio de Janeiro / RJ, estado Rio de Janeiro e região Sudeste, sem navegação de formulário. Experimente `123` e confira a validação local; `99999999` deve informar CEP não encontrado, sem marcar o formato como inválido. Durante uma busca, clique em Cancelar ou altere a entrada: o resultado anterior não deve aparecer depois.

Desconecte a internet e tente consultar: os tempos limites encerram as tentativas de endereço e complemento; reconecte para tentar novamente. Uma falha isolada do IBGE mantém o endereço visível. Quando a fonte alternativa encontra o endereço, o resultado identifica BrasilAPI. A busca completa pode aguardar até dois limites sucessivos de seis segundos se ambas as fontes de endereço demorarem.

Recarregue a página e reabra o CEP salvo: o endereço deve ser consultado novamente, sem duplicar o histórico. Abra `index.html?cep=01001000` para conferir um link antigo. Limpe o histórico e recarregue esse link: o endereço reaparece, mas o histórico permanece vazio. Uma consulta inexistente ou que falhou não deve aparecer na lista.

