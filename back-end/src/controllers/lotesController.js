const Faramacia = require('../models/Farmacias')
const Lotes = require('../models/Lotes')
const Produtos = require('../models/Produtos')

const { Op } = require('sequelize')

module.exports = {

    async newStorage(req, res) {
        const { id_farmacia } = req.params
        const { body } = req

        if (!await Faramacia.findByPk(id_farmacia))
            return res.status(404).json({'erro':'Farmacia não encontrada'})
            
        const produto = await Produtos.findOne({
            where: {
                id_produto: body.id_produto,
                id_farmacia
            }
        })

        if (!produto)
            return res.status(400).json({'erro' : 'Produto não encontrado'})
        const lote = await Lotes.create(body)

        return res.status(201).json(lote)
    },

    async searchByPharmacy(req, res) {
        const { id_farmacia } = req.params

        if (!await Faramacia.findByPk(id_farmacia))
            return res.status(404).json({'erro':'Farmacia não encontrada'})

        const lotes = await Lotes.findAll({
            include: {
                association: 'lotesProdutos',
                include: [
                    {
                        association: 'produtosFarmacia',
                        where: {
                            id_farmacia
                        },
                        attributes: [],
                    }, 
                    {
                        association: 'ImagemProduto'
                    }
                ],
                required: true,
            }
        })

        return res.status(200).json(lotes)
    },

    async searchById(req, res) {
        const { id_lote, id_farmacia } = req.params

        if (!await Faramacia.findByPk(id_farmacia))
            return res.status(404).json({'erro':'Farmacia não encontrada'})

        const lote = await Lotes.findByPk(id_lote)

        if (!lote)
            return res.status(404).json({'erro':'lote não encontado'})

        return res.status(200).json(lote)
    },

    async searchByProduct(req, res) {
        const { id_produto, id_farmacia } = req.params
    
        if (!await Faramacia.findByPk(id_farmacia))
            return res.status(404).json({'erro':'Farmacia não encontrada'})

        const lotes = await Lotes.findAll({
            include: {
                association: 'lotesProdutos',
                where: {
                    id_produto,
                    id_farmacia
                }
            }
        })

        if (lotes.length == 0)
            res.status(404).json({'erro':'lotes nao encontrado'})

        return res.status(200).json(lotes)
    },

    async searchByValidity(req, res) {
        let { id_farmacia, dia, mes, ano } = req.params

        mes = mes != 0 ? '/' + mes + '/' : ''
        dia = dia != 0 ? dia + '/' : ''
        ano = ano != 0 ? '/' + ano : ''

        if (!await Faramacia.findByPk(id_farmacia))
            return res.status(404).json({'erro':'Farmacia não encontrada'})

        const lotes = await Lotes.findAll({
            where:{
                [Op.and]: [
                    { 
                        data_val: {
                            [Op.like] : dia + '%'
                        }
                    },
                    { 
                        data_val: {
                            [Op.like] : '%' + mes + '%'
                        }
                    },
                    { 
                        data_val: {
                            [Op.like] : '%' + ano 
                        }
                    }
                ]
            }
        })


        if (lotes.length == 0)
            return res.status(404).json({'erro':'lotes nao encontrado'})

        return res.status(200).json(lotes)
    },

    async searchByManufacturing(req, res) {
        let { dia, mes, ano, id_farmacia } = req.params

        mes = mes != 0 ? '/' + mes + '/' : ''
        dia = dia != 0 ? dia + '/' : ''
        ano = ano != 0 ? '/' + ano : ''

        if (!await Faramacia.findByPk(id_farmacia))
            return res.status(404).json({'erro':'Farmacia não encontrada'})

        const lotes = await Lotes.findAll({
            where:{
                [Op.and]: [
                    { 
                        data_fab: {
                            [Op.like] : dia + '%'
                        }
                    },
                    { 
                        data_fab: {
                            [Op.like] : '%' + mes + '%'
                        }
                    },
                    { 
                        data_fab: {
                            [Op.like] : '%' + ano 
                        }
                    }
                ]
            }
        })


        if (lotes.length == 0)
            return res.status(404).json({'erro':'lotes nao encontrado'})

        return res.status(200).json(lotes)
    },

    async dataUpdate(req, res) {
        const { id_lote, id_farmacia } = req.params
        const { body } = req

        if (!await Faramacia.findByPk(id_farmacia))
            return res.status(400).json({'erro':'Farmacia não encontrada'})

        if(body.id_produto){
            const produto = await Produtos.findOne({
                where: {
                    id_produto: body.id_produto,
                    id_farmacia
                }
            })
    
            if (!produto)
                return res.status(400).json({'erro' : 'Produto não encontrado'})
        }

        if (!await Lotes.findByPk(id_lote))
            return res.status(404).json({'erro': 'lote não encontrado'})

        const update = await Lotes.update(body, {
            where: {
                id_lote
            }
        })

        if (!update[0])
            return res.status(400).json({'erro':'nenhum dado atualizado'})

        const lote = await Lotes.findByPk(id_lote)

        return res.status(200).json(lote)
    },

    async deleteStorage(req, res) {
        const { id_lote, id_farmacia } = req.params

        if (!await Faramacia.findByPk(id_farmacia))
            return res.status(404).json({'erro':'Farmacia não encontrada'})

        const lote = await Lotes.findOne({
            include:{
                association: 'lotesProdutos',
                where: { id_farmacia },
                required: true
            },
            where: {
                id_lote
            }
        })

        if (!lote)
            return res.status(404).json({'erro': 'lote não encontrado'})

        const deleted = await Lotes.destroy({
            where:{
                id_lote
            }
        })

        if(!deleted)
            return res.status(400).json({'erro':'nenhum dado atualizado'})

        return res.status(204).json()
    },

}