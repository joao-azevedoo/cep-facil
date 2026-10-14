# Sete dias de desenvolvimento

Confirmado pelo usuário em 06/10/2026: conta `joao-azevedoo`, sete incrementos e atualizações automáticas às **9h, horário de Brasília**. Repositório: `joao-azevedoo/cep-facil`. Prazo original: **12/10/2026**. Em 11/10, o usuário alterou o encerramento da rotina para **14/10/2026**, mantendo uma nova etapa por dia.

## Cronograma original

As datas abaixo registram o planejamento inicial, sem afirmar que as etapas foram executadas nessas datas.

| Dia | Data | Incremento | Mudança concreta | Conferência |
| --- | --- | --- | --- | --- |
| 1 | 06/10 | JavaScript básico | Estrutura HTML/CSS e funções de validação, formatação e pesquisa numa base de demonstração com dois CEPs. Formulário HTML recarrega a página. | CEP com e sem hífen, zeros à esquerda, entrada inválida e CEP fora da base. |
| 2 | 07/10 | DOM e eventos | Interceptar o formulário e atualizar mensagens/endereço sem recarregar a página. Melhorar navegação por teclado. | Buscar pelo botão e Enter sem nova navegação; alterar e corrigir uma entrada. |
| 3 | 08/10 | Persistência | Histórico de até cinco consultas em localStorage; reabrir e limpar histórico. | Recarregar, confirmar persistência, repetir sem duplicar e limpar. |
| 4 | 09/10 | APIs | Substituir a base de demonstração pela consulta real ao ViaCEP com fetch/JSON. | CEP nacional válido, inexistente e falha de conexão. |
| 5 | 10/10 | Assincronismo e concorrência | Complementar estado/região com IBGE em paralelo por Promise.all; tempo limite, cancelamento e fonte alternativa. | Falha de um serviço não esconde o endereço; busca antiga não substitui nova. |
| 6 | 11/10 | Web APIs | Copiar endereço com Clipboard e permitir seleção manual quando bloqueado. | Copiar e colar; conferir alternativa manual. |
| 7 | 12/10 | Publicação e monetização | GitHub Pages, revisão em celular, rodapé pessoal, espaço de anúncio e documentação final. | URL pública HTTPS, consulta e recursos estáticos corretos; explicar estratégia de receita. |

Cada incremento acrescenta uma funcionalidade, atualiza README e CHANGELOG, registra verificações e gera um commit com a data real. O primeiro incremento foi preparado em 06/10; as execuções de 07 a 11/10 mantiveram o envio pendente enquanto faltava acesso.

## Cronograma reajustado em 11/10

| Etapa | Data efetiva ou prevista | Situação |
| --- | --- | --- |
| 1 | Implementada em 06/10, enviada em 11/10 | Código confirmado no GitHub. |
| 2 | 11/10 | DOM e eventos implementados, verificados e enviados; commit funcional atual `ed420b5` confirmado no GitHub. |
| 3 | 12/10 | Histórico local implementado, verificado e enviado; commit funcional atual `bef6051` confirmado no GitHub. |
| 4 | 13/10 | ViaCEP implementado, verificado e enviado; commit funcional `559c951` confirmado no GitHub, com autoria `joao-azevedoo`. |
| 5 | 14/10 | Concorrência com IBGE, alternativa e cancelamento implementados, verificados e enviados; commit funcional `04c7afa` confirmado no GitHub, com autoria `joao-azevedoo`. |
| 6 | Sem data autorizada | Clipboard e alternativa manual ficam pendentes. |
| 7 | Sem data autorizada | GitHub Pages, revisão final e monetização ficam pendentes. |

A rotina foi encerrada em 14/10 após a conferência da etapa 5 e a exclusão da automação no aplicativo. As etapas 6 e 7 continuam pendentes e o site ainda não foi publicado neste repositório. Não continuar mudanças após o prazo sem nova autorização.

Em 12/10, o usuário autorizou corrigir a autoria dos cinco commits antigos para `joao-azevedoo`. A correção alterou os identificadores Git e foi conferida no GitHub; arquivos, mensagens e datas foram preservados. O `CHANGELOG.md` mantém os identificadores originais como registro dos envios e apresenta a correspondência com os atuais. A sequência das etapas continua igual.

## Acesso necessário

Em 11/10/2026, o usuário autorizou o Git Credential Manager com a conta `joao-azevedoo`. O acesso de escrita a `joao-azevedoo/cep-facil` foi confirmado e a primeira etapa enviada. O commit original de 06/10 foi preservado; o envio ocorreu efetivamente em 11/10. A configuração local deste repositório seleciona a conta correta, sem alterar a configuração global.

O cronograma original sofreu atraso. A sequência continua pela próxima etapa, com no máximo um novo incremento por data real e encerramento em 14/10, autorizado pelo usuário. Entradas de senha/autenticação devem acontecer na interface oficial, nunca no chat ou no código. Não enviar a versão completa anterior.

Se o acesso deixar de estar disponível, a rotina mantém a etapa atual pendente e não acumula novos incrementos. O limite de 14/10 permanece; eventual atraso será informado, sem antecipar vários dias de trabalho em uma execução.

## Rotina local

A automação `cep-f-cil-evolu-o-di-ria` foi excluída em 14/10 após a última conferência, como combinado. Nenhuma nova execução está agendada. Permanecem para uma nova autorização a etapa 6 (Clipboard e alternativa manual) e a etapa 7 (GitHub Pages, revisão final e monetização).
