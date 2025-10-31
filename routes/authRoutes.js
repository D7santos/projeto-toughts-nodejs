/**
 * @file routes/authRoutes.js
 * @description Define as rotas HTTP para o fluxo de autenticação (login, registo, logout).
 * Este router é "montado" no 'index.js' sob o prefixo '/'.
 */

const express = require('express');
const router = express.Router();

// Importa o controller que contém a lógica para estas rotas
const AuthController = require('../controllers/AuthController');

/**
 * @route GET /login
 * @description Renderiza a página com o formulário de login.
 * @handler AuthController.login
 */
router.get('/login', AuthController.login);

/**
 * @route POST /login
 * @description Processa os dados submetidos do formulário de login.
 * @handler AuthController.loginPost
 */
router.post('/login', AuthController.loginPost);

/**
 * @route GET /register
 * @description Renderiza a página com o formulário de registo.
 * @handler AuthController.register
 */
router.get('/register', AuthController.register);

/**
 * @route POST /register
 * @description Processa os dados submetidos do formulário de registo.
 * @handler AuthController.registerPost
 */
router.post('/register', AuthController.registerPost);

/**
 * @route GET /logout
 * @description Executa a ação de logout (destrói a sessão) do utilizador.
 * @handler AuthController.logout
 */
router.get('/logout', AuthController.logout);

module.exports = router;