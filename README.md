# CEP Fácil — etapa 1 de 7

Projeto acadêmico para consultar um CEP e encontrar seu endereço, desenvolvido em sete incrementos diários. HTML, CSS e JavaScript puro, sem backend próprio.

**Conta de destino:** [joao-azevedoo](https://github.com/joao-azevedoo). O repositório `cep-facil` ainda precisa ser criado ou disponibilizado para este ambiente; esta primeira etapa está preparada localmente.

## O que esta versão faz

Valida e formata o CEP, procura num array de objetos e exibe o endereço. A base de demonstração contém **somente dois CEPs**: `01001-000` e `01310-100`. Os exemplos foram conferidos no ViaCEP durante a preparação. Não se apresenta como uma base nacional de consulta nesta etapa.

O formulário usa GET e recarrega a página. No segundo dia a interação será feita sem recarregar; a consulta nacional à API entra no quarto dia.

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

No navegador, experimente os dois CEPs, uma entrada incompleta e um CEP fora da base. Confira o endereço e observe o recarregamento da página no envio. A sequência e os critérios estão em [PLANO_DIARIO.md](PLANO_DIARIO.md).

## Organização

- `index.html`: página e formulário.
- `css/tokens.css`: tokens Organic para distribuição independente.
- `css/estilos.css`: estilos próprios.
- `js/cep.js`: regras e base de demonstração.
- `js/app.js`: leitura do parâmetro de busca e apresentação após recarregar.
- `estado.json`: etapa local, envio e datas efetivas.
- `CHANGELOG.md`: mudanças realizadas, sem registrar etapas futuras como concluídas.

O rodapé aponta para o perfil do autor da conta de destino. O site pessoal do aluno pode substituí-lo quando fornecido. O ícone utiliza traços Lucide; veja `LICENCA-ICONES.txt`.
