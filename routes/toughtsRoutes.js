/**
 * @file routes/toughtsRoutes.js
 * @description Define as rotas HTTP para as funcionalidades principais dos "Toughts".
 * Este router é "montado" no 'index.js' sob o prefixo '/toughts'.
 * Inclui rotas públicas (visualização) e rotas protegidas (criação, edição, dashboard).
 */

const express = require('express');
const router = express.Router();

// Importa o controller que contém a lógica para estas rotas
const ToughtController = require('../controllers/ToughtController');

// Importa o middleware de autenticação para proteger rotas
const checkAuth = require('../helpers/auth').checkAuth;

/**
 * @route GET /toughts/add
 * @description Renderiza a página com o formulário para criar um novo Tought.
 * @middleware checkAuth - Rota protegida, requer login.
 * @handler ToughtController.createTought
 */
router.get('/add', checkAuth, ToughtController.createTought);

/**
 * @route POST /toughts/add
 * @description Processa a submissão do formulário de criação de Tought.
 * @middleware checkAuth - Rota protegida, requer login.
 * @handler ToughtController.createToughtSave
 */
router.post('/add', checkAuth, ToughtController.createToughtSave);

/**
 * @route GET /toughts/edit/:id
 * @description Renderiza a página com o formulário de edição para um Tought específico.
 * @middleware checkAuth - Rota protegida, requer login.
 * @handler ToughtController.updateTought
 */
router.get('/edit/:id', checkAuth, ToughtController.updateTought);

/**
 * @route POST /toughts/edit
 * @description Processa a submissão do formulário de edição de Tought.
 * (Nota: O 'id' do Tought é esperado no corpo da requisição).
 * @middleware checkAuth - Rota protegida, requer login.
 * @handler ToughtController.updateToughtSave
 */
router.post('/edit', checkAuth, ToughtController.updateToughtSave);

/**
 * @route GET /toughts/dashboard
 * @description Renderiza o dashboard pessoal do utilizador logado (com os seus Toughts).
 * @middleware checkAuth - Rota protegida, requer login.
 * @handler ToughtController.dashboard
 */
router.get('/dashboard', checkAuth, ToughtController.dashboard);

/**
 * @route POST /toughts/remove
 * @description Processa a remoção de um Tought.
 * (Nota: O 'id' do Tought é esperado no corpo da requisição).
 * @middleware checkAuth - Rota protegida, requer login.
 * @handler ToughtController.removeTought
 */
router.post('/remove', checkAuth, ToughtController.removeTought);

/**
 * @route GET /toughts/
 * @description [DEPRECATED or REDUNDANT] Esta rota está configurada como '/toughts/'.
 * No 'index.js', a rota 'GET /' já aponta para 'ToughtController.showToughts'.
 * Esta linha é provavelmente redundante ou será acedida como '/toughts/'.
 * @handler ToughtController.showToughts
 */
router.get('/', ToughtController.showToughts);

module.exports = router;