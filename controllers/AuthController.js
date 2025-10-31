/**
 * @file AuthController.js
 * @description Controller para gerenciar a autenticação de utilizadores (Login, Registo, Logout).
 * Utiliza o bcryptjs para a encriptação de senhas.
 */

const User = require('../models/User')
const bcrypt = require('bcryptjs')

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

module.exports = class AuthController {

    /**
     * Renderiza a página de login.
     * @param {Request} req - O objeto de requisição Express.
     * @param {Response} res - O objeto de resposta Express.
     */
    static login(req, res) {
        res.render('auth/login')
    }

    /**
     * Processa a submissão do formulário de login.
     * Valida o email e a senha, e cria a sessão do utilizador se for bem-sucedido.
     * @param {Request} req - O objeto de requisição Express (espera `email` e `password` no `req.body`).
     * @param {Response} res - O objeto de resposta Express.
     */
    static async loginPost(req, res) {
        const { email, password } = req.body

        // 1. Encontrar o utilizador pelo email
        const user = await User.findOne({ where: { email: email } })
        
        if (!user) {
            req.flash('message', 'Usuário não encontrado!')
            res.render('auth/login')
            return // ⚠️ FIX: Adicionado 'return' para parar a execução
        }

        // 2. Verificar se a senha corresponde
        // FIX: Corrigido typo "passowrdMatch" -> "passwordMatch"
        const passwordMatch = bcrypt.compareSync(password, user.password)
        
        if (!passwordMatch) {
            req.flash('message', 'Senha inválida!')
            res.render('auth/login')
            return
        }

        // 3. Inicializar a sessão
        req.session.userid = user.id
    
        req.flash('message', 'Autenticação realizada com sucesso!')
    
        // Salva a sessão antes de redirecionar para garantir que o login esteja completo
        req.session.save(() => {
            res.redirect('/')
        })
    }


    /**
     * Renderiza a página de registo.
     * @param {Request} req - O objeto de requisição Express.
     * @param {Response} res - O objeto de resposta Express.
     */
    static register(req, res) {
        res.render('auth/register')
    }

    /**
     * Processa a submissão do formulário de registo.
     * Valida os dados, verifica se o email já existe, cria o hash da senha
     * e salva o novo utilizador no banco de dados.
     * @param {Request} req - O objeto de requisição Express (espera `name`, `email`, `password`, `confirmpassword` no `req.body`).
     * @param {Response} res - O objeto de resposta Express.
     */
    static async registerPost(req, res) {

        const { name, email, password, confirmpassword } = req.body

        // 1. Validação de confirmação de senha
        if (password != confirmpassword) {
            req.flash('message', 'As senhas não conferem, tente novamente!')
            res.render('auth/register')
            return
        }

        // 2. Verificar se o email já está em uso
        const checkIfUserExists = await User.findOne({ where: { email: email } })

        if (checkIfUserExists) {
            req.flash('message', 'O e-mail já está em uso!')
            res.render('auth/register')
            return
        }

        // 3. Criar o hash da senha
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword,
        }

        try {
            // 4. Salvar o utilizador no banco de dados
            const createdUser = await User.create(user)

            // 5. Inicializar a sessão (auto-login)
            req.session.userid = createdUser.id

            req.flash('message', 'Cadastro realizado com sucesso!')

            // Salva a sessão antes de redirecionar
            req.session.save(() => {
                res.redirect('/')
            })

        } catch (err) {
            console.log(err)
        }
    }

    /**
     * Destrói a sessão do utilizador e redireciona para a página de login.
     * @param {Request} req - O objeto de requisição Express.
     * @param {Response} res - O objeto de resposta Express.
     */
    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }
}