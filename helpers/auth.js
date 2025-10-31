/**
 * @file middleware/auth.js
 * @description Contém middlewares de autenticação para proteger rotas.
 */

// --- Type Definitions for JSDoc (para autocomplete do VS Code) ---
/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */
/** @typedef {import('express').NextFunction} NextFunction */

/**
 * Middleware para verificar se um utilizador está autenticado.
 *
 * Ele verifica se 'req.session.userid' existe.
 * - Se NÃO existir, redireciona o utilizador para a página '/login'.
 * - Se existir, chama 'next()' para permitir que a requisição continue
 * para a rota protegida (ex: /toughts/dashboard).
 *
 * @param {Request} req - O objeto de requisição Express.
 * @param {Response} res - O objeto de resposta Express.
 * @param {NextFunction} next - A função de callback do próximo middleware.
 */
module.exports.checkAuth = function(req, res, next) {
    const userId = req.session.userid;

    // 1. Verifica se a sessão 'userid' NÃO está definida
    if (!userId) {
        // 2. Se não estiver, o utilizador não está logado. Redireciona para /login.
        res.redirect('/login');
        return; // Adicionado 'return' para parar a execução (boa prática)
    }

    // 3. Se estiver, o utilizador está logado. Deixa a requisição continuar.
    next();
};

// TODO (Clean Code): Se criar mais middlewares (ex: admin), adicione-os aqui.
// module.exports.checkAdmin = function(req, res, next) { ... }