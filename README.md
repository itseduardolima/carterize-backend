# Gerenciador de Gastos com Cartões de Crédito

Este aplicativo é projetado para ajudar a gerenciar os gastos pessoais e os de terceiros para os quais o cartão de crédito é emprestado. O objetivo principal é oferecer uma maneira organizada de separar e monitorar os gastos realizados tanto pelo titular do cartão quanto pelas pessoas que utilizam o cartão emprestado.

## Funcionalidades

### 1. Cadastro de Cartões de Crédito
- Adicione múltiplos cartões de crédito ao aplicativo.
- Informações registradas para cada cartão incluem:
  - Banco emissor
  - Últimos 4 dígitos do número do cartão
  - Nome do titular
  - Limite do cartão
  - Limite disponível (atualizado com base nos gastos realizados)

### 2. Gerenciamento de Gastos
- Registre despesas realizadas com os cartões.
- Categorize as despesas (ex: Alimentação, Transporte, Compras, Lazer, Saúde).
- Informações registradas para cada gasto:
  - Valor da transação
  - Data da transação
  - Pessoa que realizou o gasto (titular ou terceiro)
  - Descrição/categoria do gasto
  - Cartão de crédito utilizado

### 3. Visualização de Gastos
- Visualize e filtre os gastos por:
  - Titular ou terceiro
  - Período específico (ex: mês atual, mês anterior, datas personalizadas)
  - Categoria de gasto
- Exiba o total de gastos em um determinado período para fácil acompanhamento.

### 4. Relatórios Mensais
- Geração de relatórios mensais com:
  - Total gasto pelo titular
  - Total gasto por cada pessoa que utilizou o cartão
  - Comparativo entre meses
  - Categorias com maiores gastos

### 5. Cadastro e Gerenciamento de Terceiros
- Registre terceiros que utilizam os cartões de crédito.
- Associe os gastos aos terceiros cadastrados para um controle mais preciso.

## Tecnologias Utilizadas

- **Backend:** NestJS com TypeORM
- **Banco de Dados:** MySQL
- **Autenticação e Autorização:** Utilizando JWT para autenticação segura e Guards para controle de acesso baseado em permissões
- **Documentação:** Swagger para documentação das APIs

## Instalação e Configuração

### Requisitos

- Node.js
- PostgreSQL
- Yarn ou NPM

### Instale as dependências:

1. Clone esse repositório

```bash
git clone https://github.com/itseduardolima/carterize-backend.git
```

2. Abra a pasta do projeto

```bash
cd carterize-backend
```

3. Instale a dependências

```bash
npm install
```
ou

```bash
yarn install
```

4. Configure as variáveis de ambiente no arquivo .env:

```bash
DB_TYPE=
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_DATABASE=

JWT_SECRET=
JWT_EXPIRES_IN=
JWT_REFRESH_TOKEN_SECRET=
JWT_REFRESH_TOKEN_EXPIRES_IN=
```

5. Execute o projeto

```bash
npm run start:dev
```

