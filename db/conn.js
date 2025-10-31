/**
 * @file db/conn.js
 * @description Configura e exporta a instância principal de conexão do Sequelize.
 * Este ficheiro utiliza variáveis de ambiente (do ficheiro .env)
 * para carregar as credenciais do banco de dados de forma segura.
 */

const { Sequelize } = require('sequelize');

// 1. Carrega as variáveis de ambiente do ficheiro .env
// (Ex: DB_PASS, DB_USER, etc.)
require('dotenv').config();

// 2. Lê as variáveis do processo (com um valor padrão/fallback)
// Isto permite que o código funcione mesmo se uma variável não for definida.
const dbName = process.env.DB_NAME || 'toughts';
const dbUser = process.env.DB_USER || 'root';
const dbPass = process.env.DB_PASS || ''; // A senha virá do .env
const dbHost = process.env.DB_HOST || 'localhost';

/**
 * @constant sequelize
 * @type {Sequelize}
 * @description A instância principal do Sequelize.
 * Esta é a conexão usada por toda a aplicação (Models, Controllers).
 */
const sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    dialect: 'mysql',
    logging: false // (Opcional, mas recomendado) Desliga os logs "Executing (default): SELECT..."
});

/*
 * NOTA DE CLEAN CODE:
 * Removemos o 'try/catch' de autenticação deste ficheiro.
 * A responsabilidade única deste ficheiro é CONFIGURAR e EXPORTAR
 * a instância do Sequelize.
 * O teste de conexão real já é feito de forma assíncrona
 * no 'index.js' através do comando 'conn.sync()'.
 */

module.exports = sequelize;