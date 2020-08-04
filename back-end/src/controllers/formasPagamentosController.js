const FormasPagamentos = require('../models/FormasPagamentos'),
    Farmacia = require('../models/Farmacias'),
    FarmaciaFormasPagamentos = require('../models/FarmaciaFormasPagamentos')

const { Op } = require('sequelize')

module.exports = {

    async findAll(req, res) {
        const formasDePagamento = await FormasPagamentos.findAll()

        return res.status(200).json(formasDePagamento)
    },

    async store(req, res) {
        const formaDePagamento = await FormasPagamentos.create(req.body)

        return res.status(201).json(formaDePagamento)
    },

    async searchShapesPaymentsByPharmacy(req, res) {
        const { id_farmacia } = req.params

        let pharmacy = await Farmacia.findByPk(id_farmacia)
        if (!pharmacy)
            return res.status(404).json({ 'error': 'pharmacy not found' })

        const modelsFormasPagamentos = await FormasPagamentos.findAll({
            include: [
                {
                    association: 'formasPagamentos',
                    where: {
                        id_farmacia
                    },
                    attributes: []
                }
            ]
        })

        if (modelsFormasPagamentos.length == 0)
            return res.status(404).json({ 'error': 'payments methods not found' })

        return res.status(200).json(modelsFormasPagamentos)

    },

    async addShapesPaymentsThePharmacy(req, res) {
        const { id_farmacia } = req.params
        const { formas_pagamentos } = req.body

        let pharmacy = await Farmacia.findByPk(id_farmacia)
        if (!pharmacy)
            return res.status(404).json({ 'error': 'pharmacy not found' })

        const modelsFormasPagamentos = await FormasPagamentos.findAll({
            where: {
                [Op.or]: formas_pagamentos
            }
        })

        if (formas_pagamentos.length !== modelsFormasPagamentos.length)
            return res.status(400).json({ 'error': 'Aluguma(s) forma de pagamento não encontrado' })

        let { formasPagamentos } = await Farmacia.findByPk(id_farmacia, {
            include: {
                association: 'formasPagamentos',
                attributes: ['id_forma_pagamento', 'tipo']
            }
        })

        formasPagamentos = [...modelsFormasPagamentos, ...formasPagamentos]

        await pharmacy.setFormasPagamentos(formasPagamentos)

        return res.status(201).json(formasPagamentos)
    },

    async deletePaymentMethod(req, res) {
        const { id_farmacia, id_forma_pagamento } = req.params

        let pharmacy = await Farmacia.findByPk(id_farmacia)
        if (!pharmacy)
            return res.status(404).json({ 'error': 'pharmacy not found' })

        let destroyPaymentMethod = await FarmaciaFormasPagamentos.destroy({
            where: {
                id_forma_pagamento
            }
        })

        if (!destroyPaymentMethod)
            return res.status(404).json({ 'error': 'payment method not found' })

        return res.status(204).json()
    }
}