# Decisões do CEP Fácil

## 14/10/2026 — Concorrência e cancelamento

- Consultar a lista de UFs em `https://servicodados.ibge.gov.br/api/v1/localidades/estados`, conforme a [documentação do IBGE](https://servicodados.ibge.gov.br/api/docs/localidades). Essa lista pode iniciar em paralelo ao endereço; depois, selecionar pela sigla da UF. Não enviar o CEP ao IBGE nem consultar municípios antes de conhecer o endereço.
- Combinar as consultas com `Promise.all`, convertendo a falha do IBGE em complemento indisponível. Validar o nome do estado e da região e informar a indisponibilidade, preservando o endereço encontrado.
- Usar `https://brasilapi.com.br/api/cep/v1/{cep}` como fonte alternativa, conforme a [documentação da BrasilAPI](https://brasilapi.com.br/docs). Mapear `city`, `state`, `street` e `neighborhood` para os campos existentes e conferir o CEP retornado. Somente falha da fonte principal aciona a alternativa; sua resposta de CEP inexistente é definitiva nessa consulta. HTTP 404 da alternativa também informa CEP não encontrado.
- Limitar cada requisição e sua leitura de JSON a seis segundos. Usar controlador próprio por requisição, timer e `Promise.race`; isso também impede espera indefinida se um transporte ignorar abort. Remover timer e listener em `finally`. A alternativa recebe um novo limite, totalizando até dois limites sucessivos para o endereço.
- Compartilhar o sinal da consulta entre endereço e IBGE. Cancelamento humano não deve disparar a alternativa. Abortar a consulta anterior ao editar, cancelar ou começar outra e usar um identificador crescente no DOM: somente a consulta atual pode apresentar dados, orientar foco ou registrar histórico.
- Manter os controles disponíveis durante a busca e oferecer Cancelar. Exibir informações e cancelamento em cores neutras, usando tokens Organic. Indicar as fontes de endereço e complemento, sem preencher estado/região com dados de outra origem quando o IBGE falhar.
- Verificar falhas e respostas antigas com transportes controlados nos testes e páginas locais de QA ignoradas. A alternativa e o complemento também foram conferidos com os serviços reais no navegador. Não antecipar as etapas 6 e 7 ao encerrar o prazo de 14/10.

## 13/10/2026 — ViaCEP

- Substituir a pesquisa demonstrativa por `https://viacep.com.br/ws/{cep}/json/`, conforme a [documentação oficial](https://viacep.com.br/). Validar oito dígitos localmente antes de enviar qualquer requisição.
- Manter a interface de resultado com `sucesso`, `endereco` ou `mensagem`. Transformar `localidade` em `cidade`, formatar o CEP e conferir se a resposta corresponde à entrada; campos essenciais inválidos não devem produzir um endereço.
- Diferenciar `erro: true` (CEP inexistente) de falha HTTP, de rede ou de JSON. Tratar também o valor textual `"true"` para compatibilidade. Campos de rua e bairro vazios são válidos para CEPs gerais e recebem textos explicativos.
- Permitir uma consulta por vez, bloqueando campo, busca e ações do histórico enquanto o ViaCEP responde. Usar `aria-busy`, mensagem de carregamento neutra e liberação em `finally`. Concorrência, tempo limite, cancelamento e alternativa permanecem para a etapa 5.
- Guardar somente consultas bem-sucedidas no histórico. Reabrir um CEP salvo consulta a API novamente; o histórico não é um cache de endereços. Os dados externos entram na página por `textContent`.
- Fornecer a função de requisição aos testes para cobrir falhas sem depender de rede. Conferir o fluxo real no navegador e usar uma página local ignorada para simular uma falha de conexão sem alterar o código de produção.

## 12/10/2026 — Autoria Git

Por solicitação expressa do usuário, configurar o autor e o committer como `joao-azevedoo` apenas neste repositório. A conta autenticada foi confirmada pela API do GitHub, e o email `noreply` segue o formato de ID e nome de usuário documentado pelo GitHub. A autenticação utilizada no envio não define a autoria de um commit: é necessário conferir também a configuração local e as identidades efetivas do Git.

O usuário autorizou posteriormente corrigir os cinco commits antigos, substituindo o histórico publicado de `main`. Antes da operação, criar e verificar uma cópia de segurança completa. Reconstruir os commits mantendo exatamente as árvores de arquivos, mensagens, datas e relações entre antecessores, alterando somente autor e committer. Conferir cada comparação e a ausência de mudanças remotas; enviar exclusivamente para `main` com `force-with-lease` vinculado ao identificador remoto observado. A operação foi concluída, e a API do GitHub confirmou `joao-azevedoo` como autor e committer de todos os seis commits existentes. Atualizar os identificadores no estado e no plano em um novo commit convencional, mantendo os registros históricos dos envios. Essa autorização pontual não permite novas reescritas automáticas.

## 12/10/2026 — Histórico local

- Guardar somente uma lista de CEPs formatados na chave `cep-facil.historico`, com até cinco itens, sem cópias dos endereços. Reabrir um item executa a mesma consulta usada pelo formulário.
- Separar a persistência em `js/historico.js`, mantendo `js/app.js` responsável pelos eventos e pela apresentação. O armazenamento pode ser fornecido aos testes para verificar falhas e o limite sem ampliar a base de demonstração.
- Normalizar CEPs, descartar entradas inválidas e remover duplicatas ao recuperar dados. Dados corrompidos não impedem novas consultas.
- Quando o navegador bloqueia a leitura ou a gravação, manter os itens em memória e informar que as mudanças duram somente enquanto a página estiver aberta.
- Limpar apenas a chave desta aplicação, preservando outros dados do navegador. A apresentação inicial de um link com CEP não grava novamente no histórico, para que uma limpeza não seja desfeita pelo recarregamento.
- Continuar com a base de dois exemplos. API externa, concorrência, Clipboard e publicação do site permanecem para suas etapas próprias.
