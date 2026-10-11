# CEP Fácil — etapa 2 de 7

Projeto acadêmico para consultar um CEP e encontrar seu endereço, desenvolvido em sete incrementos diários. HTML, CSS e JavaScript puro, sem backend próprio.

**Repositório:** [joao-azevedoo/cep-facil](https://github.com/joao-azevedoo/cep-facil). A primeira etapa foi preparada em 06/10 e enviada em 11/10/2026, após a autorização da conta de destino. A publicação do site no GitHub Pages está prevista para a etapa 7.

## O que esta versão faz

Valida e formata o CEP, procura num array de objetos e exibe o endereço. A base de demonstração contém **somente dois CEPs**: `01001-000` e `01310-100`. Os exemplos foram conferidos no ViaCEP durante a preparação. Não se apresenta como uma base nacional de consulta nesta etapa.

O formulário agora atualiza o endereço e as mensagens sem recarregar a página. Consulte pelo botão ou pela tecla Enter. Quando a entrada é inválida, o foco volta ao campo; quando o endereço é encontrado, o foco vai para o resultado. Alterar o CEP limpa a mensagem e o endereço anteriores. Os links da primeira etapa com `?cep=...` continuam funcionando.

A base ainda contém somente os dois exemplos. Histórico local e consulta nacional à API entram nas etapas 3 e 4.

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
node --test testes/cep.test.cjs
```

No navegador, busque `01001000` pelo botão e `01310-100` pelo Enter: o endereço muda na mesma página, sem navegação de formulário. Experimente `123`, corrija a entrada e confirme que o erro anterior desaparece. Um CEP válido fora da base deve explicar a limitação da demonstração, sem marcar o formato como inválido. Abra também `index.html?cep=01001000` para conferir um link antigo.

Em 11/10, esses fluxos foram conferidos no navegador; foco correto e console sem erros ou avisos. A sequência e os critérios estão em [PLANO_DIARIO.md](PLANO_DIARIO.md).

## Conceitos do segundo incremento

- Referências ao formulário, campo, mensagem e resultado com `getElementById`.
- Eventos `submit` e `input` com `addEventListener`.
- `preventDefault` para evitar a navegação convencional do formulário.
- Alterações de `textContent`, `value`, `hidden` e `aria-invalid` no DOM.
- Funções para apresentar a consulta e limpar o estado anterior.
- Foco programático para ler o resultado ou corrigir uma entrada usando o teclado.

## Organização

- `index.html`: página e formulário.
- `css/tokens.css`: tokens Organic para distribuição independente.
- `css/estilos.css`: estilos próprios.
- `js/cep.js`: regras e base de demonstração.
- `js/app.js`: eventos do formulário, atualização do DOM e leitura de links com parâmetro de busca.
- `estado.json`: etapa local, envio e datas efetivas.
- `CHANGELOG.md`: mudanças realizadas, sem registrar etapas futuras como concluídas.

O rodapé aponta para o perfil do autor da conta de destino. O site pessoal do aluno pode substituí-lo quando fornecido. O ícone utiliza traços Lucide; veja `LICENCA-ICONES.txt`.

## Calendário atual

O acesso ao repositório foi liberado em 11/10. O usuário estendeu a rotina até **14/10/2026, às 9h de Brasília**, mantendo uma nova etapa por dia. A previsão é histórico em 12/10, ViaCEP em 13/10 e concorrência em 14/10. Clipboard e GitHub Pages ficam pendentes de uma nova data autorizada. O plano registra o calendário original e o reajuste sem alterar datas dos commits.
