# Histórico de desenvolvimento

## 12/10/2026 — Correção autorizada da autoria anterior

- O usuário autorizou explicitamente substituir o histórico de `main` para corrigir a autoria dos cinco commits antigos para `joao-azevedoo`.
- Cópia de segurança completa e verificada mantida localmente em `.operacao/antes-da-correcao-autoria.bundle`, sem envio ao repositório.
- Todos os seis commits existentes passaram a ter autor e committer associados a `joao-azevedoo` no GitHub. O sexto já usava essa identidade e recebeu novo identificador porque seu antecessor mudou.
- Cada árvore de arquivos, mensagem, data de autoria e data de commit foi comparada com o original e permaneceu idêntica. O envio usou proteção contra mudanças remotas com `force-with-lease`, limitado ao `main` deste repositório.
- Autoria conferida pela API do GitHub em cada commit corrigido; estado e plano ajustados aos identificadores atuais. A etapa funcional continua sendo a etapa 3.

Os registros de envio abaixo mantêm os identificadores observados na ocasião. A correspondência após a correção é:

| Commit original | Commit atual | Registro |
| --- | --- | --- |
| `34ef63e` | `b9b6d87` | Etapa 1 |
| `5b5d55c` | `ed420b5` | Etapa 2 |
| `9623ac6` | `adb5e64` | Confirmação do envio da etapa 2 |
| `1a7d792` | `bef6051` | Etapa 3 |
| `b278dfe` | `aaa1557` | Confirmação do envio da etapa 3 |
| `a71cb52` | `b0197dc` | Configuração da autoria |

## 12/10/2026 — Configuração de autoria solicitada pelo usuário

- Perfil autenticado `joao-azevedoo` confirmado pela API do GitHub, com acesso de escrita ao repositório de destino.
- Autor e committer configurados localmente para `joao-azevedoo`, usando o email `noreply` correspondente ao ID público da conta. A configuração global e os outros projetos foram preservados.
- Instruções para as próximas atualizações ajustadas para conferir a autoria antes de cada commit. Nesse momento, os cinco commits anteriores aguardavam autorização específica para corrigir sua autoria; a autorização e a correção posteriores estão registradas acima.

Esta alteração é uma correção de configuração. A etapa funcional continua sendo a etapa 3; nenhum incremento futuro foi antecipado.

## 12/10/2026 — Etapa 3: histórico local

- Até cinco consultas encontradas salvas em `localStorage`, do uso mais recente para o mais antigo, sem duplicar CEPs com e sem hífen.
- Botões para reabrir uma consulta salva e limpar somente o histórico desta aplicação.
- Persistência após recarregar, leitura segura de dados inválidos e histórico temporário com aviso quando o armazenamento é bloqueado.
- Links antigos continuam exibindo o endereço, sem recriar registros apagados ao recarregar a página.
- Decisões documentadas em `docs/decisoes.md`. A base permanece com dois CEPs; nenhum recurso das etapas 4 a 7 foi antecipado.

Verificação: oito testes automatizados aprovados, cobrindo validação da consulta, persistência, limite de cinco com uma sexta entrada de teste, duplicatas, limpeza sem afetar outra chave, dados corrompidos e armazenamento bloqueado. No navegador, os dois exemplos foram salvos e recuperados após recarregar; reabrir um item o moveu para o início sem duplicá-lo; um CEP fora da base não foi salvo. Limpeza e recarregamento confirmaram a lista vazia, inclusive em um link antigo. Foco correto; console sem erros ou avisos; prévia visual conferida.

Envio confirmado em 12/10/2026: commit funcional `1a7d79221cccb456443042a19abb35d5a3f55d26` conferido em `refs/heads/main` de `joao-azevedoo/cep-facil`. O estado foi atualizado após essa evidência. O envio contém somente a evolução de código; o site permanece para a etapa 7.

## 11/10/2026 — Etapa 2: DOM e eventos

- Formulário interceptado com `submit` e `preventDefault`; consulta pelo botão ou Enter sem navegação convencional.
- Mensagens e endereço atualizados no DOM, sem recarregar a página.
- Edição da entrada limpa o erro e o endereço anteriores. Formato inválido recebe `aria-invalid`; CEP válido fora da base recebe somente a explicação da limitação.
- Foco vai para o resultado encontrado ou retorna ao campo para correção; links antigos com `?cep=...` foram preservados.
- Rotina estendida pelo usuário até 14/10, às 9h de Brasília, mantendo uma etapa nova por dia. As etapas 6 e 7 permanecem sem nova data autorizada.

Verificação: consulta de `01001000` pelo botão e `01310-100` por Enter mantiveram a URL original e mostraram os endereços corretos; entrada incompleta, correção do erro, retirada do resultado anterior, CEP fora da base e link antigo conferidos. Foco correto nas transições; console sem erros ou avisos. Sintaxe JavaScript e diferenças de arquivos verificadas. Nenhum recurso das etapas 3 a 7 foi antecipado.

Envio confirmado em 11/10/2026: commit funcional `5b5d55ce7475c47e2e07b3e79a65b37759bff38b` conferido em `refs/heads/main` de `joao-azevedoo/cep-facil`. O estado foi atualizado após essa evidência.

## 11/10/2026 — Envio da primeira etapa

- Conta `joao-azevedoo` autenticada pelo usuário no Git Credential Manager; permissão de escrita conferida no repositório exato.
- Etapa 1 enviada ao repositório público `joao-azevedoo/cep-facil`, anteriormente vazio.
- Commit `34ef63e31c83cd566bb98945f93f52fdf13fce12` conferido no ramo remoto `main`, preservando a autoria e a data original de 06/10.
- Três testes da primeira etapa aprovados novamente antes do envio. O atraso do cronograma foi informado ao usuário.

Esta conferência registra o envio de código. O site será publicado somente na etapa 7.

## 06/10/2026 — Etapa 1: JavaScript básico

- Página inicial em HTML e CSS, com formulário HTML por GET.
- Validação de oito dígitos, aceitando hífen e preservando zeros à esquerda.
- Pesquisa por laço em um array de objetos com dois endereços de demonstração.
- Resultado ou mensagem inseridos na página depois de seu recarregamento.
- Plano das seis evoluções seguintes e instruções para apresentação.

Verificação: três testes automatizados aprovados; consulta dos dois exemplos e entrada incompleta conferidas no navegador. O envio convencional do formulário recarrega a página e adiciona o CEP à URL, como previsto para esta etapa. Console sem erros ou avisos.

Na data desta implementação, o envio a `joao-azevedoo/cep-facil` ficou pendente de acesso. O envio efetivo ocorreu em 11/10/2026, conforme registro acima.
