/**
 * @file models/Tought.js
 * @description Define o modelo (Model) 'Tought' do Sequelize,
 * que representa a tabela 'Toughts' no banco de dados.
 * Também define a associação (relacionamento) entre Tought e User.
 */

const { DataTypes } = require('sequelize');

// Importa a instância da conexão (Sequelize)
const db = require('../db/conn');

// Importa o Model User para definir a associação
const User = require('./User');

/**
 * @model Tought
 * @description Define o modelo 'Tought' (Pensamento).
 * Cada 'Tought' pertence a um 'User'.
 *
 * @property {string} title - O conteúdo do pensamento (obrigatório).
 * @property {integer} UserId - A chave estrangeira que liga ao User (adicionada automaticamente pela associação).
 */
const Tought = db.define('Tought', {
    title: {
        type: DataTypes.STRING,
        allowNull: false, // Define que este campo não pode ser nulo (obrigatório)
        // 'require: true' foi removido por não ser uma opção válida do Sequelize.
    }
});

// --- Definição das Associações (Relacionamentos) ---

/**
 * Associação: Tought pertence a User.
 * Define a chave estrangeira `UserId` no modelo Tought.
 * Um pensamento (Tought) só pode ter um autor (User).
 */
Tought.belongsTo(User);

/**
 * Associação: User tem muitos Toughts.
 * Define que um User pode ter múltiplos Toughts associados.
 * Isto permite-nos usar `include: Tought` em queries de User.
 */
User.hasMany(Tought);

module.exports = Tought;