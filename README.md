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

Em 14/10, 23 testes automatizados passaram, cobrindo validação, contratos das fontes, início paralelo, falha do complemento, alternativa, tempos limites, cancelamento e persistência. Os testes usam respostas controladas e não dependem da disponibilidade do serviço externo.

No navegador, a consulta real exibiu Avenida Rio Branco, estado Rio de Janeiro e região Sudeste. Páginas de QA locais e ignoradas simularam falhas e atraso: a BrasilAPI real respondeu quando o ViaCEP falhou; o endereço permaneceu visível quando o IBGE falhou; Cancelar preservou o histórico e retornou o foco ao campo; um ViaCEP sem resposta acionou a alternativa após o limite. Uma resposta antiga de São Paulo, cujo transporte ignorou o cancelamento, não substituiu o resultado mais recente do Rio nem entrou no histórico. Console sem erros ou avisos. A sequência e os critérios estão em [PLANO_DIARIO.md](PLANO_DIARIO.md).

## Conceitos do segundo incremento

- Referências ao formulário, campo, mensagem e resultado com `getElementById`.
- Eventos `submit` e `input` com `addEventListener`.
- `preventDefault` para evitar a navegação convencional do formulário.
- Alterações de `textContent`, `value`, `hidden` e `aria-invalid` no DOM.
- Funções para apresentar a consulta e limpar o estado anterior.
- Foco programático para ler o resultado ou corrigir uma entrada usando o teclado.

## Conceitos do terceiro incremento

- `localStorage` para ler, salvar e remover uma chave própria da aplicação.
- `JSON.stringify` e `JSON.parse` para persistir a lista de CEPs.
- Arrays, `filter` e `slice` para evitar duplicatas, ordenar por uso recente e limitar a cinco consultas.
- Criação de botões com `createElement` e `textContent` para reabrir consultas.
- Tratamento de dados inválidos e falhas de leitura/gravação sem interromper a ferramenta.

## Conceitos do quarto incremento

- `fetch` para consultar o endereço HTTPS do ViaCEP, após validar oito dígitos.
- `async` e `await` para aguardar a resposta e a conversão com `response.json()`.
- Conferência de `response.ok`, do campo `erro` e dos dados recebidos antes de mostrar o endereço.
- Mapeamento de `localidade` para cidade e apresentação segura com `textContent`.
- `try`, `catch` e `finally` para tratar falhas e liberar os controles da consulta.

## Conceitos do quinto incremento

- `Promise.all` para iniciar endereço e lista de estados em paralelo, isolando a falha do complemento.
- `find` para selecionar o estado pela UF do endereço encontrado.
- `AbortController` e `AbortSignal` para interromper requisições ao cancelar, editar ou iniciar outra busca.
- `setTimeout`, `clearTimeout` e `Promise.race` para limitar a requisição e a leitura do JSON a seis segundos.
- Tentativa sequencial de uma fonte alternativa quando a principal falha.
- Identificador crescente de consulta para impedir que respostas antigas modifiquem a apresentação e o histórico.

## Organização

- `index.html`: página e formulário.
- `css/tokens.css`: tokens Organic para distribuição independente.
- `css/estilos.css`: estilos próprios.
- `js/cep.js`: validação, fontes ViaCEP/BrasilAPI, consulta paralela ao IBGE e tempos limites.
- `js/historico.js`: persistência, limite e recuperação segura do histórico.
- `js/app.js`: eventos, cancelamento, proteção contra respostas antigas, DOM, histórico e leitura de links com parâmetro de busca.
- `docs/decisoes.md`: escolhas de implementação desta evolução.
- `estado.json`: etapa local, envio e datas efetivas.
- `CHANGELOG.md`: mudanças realizadas, sem registrar etapas futuras como concluídas.

O rodapé aponta para o perfil do autor da conta de destino. O site pessoal do aluno pode substituí-lo quando fornecido. O ícone utiliza traços Lucide; veja `LICENCA-ICONES.txt`.

## Calendário atual

O acesso ao repositório foi liberado em 11/10. O usuário estendeu a rotina até **14/10/2026**, mantendo uma nova etapa por dia. O histórico foi implementado em 12/10, o ViaCEP em 13/10 e a etapa de concorrência em 14/10. Após a última conferência, a rotina deve encerrar no prazo autorizado. Permanecem pendentes **etapa 6: Clipboard e alternativa manual**, e **etapa 7: GitHub Pages, revisão final e monetização**. O site ainda não foi publicado neste repositório. O plano registra o calendário original e o reajuste sem alterar datas dos commits.

## Autoria dos commits

Em 12/10, a pedido do usuário, a identidade Git deste repositório foi configurada para `joao-azevedoo`, conta autenticada e confirmada no GitHub. Novos commits usam seu email `noreply` correspondente ao ID público da conta. A configuração é local a este projeto.

O usuário também autorizou corrigir a autoria dos cinco commits antigos. A correção foi enviada e conferida no GitHub: todo o histórico de `main` agora está associado a `joao-azevedoo`, como autor e committer. Arquivos, mensagens e datas foram preservados; somente as identidades e os identificadores resultantes mudaram. Há uma cópia de segurança local do histórico original e a correspondência dos commits está no `CHANGELOG.md`.
