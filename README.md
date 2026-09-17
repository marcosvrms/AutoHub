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