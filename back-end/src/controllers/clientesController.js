const fs = require('fs'),
    crypto = require('crypto'),
    jwt = require('jsonwebtoken'),
    nodemailer = require('nodemailer'),
    request = require('request-promise'),
    { validationResult } = require('express-validator'),
    path = require('path'),
    handlebars = require('handlebars')

const cryptoText = require('../modules/cryptoName')

const Clientes = require('../models/Clientes')
const authConfig = require('../config/auth.json')

const getCodeEmail = (username) => {
    let codeEmail = ''
    let replacements = {
        username,
    }
    for (let index = 0; index < 6; index++) {
        const code = Math.floor(Math.random() * 10) + 0
        replacements = {
            ...replacements,
            ["code" + index]: code
        }
        codeEmail += code
    }

    return {
        replacements,
        codeEmail
    }
}

const addressAssociation = () => {
    return {
        association: 'clienteEnderecos',
        attributes: [
            'id_endereco',
            'cep',
            'logradouro',
            'numero',
            'complemento',
            'bairro',
            'cidade',
            'estado'
        ]
    }
}

const passwordEncrypt = (pass) => {
    return crypto.createHash('sha256')
        .update(pass + 'Fast1Drugs-Customers')
        .digest('hex')
}

const generateToken = (params) => {
    return jwt.sign(params, authConfig.code, { expiresIn: '12h' })
}

module.exports = {

    async newStorage(req, res) {
        let client = req.body
        client.senha = passwordEncrypt(client.senha)

        const createClient = await Clientes.create(client)

        return res.status(201).json(createClient)

    },

    async findAll(req, res) {

        const customers = await Clientes.findAll({
            include: [
                addressAssociation(),
            ]
        })

        if (customers.length == 0)
            return res.status(204).json({ 'Ops': 'Clientes Not Found' })

        return res.status(200).json(customers)

    },

    async searchId(req, res) {
        const { id_cliente } = req.params

        const cliente = await Clientes.findByPk(id_cliente, {
            include: [
                addressAssociation(),
            ]
        })

        if (!cliente)
            return res.status(404).json({ 'error': 'Cliente Not Found' })

        return res.status(200).json(cliente)

    },

    async dataUpdate(req, res) {
        const { id_cliente } = req.params
        let client = req.body
        client.senha = passwordEncrypt(client.senha)

        const updatedCliente = await Clientes.update(client, {
            where: {
                id_cliente
            },
        })

        if (!updatedCliente[0])
            return res.status(404).json({ 'error': 'Cliente Not Found' })

        client = { id_cliente, ...client }

        return res.status(200).json(client)

    },

    async deleteStorage(req, res) {
        const { id_cliente } = req.params

        const deletedCliente = await Clientes.destroy({
            where: {
                id_cliente
            }
        })

        if (!deletedCliente)
            return res.status(404).json({ 'error': 'Cliente Not Found' })

        return res.status(204).json()

    },

    async authenticate(req, res) {
        let { email, senha } = req.body
        senha = passwordEncrypt(senha)

        let client = await Clientes.findOne({
            where: {
                email
            },
            attributes: [
                ['id_cliente', 'id'],
                'nome',
                'email',
                'senha',
                'celular',
            ]
        })

        if (!client)
            return res.status(404).json({ 'error': 'Cliente not found' })

        client = client.get()

        if (senha !== client.senha)
            return res.status(400).json({ 'error': 'password invalid' })

        delete client.senha

        return res.status(200).json({
            client,
            token: generateToken({
                id_client: client.senha
            })
        })


    },

    async refreshToken(req, res) {
        const { id_cliente } = req.params
        const { token } = req.body

        if (!await Clientes.findByPk(id_cliente)) {
            return res.status(404).json({ 'error': 'not Found' })
        }

        jwt.verify(token, authConfig.code, (error, user) => {
            if (error) {
                return error.name == 'TokenExpiredError' ?
                    res.status(200).json({ token: generateToken({ id_client: id_cliente }) }) :
                    res.status(400).json({ ...error, statusToken: false })
            }

            return res.status(400).json({
                'name': 'TokenIsStillActive',
                'msg': 'Token esta ativado',
                'statusToken': true,
                token
            })
        })

    },

    async validateData(req, res) {
        let errors = validationResult(req)

        if (!errors.isEmpty())
            return res.status(404).json(errors)

        return res.status(200).json({'success': 'Nenhum utilizamento'})

    },

    async sendCodeNumber(req, res) {
        const { id_cliente } = req.params

        const { numero } = req.body

        let codeEmail = ''
        for (let index = 0; index < 6; index++) {
            codeEmail += Math.floor(Math.random() * 10) + 0
        }

        try {
            const sms = await axios({
                url: 'https://api2.totalvoice.com.br/sms',
                method: 'post',
                headers: {
                    'Access-Token': 'fdcb4ec220c5db51353eccb8525d966f'
                },
                data: {
                    'numero_destino': numero,
                    'mensagem': `Codigo de verificação Fast Drugs: ${codeEmail}`
                }
            })
    
            if (sms.data.status != 200) {
                return res.status(400).json({ erro: 'não foi possivel enviar o codigo' })
            }
    
            return res.status(200).json({
                status: 'success',
                numero,
                codeHash: cryptoText.hashName(codeEmail, numero)
            })
        } catch (e) {
            return res.status(500).json(e)
        }
    },

    async sendCodeEmail(req, res) {
        const { id_cliente } = req.params
        const { email, username } = req.body

        // if (!await Farmacias.findByPk(id_farmacia))
        //     return res.status(404).json({ 'error': 'not Found' })

        let transporter = nodemailer.createTransport({
            host: 'SMTP.office365.com',
            port: '587',
            secure: false,
            auth: {
                user: 'fast.drugs.delivery@outlook.com.br',
                pass: 'DrugsFast2020'
            }
        })

        var readHTMLFile = function (path, callback) {
            fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, html);
                }
            });
        };

        readHTMLFile(__dirname + '../../../public/codeEmail.html', async (error, html) => {
            var template = handlebars.compile(html);
            let replacements = getCodeEmail(username)
            var htmlToSend = template(replacements.replacements);
            try {
                const sendEmail = await transporter.sendMail({
                    from: '"Fast Drugs" <fast.drugs.delivery@outlook.com.br>',
                    to: email,
                    subject: 'Codigo de Verificação',
                    text: 'Codigo de Verificação para Email',
                    html: htmlToSend
                })

                console.log(replacements.codeEmail+email)

                return res.status(200).json({
                    name: 'SendEmailSuccess',
                    codeHash: cryptoText.hashName(replacements.codeEmail, email),
                    to: email,
                    status: true,
                })
            } catch (error) {
                console.log(error)
                return res.status(400).json(error)
            }
        })
    },
}