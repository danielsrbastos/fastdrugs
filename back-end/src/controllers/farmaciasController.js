const fs = require('fs'),
    crypto = require('crypto'),
    jwt = require('jsonwebtoken'),
    nodemailer = require('nodemailer'),
    request = require('request-promise'),
    { validationResult } = require('express-validator'),
    path = require('path'),
    handlebars = require('handlebars')

const Upload = require('../models/Upload')
const Farmacias = require('../models/Farmacias')
const Enderecos = require('../models/Enderecos')

const authConfig = require('../config/auth.json')
const firebaseConfig = require('../config/firebase')
const { googleApiKey } = require('../config/googleApiKey')

const cryptoText = require('../modules/cryptoName')

const bucket = firebaseConfig.bucket

const passwordEncrypt = (pass) => {
    return crypto.createHash('sha256')
        .update(pass + 'Fast1Drugs-Pharmacy')
        .digest('hex')
}

const generateToken = (params) => {
    return jwt.sign(params, authConfig.code, { expiresIn: '12h' })
}

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

module.exports = {
    async findAll(req, res) {
        let farmacias = await Farmacias.findAll({
            include: {
                association: 'telefones',
                attributes: ['id_telefone', 'telefone']
            }
        })

        farmacias = farmacias.map(farmacia => farmacia = {
            id_farmacia: farmacia.id_farmacia,
            nome: farmacia.nome,
            status: farmacia.status
        })

        return res.status(200).json(farmacias)
    },


    async newStorage(req, res) {
        let farmacia = req.body
        farmacia.senha = passwordEncrypt(farmacia.senha)
        farmacia.status = true
        const retorno = await Farmacias.create(farmacia)

        return res.status(201).json(retorno)
    },

    async searchId(req, res) {
        const { id_farmacia } = req.params

        let farmacia = await Farmacias.findByPk(id_farmacia, {
            include: [
                {
                    association: 'telefones',
                    attributes: ['id_telefone', 'telefone']
                },
                {
                    association: 'produtosFarmacia',
                    include: {
                        association: 'pedidos',
                        attributes: ['id_pedido', 'avaliacao'],
                        through: {
                            attributes: []
                        }
                    },
                    attributes: ['id_produto']
                }
            ],
        })

        if (!farmacia)
            return res.status(404).json({ 'error': 'Farmacia Not Found' })

        let pedidos = 0,
            avaliacao = 0,
            idPedidos = []


        farmacia = farmacia.get()

        farmacia.produtosFarmacia.forEach(value => {
            let status = true

            value.pedidos.forEach(element => {
                if (idPedidos.length == 0)
                    idPedidos.push(value.pedidos.id_pedido)
                else {
                    idPedidos.forEach(el => {
                        if (el == element.id_pedido) {
                            status = false
                        }
                    })
                }

                if (status) {
                    idPedidos.push(element.id_pedido)
                    pedidos++
                    avaliacao += element.avaliacao
                }
            })
        })

        let avaliacaofinal = avaliacao / pedidos

        farmacia.avaliacao = avaliacaofinal

        return res.status(200).json(farmacia)
    },

    async deleteStorage(req, res) {
        const { id_farmacia } = req.params

        let farmacia = await Farmacias.findByPk(id_farmacia)

        if (!farmacia)
            return res.status(404).json({ 'error': 'Farmacia Not Found' })

        const retorno = await Farmacias.destroy({
            where: {
                id_farmacia
            }
        })

        if (!retorno)
            res.status(404).json({ 'error': 'not found' })

        farmacia = farmacia.get()
        if (farmacia.imagem) {
            await Upload.delete(bucket, farmacia.imagem, 'farmacias/')
        }

        return res.status(204).json()
    },

    async dataUpdate(req, res) {
        const { id_farmacia } = req.params
        let farmacia = req.body

        if (farmacia.senha)
            farmacia.senha = passwordEncrypt(farmacia.senha)

        if (!await Farmacias.findByPk(id_farmacia))
            return res.status(404).json({ 'error': 'Farmacia Not Found' })

        const retorno = await Farmacias.update(farmacia, {
            where: {
                id_farmacia
            }
        })

        if (retorno[0]) {
            farmacia = { id_farmacia, ...farmacia }
            return res.status(200).json(farmacia)
        }
    },

    async photoUpload(req, res, next) {
        let { filename, path, buffer } = req.file

        const { id_farmacia } = req.params
        let publicUrl = {}

        let farmacia = await Farmacias.findByPk(id_farmacia)

        if (!farmacia) {
            fs.unlinkSync('./uploads/farmacias/' + filename)
            return res.status(404).json({ 'error': 'Farmacia Not Found' })
        }

        try {
            publicUrl = await Upload.uploadImage(bucket, filename, 'farmacias/')
        } catch (error) {
            return res.status(400).join({ 'error': 'falhar ao fazer upload da imagem' })
        }

        farmacia = farmacia.get()
        console.log(publicUrl)
        const update = await Farmacias.update({ imagem: filename, url_imagem: publicUrl }, {
            where: {
                id_farmacia
            }
        })

        if (!update[0]) {
            await Upload.delete(bucket, filename, 'farmacias/')
            return res.status(404).json({ 'error': 'No Data Updated' })
        } else {
            if (farmacia.imagem) {
                await Upload.delete(bucket, farmacia.imagem, 'farmacias/')
            }
        }

        fs.unlinkSync('./uploads/farmacias/' + filename)

        return res.status(200).json({ publicUrl })
    },

    async authenticate(req, res) {
        let { email, senha } = req.body
        senha = passwordEncrypt(senha)

        let pharmacy = await Farmacias.findOne({
            where: {
                email
            }
        })

        if (!pharmacy)
            return res.status(404).json({ 'error': 'Farmacia Not Found' })

        pharmacy = pharmacy.get()

        if (senha !== pharmacy.senha)
            return res.status(400).json({ 'error': 'Senha invalid' })

        delete pharmacy.senha

        return res.status(200).json({
            pharmacy,
            token: generateToken({
                id_pharmacy: pharmacy.id_farmacia
            })
        })
    },

    async validateData(req, res) {
        let errors = validationResult(req)

        if (!errors.isEmpty())
            return res.status(400).json(errors)

        return res.status(200).json({ 'status': 'Ok, Nenhum utilizamento' })

    },

    async findInRegion(req, res) {
        const { id_endereco } = req.params

        const distancias = []

        const farmacias = await Farmacias.findAll()
        let endereco = await Enderecos.findByPk(id_endereco)

        for (const farmacia of farmacias) {
            const origin = `${endereco.logradouro} ${endereco.numero}, ${endereco.bairro}. ${endereco.cidade} - ${endereco.estado}`
            const destination = `${farmacia.logradouro} ${farmacia.numero}, ${farmacia.bairro}. ${farmacia.cidade} - ${farmacia.estado}`

            const uri = encodeURI(`https://maps.googleapis.com/maps/api/distancematrix/json?units=kilometers&origins=${origin}&destinations=${destination}&key=${googleApiKey}`)

            try {
                const data = await request({ uri, json: true })

                const distancia = data.rows[0].elements[0].distance.value / 1000
                const tempoMin = parseInt(data.rows[0].elements[0].duration.text.replace(/\D/g, '')) + 5
                const tempoMax = tempoMin + 10
                const frete = distancia <= farmacia.distancia_maxima_frete_gratis ? 0 : distancia * farmacia.preco_por_km

                if (distancia < farmacia.distancia_maxima_entrega)
                    distancias.push({ ...JSON.parse(JSON.stringify(farmacia)), distancia, tempo: `${tempoMin} - ${tempoMax} min`, frete })
            } catch (error) {
                return console.log(error)
            }
        }

        return res.status(200).json(distancias)
    },

    async deliveryDataByFarmaciaId(req, res) {
        const { id_endereco, id_farmacia } = req.params

        const farmacia = await Farmacias.findByPk(id_farmacia)
        const endereco = await Enderecos.findByPk(id_endereco)

        const origin = `${endereco.logradouro} ${endereco.numero}, ${endereco.bairro}. ${endereco.cidade} - ${endereco.estado}`
        const destination = `${farmacia.logradouro} ${farmacia.numero}, ${farmacia.bairro}. ${farmacia.cidade} - ${farmacia.estado}`

        const uri = encodeURI(`https://maps.googleapis.com/maps/api/distancematrix/json?units=kilometers&origins=${origin}&destinations=${destination}&key=${googleApiKey}`)

        try {
            const data = await request({ uri, json: true })

            const distancia = data.rows[0].elements[0].distance.value / 1000
            const tempoMin = parseInt(data.rows[0].elements[0].duration.text.replace(/\D/g, '')) + 5
            const tempoMax = tempoMin + 10
            const frete = distancia <= farmacia.distancia_maxima_frete_gratis ? 0 : distancia * farmacia.preco_por_km

            return res.status(200).json({ ...JSON.parse(JSON.stringify(farmacia)), distancia, tempo: `${tempoMin} - ${tempoMax} min`, frete })
        } catch (e) {
            return console.log(e)
        }
    },

    async refreshToken(req, res) {
        const { id_farmacia } = req.params
        const { token } = req.body

        if (!await Farmacias.findByPk(id_farmacia)) {
            return res.status(404).json({ 'error': 'not Found' })
        }

        jwt.verify(token, authConfig.code, (error, user) => {
            if (error) {
                return error.name == 'TokenExpiredError' ?
                    res.status(200).json({ token: generateToken({ id_pharmacy: id_farmacia }) }) :
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

    async sendCode(req, res) {
        const { id_farmacia } = req.params
        const { email, username } = req.body

        if (!await Farmacias.findByPk(id_farmacia))
            return res.status(404).json({ 'error': 'not Found' })

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
                return res.status(200).json({
                    name: 'SendEmailSuccess',
                    codeHash: cryptoText.hashName(replacements.codeEmail, email),
                    to: email,
                    status: true,
                })
            } catch (error) {
                return res.status(400).json(error)
            }
        })
    },
}