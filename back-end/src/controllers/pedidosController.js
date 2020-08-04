const Clientes = require('../models/Clientes')
const Farmacias = require('../models/Farmacias')
const Pedidos = require('../models/Pedidos')
const Produtos = require('../models/Produtos')
const { Op } = require('sequelize')

module.exports = {

    async newStorage(req, res) {
        let { numero, frete, valor, forma_pagamento, produtos } = req.body
        const { id_cliente, id_farmacia } = req.params
        const arrayProdutos = produtos.map((value) => {
            return { id_produto: value.id_produto }
        })

        let cliente = await Clientes.findByPk(id_cliente)
        if (!cliente)
            return res.status(404).json({ 'erro': 'cliente não encontrado' })

        const pedido = await Pedidos.create({
            numero,
            frete, 
            valor, 
            forma_pagamento,
            status: 'analise'
        })

        let produtosPedidos = await Produtos.findAll({
            where: {
                id_farmacia,
                [Op.or]: arrayProdutos

            }
        })


        if (produtosPedidos.length !== arrayProdutos.length)
            return res.status(400).json({ 'erro': 'Alugun(s) produto(s) não encontrado' })

        await pedido.setPedidosCliente(cliente)
        await pedido.setProdutosPedidos(produtosPedidos, {
            through: {
                quantidade: produtos,
            }
        })

        return res.status(201).json(pedido)
    },

    async searchById(req, res) {
        const { id_pedido } = req.params

        const pedido = await Pedidos.findByPk(id_pedido)

        if (!pedido)
            return res.status(404).json({ 'erro': 'pedido nao encontrado' })

         return res.status(200).json(pedido)
    },

    async searchByProduct(req, res) {
        const { id_produto, id_farmacia } = req.params

        if (!await Farmacias.findByPk(id_farmacia))
            return res.status(404).json({'erro': 'farmacia não encontrada'})

        const pedidos = await Produtos.findAll({
            include: [
                { 
                    association: 'pedidos'
                },
                {
                    association: 'produtosFarmacia',
                    where: { id_farmacia },
                    attributes: []
                }
            ],
            where: {
                id_produto
            }
        })

        if(pedidos.length == 0)
            return res.status(404).json({'erro':'produto não encontrado'})

        return res.status(200).json(pedidos)
    },

    async searchByPharmacy(req, res) {
        const { id_farmacia } = req.params

        if (!await Farmacias.findByPk(id_farmacia))
            return res.status(404).json({'erro': 'farmacia não encontrada'})

        const pedidos = await Pedidos.findAll(
            {
                include:[
                    {
                        association: 'produtosPedidos',
                        include: {
                            association: 'produtosFarmacia',
                            where: {
                                id_farmacia
                            },
                            attributes: []
                        },
                        required:true                    
                    }
                
                ]
            })

        if(pedidos.length == 0)
            return res.status(404).json({'erro':'nenhum pedido encontrado para farmacia'})

        return res.status(200).json(pedidos)
    },

    async searchByClient(req, res) {
        const { id_cliente } = req.params

        const cliente = await Clientes.findByPk(id_cliente, {
            include: [
                {
                    association: 'pedidosCliente',
                    include: [
                        {
                            association: 'produtosPedidos',
                            include: [
                                {
                                    association: 'produtosFarmacia',
                                    attributes: ['nome', "url_imagem"]
                                }
                            ]
                        }
                    ],
                }
            ]
        })

        if (!cliente)
            return res.status(404).json({'erro': 'cliente não encontrado'})

        const pedidos = cliente.pedidosCliente.length > 0 ? cliente.pedidosCliente : []

        return res.status(200).json([ ...pedidos ])
     },

    async dataUpdate(req, res) {
        const { id_pedido, id_cliente } = req.params
        const { numero, frete, valor, forma_pagamento, avaliacao } = req.body

        if (!await Clientes.findByPk(id_cliente))
            return res.status(404).json({'erro': 'cliente não encontrado'})

        let pedido = await Pedidos.findByPk(id_pedido, {
            include:[
                {
                    association: 'pedidosCliente',
                    where: {
                        id_cliente
                    },
                    required: true
                }
            ]
        })

        if(!pedido)
            return res.status(404).json({'erro':'pedido não encontrado'})

        const update = await Pedidos.update({
            numero, 
            frete, 
            valor, 
            forma_pagamento,
            avaliacao
        }, {
            where: {
                id_pedido
            }
        })

        if (!update[0])
            return res.status(400).json({'erro':'nenhum dado atualizado'})

        pedido = await Pedidos.findByPk(id_pedido, {
            include:[
                {
                    association: 'pedidosCliente',
                    where: {
                        id_cliente
                    },
                    required: true
                }
            ]
        })

        return res.status(200).json(pedido)
     },

    async deleteStorage(req, res) {
        const { id_pedido, id_cliente } = req.params

        if (!await Clientes.findByPk(id_cliente))
            return res.status(404).json({'erro': 'cliente não encontrado'})

        const pedido = await Pedidos.findByPk(id_pedido, {
            include:[
                {
                    association: 'pedidosCliente',
                    where: {
                        id_cliente
                    },
                    required: true
                }
            ]
        })

        if(!pedido)
            return res.status(404).json({'erro':'pedido não encontrado'})

        const deleted = await Pedidos.destroy({
            where: {
                id_pedido
            }
        })

        if(!deleted)
            return res.status(400).json({'erro':'nenhum dado deletado'})

        return res.status(204).json()
     },

     async updateStatus(req, res) {
        const { id_pedido } = req.params
        const { status } = req.body

        let pedido = await Pedidos.findByPk(id_pedido, {
            include: [
                {
                    association: 'pedidosCliente',
                    required: true
                }
            ],
            where: {
                id_pedido
            }
        })

        if(!pedido)
            return res.status(404).json({'erro':'pedido não encontrado'})

        const update = await Pedidos.update({
            status
        }, {
            where: {
                id_pedido
            }
        })

        if (!update[0])
            return res.status(400).json({'erro': 'nenhum dado atualizado'})

        pedido = await Pedidos.findByPk(id_pedido, {
            include:[
                {
                    association: 'pedidosCliente',
                    required: true
                }
            ],
            where: {
                id_pedido
            }
        })

        return res.status(200).json(pedido)
     }
}