# ✒️ Toughts (Pensamentos)

Toughts é uma aplicação web completa (full-stack) estilo "blog" ou "rede social", onde utilizadores podem criar contas, publicar os seus pensamentos e ver os pensamentos de outros utilizadores. O projeto foi construído com Node.js, Express, Handlebars e MySQL com Sequelize.

Este projeto demonstra uma arquitetura MVC (Model-View-Controller) limpa, autenticação de utilizadores baseada em sessão, operações CRUD seguras e um sistema de paginação avançado na página inicial.

## ✨ Funcionalidades Principais

* **Autenticação de Utilizador:** Registo e Login com senhas encriptadas (bcrypt).
* **Gestão de Sessão:** Utiliza `express-session` para manter os utilizadores logados.
* **Rotas Protegidas:** Middlewares garantem que apenas utilizadores logados possam aceder ao dashboard ou criar/editar "toughts".
* **CRUD de Pensamentos:** Utilizadores podem Criar, Ler, Atualizar e Remover (CRUD) os seus próprios pensamentos.
* **Dashboard Pessoal:** Uma página privada onde o utilizador vê e gere apenas os seus "toughts".
* **Homepage Pública:** Exibe todos os "toughts" de todos os utilizadores.
* **Paginação Avançada:** A página inicial e o dashboard usam um sistema de paginação completo (`< 1 ... 4 5 6 ... 10 >`) que persiste o estado da busca e da ordem.
* **Busca e Ordenação:** A página inicial permite buscar "toughts" por título e ordená-los por mais novos/antigos.
* **Arquitetura Limpa (Clean Code):** O projeto separa responsabilidades:
    * `controllers/` para a lógica de negócio.
    * `models/` para a definição do banco de dados (Sequelize).
    * `views/` para os templates Handlebars.
    * `routes/` para a definição de rotas.
    * `helpers/` para a lógica complexa dos templates (ex: paginação).
    * `middleware/` para a verificação de autenticação.

## 💻 Stack de Tecnologia

* **Backend:** Node.js, Express
* **Banco de Dados:** MySQL
* **ORM (Object-Relational Mapper):** Sequelize
* **View Engine (Templates):** Express-Handlebars
* **Autenticação:** bcrypt.js (para hashing de senhas)
* **Gestão de Sessão:** express-session, session-file-store
* **Mensagens Flash:** express-flash
* **Segurança (Variáveis de Ambiente):** dotenv

## 🚀 Como Executar o Projeto Localmente

Siga estes passos para configurar e executar o projeto na sua máquina.

### Pré-requisitos

* Node.js (v16 ou superior)
* NPM (geralmente instalado com o Node.js)
* Um servidor MySQL a correr (ex: MySQL Community Server, XAMPP, Docker)

### 1. Clonar o Repositório

```bash
git clone [URL_DO_SEU_REPOSITÓRIO_GITHUB]
cd [NOME_DA_PASTA_DO_PROJETO]