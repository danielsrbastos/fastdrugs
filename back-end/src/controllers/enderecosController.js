const { Op } = require('sequelize')

const Address = require('../models/Enderecos')
const Clientes = require('../models/Clientes')

module.exports = {

    async findById(req, res) {
        const { id_endereco } = req.params

        const endereco = await Address.findByPk(id_endereco)

        if (!endereco) {
            return res.status(404).json({ 'error': 'not found' })
        }

        return res.status(200).json(endereco)
    },

    async newStorage(req, res) {
        const { id_cliente } = req.params
        let { enderecos } = req.body

        const cliente = await Clientes.findByPk(id_cliente)

        if (!cliente) {
            return res.status(404).json({ 'error': 'Not found' })
        }

        enderecos = enderecos.map(endereco => {
            return { id_cliente: +id_cliente, ...endereco }
        })

        const resultado = await Address.bulkCreate(enderecos)

        return res.status(201).json(resultado)
    },

    async   dataUpdate(req, res) {
        const { id_cliente, id_endereco } = req.params
        let endereco = req.body

        if (!await Clientes.findByPk(id_cliente))
            return res.status(404).json({ 'error': 'Cliente Not found' })

        const updated = await Address.update(endereco, {
            where: {
                [Op.and]: [
                    { id_cliente },
                    { id_endereco }
                ]
            }
        })

        if (!updated[0])
            return res.status(404).json({ 'error': 'Endereco Not found' })

        endereco = {
            id_endereco: +id_endereco,
            id_cliente: +id_cliente,
            ...endereco
        }

        return res.status(200).json(endereco)

    },

    async deleteStorage(req, res) {
        const { id_cliente, id_endereco } = req.params

        if (!await Clientes.findByPk(id_cliente))
            return res.status(404).json({ 'error': 'Cliente Not found' })

        const deleted = await Address.destroy({
            where: {
                [Op.and]: [
                    { id_cliente },
                    { id_endereco }
                ]
            }
        })

        if (!deleted)
            return res.status(404).json({ 'error': 'Endereco Not found' })

        return res.status(204).json()
    },

}