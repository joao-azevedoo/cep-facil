# Decisões do CEP Fácil

## 12/10/2026 — Autoria Git

Por solicitação expressa do usuário, configurar o autor e o committer como `joao-azevedoo` apenas neste repositório. A conta autenticada foi confirmada pela API do GitHub, e o email `noreply` segue o formato de ID e nome de usuário documentado pelo GitHub. A autenticação utilizada no envio não define a autoria de um commit: é necessário conferir também a configuração local e as identidades efetivas do Git. Os commits antigos permanecem preservados; corrigir sua autoria requer autorização específica para reescrever o histórico remoto.

## 12/10/2026 — Histórico local

- Guardar somente uma lista de CEPs formatados na chave `cep-facil.historico`, com até cinco itens, sem cópias dos endereços. Reabrir um item executa a mesma consulta usada pelo formulário.
- Separar a persistência em `js/historico.js`, mantendo `js/app.js` responsável pelos eventos e pela apresentação. O armazenamento pode ser fornecido aos testes para verificar falhas e o limite sem ampliar a base de demonstração.
- Normalizar CEPs, descartar entradas inválidas e remover duplicatas ao recuperar dados. Dados corrompidos não impedem novas consultas.
- Quando o navegador bloqueia a leitura ou a gravação, manter os itens em memória e informar que as mudanças duram somente enquanto a página estiver aberta.
- Limpar apenas a chave desta aplicação, preservando outros dados do navegador. A apresentação inicial de um link com CEP não grava novamente no histórico, para que uma limpeza não seja desfeita pelo recarregamento.
- Continuar com a base de dois exemplos. API externa, concorrência, Clipboard e publicação do site permanecem para suas etapas próprias.
