/**
 * @file ToughtController.js
 * @description Controller principal para gerenciar todas as ações relacionadas aos "Toughts"
 * (pensamentos), como exibição, criação, edição e remoção.
 */

const Tought = require("../models/Tought");
// const Toughts = require("../models/Tought"); // 1. Removida importação duplicada
const User = require("../models/User");

const { Op } = require('sequelize');

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

module.exports = class ToughtController {

    /**
     * Renderiza a página inicial (home) com uma lista paginada de todos os Toughts.
     * Suporta query params para:
     * - `search`: Filtrar Toughts pelo título.
     * - `order`: Ordenar por 'new' (DESC) ou 'old' (ASC).
     * - `page`: O número da página atual para paginação.
     * @param {Request} req - O objeto de requisição Express.
     * @param {Response} res - O objeto de resposta Express.
     */
    static async showToughts(req, res) {

        let search = ''
        if (req.query.search) {
            search = req.query.search
        }

        let order = 'DESC'
        if (req.query.order === 'old') {
            order = 'ASC'
        } else {
            order = 'DESC'
        }

        // Lógica de Paginação
        const limit = 5 // Toughts por página
        const page = parseInt(req.query.page) || 1
        const offset = (page - 1) * limit

        const toughtsData = await Tought.findAndCountAll({
            include: User, // Inclui o autor (User) de cada Tought
            where: {
                title: { [Op.like]: `%${search}%` } // Filtro de busca
            },
            order: [['createdAt', order]],
            limit: limit,
            offset: offset
        })

        const toughts = toughtsData.rows.map((result) => result.get({ plain: true }))
        const toughtsCount = toughtsData.count
        const totalPages = Math.ceil(toughtsCount / limit)

        let toughtsQty = toughtsCount
        if (toughtsQty === 0) {
            toughtsQty = false
        }

        const currentOrder = req.query.order || (order === 'DESC' ? 'new' : 'old')

        res.render("toughts/home", { 
            toughts, 
            search, 
            toughtsQty, 
            totalPages, 
            currentPage: page, 
            currentOrder 
        });
    }

    /**
     * Renderiza o dashboard pessoal do utilizador logado.
     * Exibe uma lista paginada APENAS dos Toughts criados por esse utilizador.
     * * @param {Request} req - O objeto de requisição Express.
     * @param {Response} res - O objeto de resposta Express.
     */
    static async dashboard(req, res) {
        const userId = req.session.userid;

        // 1. Encontrar o utilizador (para verificar se ele existe)
        const user = await User.findOne({
            where: { id: userId },
            raw: true, // Traz apenas os dados, mais leve
        });

        if (!user) {
            res.redirect('/login');
            return;
        }

        // 2. Lógica de Paginação para o dashboard
        const limit = 5; // Pode definir um limite diferente se quiser
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        // 3. Buscar os Toughts do utilizador com paginação
        const toughtsData = await Tought.findAndCountAll({
            where: { UserId: userId }, // Apenas Toughts deste utilizador
            order: [['createdAt', 'DESC']],
            limit: limit,
            offset: offset,
        });

        const toughts = toughtsData.rows.map((result) => result.get({ plain: true }));
        const toughtsCount = toughtsData.count;
        const totalPages = Math.ceil(toughtsCount / limit);

        let emptyToughts = toughtsCount === 0;

        // 4. Renderizar a view do dashboard com os dados da paginação
        res.render("toughts/dashboard", { 
            toughts, 
            emptyToughts,
            totalPages,
            currentPage: page
        });
    }

    /**
     * Renderiza a página com o formulário para criar um novo Tought.
     * @param {Request} req - O objeto de requisição Express.
     * @param {Response} res - O objeto de resposta Express.
     */
    static createTought(req, res) {
        res.render("toughts/create");
    }

    /**
     * Processa a submissão do formulário de criação de Tought.
     * Salva o novo Tought no banco de dados, associado ao utilizador logado.
     * @param {Request} req - O objeto de requisição Express (espera `title` no `req.body`).
     * @param {Response} res - O objeto de resposta Express.
     */
    static async createToughtSave(req, res) {
        const tought = {
            title: req.body.title,
            UserId: req.session.userid,
        };

        try {
            await Tought.create(tought);
            req.flash("message", "Pensamento criado com sucesso!");
            req.session.save(() => {
                res.redirect("/toughts/dashboard");
            });
        } catch (err) {
            console.log('Aconteceu um erro:' + err);
            // TODO: Adicionar flash message de erro
        }
    }

    /**
     * Remove um Tought do banco de dados.
     * A query "destroy" inclui o `UserId` para garantir que um utilizador
     * só possa remover os seus próprios Toughts (verificação de segurança).
     * @param {Request} req - O objeto de requisição Express (espera `id` no `req.body`).
     * @param {Response} res - O objeto de resposta Express.
     */
    static async removeTought(req, res) {
        const id = req.body.id;
        const UserId = req.session.userid;

        try {
            // A verificação de segurança acontece aqui (cláusula "where")
            await Tought.destroy({ where: { id: id, UserId: UserId } });
            req.flash('message', 'Pensamento removido com sucesso!');
            req.session.save(() => {
                res.redirect('/toughts/dashboard');
            });
        } catch (err) {
            console.log(`Aconteceu um erro: ${err}`);
            // TODO: Adicionar flash message de erro
        }
    }

    /**
     * Renderiza a página com o formulário para editar um Tought.
     * A query "findOne" inclui o `UserId` para garantir que um utilizador
     * só possa editar os seus próprios Toughts (verificação de segurança).
     * @param {Request} req - O objeto de requisição Express (espera `id` nos `req.params`).
     * @param {Response} res - O objeto de resposta Express.
     */
    static async updateTought(req, res) {
        const id = req.params.id;
        const userId = req.session.userid;

        // A verificação de segurança acontece aqui (cláusula "where")
        const tought = await Tought.findOne({
            where: { id: id, UserId: userId },
            raw: true
        });

        if (!tought) {
            req.flash('message', 'Operação não permitida!');
            res.redirect('/toughts/dashboard');
            return;
        }

        res.render('toughts/edit', { tought });
    }

    /**
     * Processa a submissão do formulário de edição de Tought.
     * Atualiza o Tought no banco de dados.
     * A query "update" inclui o `UserId` para garantir que um utilizador
     * só possa salvar edições dos seus próprios Toughts (verificação de segurança).
     * @param {Request} req - O objeto de requisição Express (espera `id` e `title` no `req.body`).
     * @param {Response} res - O objeto de resposta Express.
     */
    static async updateToughtSave(req, res) {
        const id = req.body.id;
        const userId = req.session.userid;

        const tought = {
            title: req.body.title
        }

        try {
            // A verificação de segurança acontece aqui (cláusula "where")
            await Tought.update(tought, {
                where: {
                    id: id,
                    UserId: userId
                }
            });
            req.flash('message', 'Pensamento atualizado com sucesso!');
            req.session.save(() => {
                res.redirect('/toughts/dashboard');
            });
        } catch (err) {
            console.log(`Aconteceu um erro: ${err}`);
            // TODO: Adicionar flash message de erro
        }
    }
};