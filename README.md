# AutoHub
UNIVERSIDADE DO OESTE DE SANTA CATARINA 
Área: Ciências Exatas e Tecnológicas 
Curso: Ciência da Computação 
Disciplina: Programação IV 
Semestre Letivo: 2026/02

Aluno: Marcos Henrique Vermolhen de Souza Santos.
Repositório destinado ao trabalho de programação IV, AutoHub. Uma plataforma interativa que inclui busca, compra e venda de veículos automotivos em larga escala.

Este projeto possui fins educacionais e tem como objetivo permitir a evolução progressiva das competências de desenvolvimento web, arquitetura de software, banco de dados, APIs e desenvolvimento de interfaces.

Para escolha das tecnologias, segui com as indicações de TP do próprio professor Roberson Junior Fernandes Alves, somente escolhi as vesões.
Hoje o Next.js está na linha 16.x e a documentação oficial continua recomendando TypeScript, ESLint, Tailwind, App Router e Turbopack para novos projetos. O mínimo de Node do Next.js atual é 20.9.

Portas:
Frontend → 3000
Backend  → 3001
Postgres → 5432

Estrutura:               ┌─────────────────────┐
                         │      Navegador      │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      Front-end      │
                         │      Next.js        │
                         │    localhost:3000   │
                         └──────────┬──────────┘
                                    │ HTTP / JSON
                                    ▼
                         ┌─────────────────────┐
                         │      Back-end       │
                         │       NestJS        │
                         │    localhost:3001   │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │       Prisma        │
                         │        ORM          │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     PostgreSQL      │
                         │    Docker / :5432   │
                         └─────────────────────┘
## Carteira virtual

O AutoHub possui uma carteira virtual utilizada apenas para simulação.
Não existem pagamentos reais.
Cada usuário possui um saldo interno que pode ser utilizado para comprar anúncios.

### Tipos de transação

- DEPOSIT: crédito realizado pelo administrador.
- PURCHASE: débito realizado pela compra de um anúncio.
- SALE: crédito recebido pelo vendedor.

### Compra

Uma compra:

1. Verifica se o anúncio está publicado.
2. Verifica se o comprador não é o vendedor.
3. Verifica o saldo.
4. Debita o comprador.
5. Marca o anúncio como SOLD.
6. Credita o vendedor.
7. Registra a compra.
8. Registra as duas transações financeiras.

## Backend

O backend do AutoHub foi desenvolvido com:

- NestJS
- TypeScript
- Prisma
- PostgreSQL
- JWT
- Swagger

### Funcionalidades

- Autenticação e autorização
- Cadastro de usuários
- Controle de permissões
- Catálogo de veículos
- Categorias
- Tipos de veículos
- Fabricantes
- Modelos por ano
- Atributos dinâmicos
- Anúncios
- Busca e filtros
- Paginação
- Ordenação
- Imagens por URL
- Upload de imagens
- Carteira virtual
- Compras
- Histórico financeiro

## Executando o projeto

### 1. Iniciar PostgreSQL
docker compose up -d

### 2. Instalar dependências
cd backend
npm install

### 3. Configurar ambiente
Copie `.env.example` para `.env` e configure:
DATABASE_URL
JWT_SECRET
PORT
FRONTEND_URL

### 4. Aplicar banco
npx prisma migrate deploy

### 5. Gerar Prisma Client
npx prisma generate

### 6. Seed
npx prisma db seed

### 7. Executar backend
npm run start:dev

### 8. Executar frontend
npm run dev
E acessar o localhost que seu programa informar
