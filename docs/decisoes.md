# Decisões do CEP Fácil

## 12/10/2026 — Histórico local

- Guardar somente uma lista de CEPs formatados na chave `cep-facil.historico`, com até cinco itens, sem cópias dos endereços. Reabrir um item executa a mesma consulta usada pelo formulário.
- Separar a persistência em `js/historico.js`, mantendo `js/app.js` responsável pelos eventos e pela apresentação. O armazenamento pode ser fornecido aos testes para verificar falhas e o limite sem ampliar a base de demonstração.
- Normalizar CEPs, descartar entradas inválidas e remover duplicatas ao recuperar dados. Dados corrompidos não impedem novas consultas.
- Quando o navegador bloqueia a leitura ou a gravação, manter os itens em memória e informar que as mudanças duram somente enquanto a página estiver aberta.
- Limpar apenas a chave desta aplicação, preservando outros dados do navegador. A apresentação inicial de um link com CEP não grava novamente no histórico, para que uma limpeza não seja desfeita pelo recarregamento.
- Continuar com a base de dois exemplos. API externa, concorrência, Clipboard e publicação do site permanecem para suas etapas próprias.
