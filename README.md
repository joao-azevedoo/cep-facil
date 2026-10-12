# CEP Fácil — etapa 3 de 7

Projeto acadêmico para consultar um CEP e encontrar seu endereço, desenvolvido em sete incrementos diários. HTML, CSS e JavaScript puro, sem backend próprio.

**Repositório:** [joao-azevedoo/cep-facil](https://github.com/joao-azevedoo/cep-facil). A primeira etapa foi preparada em 06/10 e enviada em 11/10/2026, após a autorização da conta de destino. A publicação do site no GitHub Pages está prevista para a etapa 7.

## O que esta versão faz

Valida e formata o CEP, procura num array de objetos e exibe o endereço. A base de demonstração contém **somente dois CEPs**: `01001-000` e `01310-100`. Os exemplos foram conferidos no ViaCEP durante a preparação. Não se apresenta como uma base nacional de consulta nesta etapa.

O formulário agora atualiza o endereço e as mensagens sem recarregar a página. Consulte pelo botão ou pela tecla Enter. Quando a entrada é inválida, o foco volta ao campo; quando o endereço é encontrado, o foco vai para o resultado. Alterar o CEP limpa a mensagem e o endereço anteriores. Os links da primeira etapa com `?cep=...` continuam funcionando.

A base ainda contém somente os dois exemplos. A consulta nacional à API entra na etapa 4.

O histórico guarda até **cinco CEPs encontrados**, do mais recente para o mais antigo, neste navegador. Uma consulta repetida volta ao início sem duplicar o CEP. Clique em um CEP salvo para reabrir a consulta ou use **Limpar histórico**. O histórico continua disponível depois de recarregar; resultados inválidos ou fora da base não são acrescentados.

Somente os CEPs são guardados em `localStorage`, sem envio a outro serviço. Se o navegador bloquear a gravação, as consultas continuam funcionando com histórico temporário e um aviso informa a limitação. Recarregar um link antigo com `?cep=...` exibe seu endereço sem recriar um histórico recém-limpo.

## Abrir

Abra `index.html` no navegador. Para uma prévia com servidor estático local:

```sh
node ferramentas/servidor.cjs
```

Acesse `http://127.0.0.1:4176/`. Esse servidor serve apenas arquivos para desenvolvimento e não integra a aplicação publicada.

## Conceitos do primeiro incremento

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

No navegador, busque `01001000` pelo botão e `01310-100` pelo Enter: o endereço muda na mesma página, sem navegação de formulário. Experimente `123`, corrija a entrada e confirme que o erro anterior desaparece. Um CEP válido fora da base deve explicar a limitação da demonstração, sem marcar o formato como inválido. Abra também `index.html?cep=01001000` para conferir um link antigo.

Em 11/10, esses fluxos foram conferidos no navegador; foco correto e console sem erros ou avisos. A sequência e os critérios estão em [PLANO_DIARIO.md](PLANO_DIARIO.md).

Para conferir o histórico, consulte os dois exemplos e recarregue a página. Os botões dos CEPs devem continuar disponíveis. Reabra o mais antigo, confira seu endereço e veja que ele volta para o início sem duplicação. Limpe o histórico e recarregue novamente: a lista deve permanecer vazia, inclusive em um link antigo com CEP na URL. Um CEP fora da base não deve aparecer na lista.

Em 12/10, esses fluxos foram conferidos no navegador, com foco correto e console sem erros ou avisos. Oito testes automatizados passaram, incluindo o limite de cinco registros com seis entradas de teste, recuperação de dados corrompidos e armazenamento bloqueado. Essas entradas adicionais pertencem apenas aos testes; a base de demonstração da aplicação continua com dois CEPs.

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

## Organização

- `index.html`: página e formulário.
- `css/tokens.css`: tokens Organic para distribuição independente.
- `css/estilos.css`: estilos próprios.
- `js/cep.js`: regras e base de demonstração.
- `js/historico.js`: persistência, limite e recuperação segura do histórico.
- `js/app.js`: eventos do formulário, atualização do DOM, botões do histórico e leitura de links com parâmetro de busca.
- `docs/decisoes.md`: escolhas de implementação desta evolução.
- `estado.json`: etapa local, envio e datas efetivas.
- `CHANGELOG.md`: mudanças realizadas, sem registrar etapas futuras como concluídas.

O rodapé aponta para o perfil do autor da conta de destino. O site pessoal do aluno pode substituí-lo quando fornecido. O ícone utiliza traços Lucide; veja `LICENCA-ICONES.txt`.

## Calendário atual

O acesso ao repositório foi liberado em 11/10. O usuário estendeu a rotina até **14/10/2026, às 9h de Brasília**, mantendo uma nova etapa por dia. O histórico foi implementado em 12/10. A previsão seguinte é ViaCEP em 13/10 e concorrência em 14/10. Clipboard e GitHub Pages ficam pendentes de uma nova data autorizada. O plano registra o calendário original e o reajuste sem alterar datas dos commits.

## Autoria dos commits

Em 12/10, a pedido do usuário, a identidade Git deste repositório foi configurada para `joao-azevedoo`, conta autenticada e confirmada no GitHub. Novos commits usam seu email `noreply` correspondente ao ID público da conta. A configuração é local a este projeto.

O usuário também autorizou corrigir a autoria dos cinco commits antigos. A correção foi enviada e conferida no GitHub: todo o histórico de `main` agora está associado a `joao-azevedoo`, como autor e committer. Arquivos, mensagens e datas foram preservados; somente as identidades e os identificadores resultantes mudaram. Há uma cópia de segurança local do histórico original e a correspondência dos commits está no `CHANGELOG.md`.
