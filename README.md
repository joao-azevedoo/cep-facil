# CEP Fácil — etapa 4 de 7

Projeto acadêmico para consultar um CEP e encontrar seu endereço, desenvolvido em sete incrementos diários. HTML, CSS e JavaScript puro, sem backend próprio.

**Repositório:** [joao-azevedoo/cep-facil](https://github.com/joao-azevedoo/cep-facil). A primeira etapa foi preparada em 06/10 e enviada em 11/10/2026, após a autorização da conta de destino. A publicação do site no GitHub Pages está prevista para a etapa 7.

## O que esta versão faz

Valida e formata o CEP, consulta o [ViaCEP](https://viacep.com.br/) pela internet e exibe logradouro, bairro e cidade/UF. A base de demonstração com dois endereços foi substituída pela API: agora é possível buscar CEPs de todo o Brasil, como `01001-000` (São Paulo) e `20040-002` (Rio de Janeiro).

O formulário agora atualiza o endereço e as mensagens sem recarregar a página. Consulte pelo botão ou pela tecla Enter. Quando a entrada é inválida, o foco volta ao campo; quando o endereço é encontrado, o foco vai para o resultado. Alterar o CEP limpa a mensagem e o endereço anteriores. Os links da primeira etapa com `?cep=...` continuam funcionando.

Durante a busca, a página informa **Consultando o ViaCEP…** e bloqueia temporariamente o campo e os botões de consulta para permitir uma requisição por vez. CEP inexistente recebe uma mensagem própria; falha de conexão ou resposta inválida pede uma nova tentativa. Um CEP geral sem rua ou bairro ainda mostra cidade/UF, com textos explicativos para os campos vazios. É preciso estar conectado à internet.

O histórico guarda até **cinco CEPs encontrados**, do mais recente para o mais antigo, neste navegador. Uma consulta repetida volta ao início sem duplicar o CEP. Clique em um CEP salvo para consultar novamente na API ou use **Limpar histórico**. O histórico continua disponível depois de recarregar; entradas inválidas, CEPs inexistentes e buscas que falharam não são acrescentados.

Somente os CEPs são guardados em `localStorage`; a lista do histórico permanece neste navegador. Cada consulta envia o CEP informado ao ViaCEP para obter o endereço. Se o navegador bloquear a gravação local, as consultas continuam funcionando com histórico temporário e um aviso informa a limitação. Recarregar um link antigo com `?cep=...` consulta seu endereço sem recriar um histórico recém-limpo.

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

No navegador, busque `20040002` pelo botão e `20040-002` pelo Enter: o resultado deve mostrar Avenida Rio Branco, Centro, Rio de Janeiro / RJ, sem navegação de formulário. Experimente `123` e confira a validação local; `99999999` deve informar CEP não encontrado, sem marcar o formato como inválido. Desconecte a internet, tente consultar e confira a mensagem de falha quando a requisição terminar; reconecte para tentar novamente. Tempo limite, cancelamento e fonte alternativa entram na etapa 5.

Recarregue a página e reabra o CEP salvo: o endereço deve ser consultado novamente, sem duplicar o histórico. Abra `index.html?cep=01001000` para conferir um link antigo. Limpe o histórico e recarregue esse link: o endereço reaparece, mas o histórico permanece vazio. Uma consulta inexistente ou que falhou não deve aparecer na lista.

Em 13/10, doze testes automatizados passaram: validação antes da requisição, URL e transformação do JSON, CEP inexistente, falhas de rede/HTTP/JSON, resposta incompleta ou de outro CEP, CEP geral e os cinco testes de persistência. Os testes usam respostas controladas e não dependem da disponibilidade do serviço externo.

No navegador, consultas reais de São Paulo e Rio de Janeiro, busca por Enter, reabertura e persistência do histórico, validação e CEP inexistente foram conferidos. Uma página de QA local e ignorada simulou falha de conexão: os controles foram liberados, o foco voltou ao campo e o histórico foi preservado. Links antigos e limpeza após recarregar continuaram funcionando; console sem erros ou avisos e prévia visual conferida. A sequência e os critérios estão em [PLANO_DIARIO.md](PLANO_DIARIO.md).

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

## Organização

- `index.html`: página e formulário.
- `css/tokens.css`: tokens Organic para distribuição independente.
- `css/estilos.css`: estilos próprios.
- `js/cep.js`: validação, formatação e consulta real ao ViaCEP.
- `js/historico.js`: persistência, limite e recuperação segura do histórico.
- `js/app.js`: eventos do formulário, carregamento, atualização do DOM, botões do histórico e leitura de links com parâmetro de busca.
- `docs/decisoes.md`: escolhas de implementação desta evolução.
- `estado.json`: etapa local, envio e datas efetivas.
- `CHANGELOG.md`: mudanças realizadas, sem registrar etapas futuras como concluídas.

O rodapé aponta para o perfil do autor da conta de destino. O site pessoal do aluno pode substituí-lo quando fornecido. O ícone utiliza traços Lucide; veja `LICENCA-ICONES.txt`.

## Calendário atual

O acesso ao repositório foi liberado em 11/10. O usuário estendeu a rotina até **14/10/2026, às 9h de Brasília**, mantendo uma nova etapa por dia. O histórico foi implementado em 12/10 e o ViaCEP em 13/10. A próxima etapa prevista é concorrência em 14/10. Clipboard e GitHub Pages ficam pendentes de uma nova data autorizada. O plano registra o calendário original e o reajuste sem alterar datas dos commits.

## Autoria dos commits

Em 12/10, a pedido do usuário, a identidade Git deste repositório foi configurada para `joao-azevedoo`, conta autenticada e confirmada no GitHub. Novos commits usam seu email `noreply` correspondente ao ID público da conta. A configuração é local a este projeto.

O usuário também autorizou corrigir a autoria dos cinco commits antigos. A correção foi enviada e conferida no GitHub: todo o histórico de `main` agora está associado a `joao-azevedoo`, como autor e committer. Arquivos, mensagens e datas foram preservados; somente as identidades e os identificadores resultantes mudaram. Há uma cópia de segurança local do histórico original e a correspondência dos commits está no `CHANGELOG.md`.
