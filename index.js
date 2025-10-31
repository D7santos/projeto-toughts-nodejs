/**
 * @file index.js
 * @description Ponto de entrada principal da aplicação Toughts.
 * Este ficheiro é responsável por configurar o servidor Express,
 * inicializar middlewares (como sessão e .env),
 * definir rotas e ligar-se ao banco de dados.
 */

// --- Core & Third-Party Modules ---
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');
const path = require('path'); // Módulo nativo do Node.js para lidar com caminhos
const os = require('os'); // Módulo nativo do Node.js para info do Sistema Operacional

// 1. Carrega as variáveis de ambiente (.env) para a aplicação
require('dotenv').config();

// --- Application Modules ---
const conn = require('./db/conn'); // Conexão (já usa .env)
const helpers = require('./helpers/handlebars'); // Nossos helpers customizados

// Models (Importados para o Sequelize sync)
const Tought = require('./models/Tought');
const User = require('./models/User');

// Routes
const toughtsRoutes = require('./routes/toughtsRoutes');
const authRoutes = require('./routes/authRoutes');

// Controllers
const ToughtController = require('./controllers/ToughtController');

// --- Type Definitions for JSDoc (para autocomplete do VS Code) ---
/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */
/** @typedef {import('express').NextFunction} NextFunction */

const app = express();

// --- Handlebars Template Engine Setup ---
/**
 * Configura o Express-Handlebars como o motor de templates.
 * Importa e utiliza os helpers customizados (ex: paginação)
 * do ficheiro './helpers/handlebars.js'.
 */
app.engine('handlebars', exphbs.engine({
    helpers: helpers
}));
app.set('view engine', 'handlebars');

// --- Middlewares Globais ---

/**
 * Middleware para fazer o parse de dados de formulários (application/x-www-form-urlencoded).
 */
app.use(
    express.urlencoded({
        extended: true
    })
);

/**
 * Middleware para fazer o parse de JSON payloads (application/json).
 */
app.use(express.json());

/**
 * Configuração do Middleware de Sessão.
 * Utiliza 'session-file-store' para armazenar sessões em ficheiros
 * e 'dotenv' para carregar o segredo da sessão.
 */
app.use(
    session({
        name: 'session',
        // 2. LÊ O SEGREDO DO .ENV (MUITO IMPORTANTE PARA SEGURANÇA)
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function () { },
            // 3. Usa os módulos 'path' e 'os' importados no topo
            path: path.join(os.tmpdir(), 'sessions')
        }),
        cookie: {
            secure: false, // Em produção (com HTTPS), mudar para true
            maxAge: 360000, // 1 hora
            httpOnly: true // Previne acesso via JavaScript (segurança XSS)
        }
    })
);

/**
 * Middleware para mensagens flash (ex: "Pensamento criado com sucesso!").
 * Requer o middleware de sessão para funcionar.
 */
app.use(flash());

/**
 * Define a pasta 'public' como o diretório para servir ficheiros estáticos
 * (CSS, imagens, JavaScript do lado do cliente).
 */
app.use(express.static('public'));

/**
 * Middleware customizado para passar dados da sessão para todas as views (templates).
 * @param {Request} req - O objeto de requisição Express.
 * @param {Response} res - O objeto de resposta Express.
 * @param {NextFunction} next - A função de callback do próximo middleware.
 */
app.use((req, res, next) => {
    if (req.session.userid) {
        // res.locals torna a variável 'session' disponível em todos os templates
        res.locals.session = req.session;
    }
    next();
});

// --- Rotas da Aplicação ---

/**
 * Rota principal (homepage).
 * Renderiza a lista pública de Toughts (com paginação).
 */
app.get('/', ToughtController.showToughts);

/**
 * Agrupa todas as rotas relacionadas a 'Toughts' (dashboard, add, edit, remove).
 * O prefixo '/toughts' será adicionado a todas as rotas definidas em `toughtsRoutes`.
 */
app.use('/toughts', toughtsRoutes);

/**
 * Agrupa todas as rotas de autenticação (login, register, logout).
 * O prefixo '/' será adicionado a todas as rotas definidas em `authRoutes`.
 */
app.use('/', authRoutes);


// --- Inicialização do Servidor ---

/**
 * Sincroniza os modelos do Sequelize com o banco de dados
 * e, em seguida, inicia o servidor Express na porta 3000.
 */
conn
    // .sync({force: true}) // Descomentar para forçar recriação das tabelas
    .sync()
    .then(() => {
        app.listen(3000, () => {
            console.log('Servidor a correr na porta 3000. Aceda a http://localhost:3000');
        });
    })
    .catch((err) => console.log(`Erro ao ligar à base de dados: ${err}`));