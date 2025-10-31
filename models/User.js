/**
 * @file models/User.js
 * @description Define o modelo (Model) 'User' do Sequelize,
 * que representa a tabela 'Users' no banco de dados.
 */

const { DataTypes } = require('sequelize');

// Importa a instância da conexão (Sequelize)
const db = require('../db/conn');

/**
 * @model User
 * @description Define o modelo 'User' (Utilizador).
 * Este modelo armazena as informações de autenticação.
 * A associação (User.hasMany(Tought)) está definida em `Tought.js`
 * para evitar dependências circulares de importação.
 *
 * @property {string} name - O nome do utilizador (obrigatório).
 * @property {string} email - O email do utilizador (obrigatório e único).
 * @property {string} password - A senha encriptada (hash) do utilizador (obrigatório).
 */
const User = db.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false, // FIX: 'require: true' não é válido
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false, // FIX: 'require: true' não é válido
        unique: true      // 💡 CLEAN CODE: Garante que o email não pode ser duplicado
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false, // FIX: 'require: true' não é válido
    },
});

module.exports = User;