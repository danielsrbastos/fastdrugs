const Produtos = require('../models/Produtos')
const Farmacia = require('../models/Farmacias')
const Categoria = require('../models/Categorias')
const Medicamentos = require('../models/Medicamentos')

const categoriAssociate = (where) => {

    return {
        association: 'categoriaProdutos',
        where,
    }

}

const farmaciaAssociate = (where) => {
    return {
        association: 'produtosFarmacia',
        include: [
            imagensAssociate()
        ],
        where
    }
}

const imagensAssociate = () => {
    return {
        association: 'ImagemProduto'
    }
}

module.exports = {
    //nova farmacia
    async newStorage(req, res) {
        const { id_farmacia, id_categoria } = req.params
        let produto = req.body
        produto = {
            ...produto,
            id_farmacia,
            id_categoria
        }

        if (!await Farmacia.findByPk(id_farmacia))
            return res.status(404).json({'error':'Pharmacy not Found'})

        const categoria = await Categoria.findOne({ 
            where: {
                id_farmacia,
                id_categoria
            } 
        })

        if (!categoria)
            return res.status(404).json({'error':'Category not Found'})


        const novoProduto = await Produtos.create(produto)

        return res.status(201).json(novoProduto)
    },

    //buscar por farmacia
    async searchByPharmacy(req, res) {
        const { id_farmacia } = req.params

        let farmacia = await Farmacia.findByPk(id_farmacia, {
            include: {
                association: 'produtosFarmacia',
                include: {
                    association: 'ImagemProduto'
                }
            }
        })

        if (!farmacia)
            return res.status(404).json({'error':'Pharmacy not Found'})

        farmacia = farmacia.get()

        for (let i = 0; i < farmacia.produtosFarmacia.length; i++) {
            const medicamento = await Medicamentos.findOne({ where: farmacia.produtosFarmacia[i].id_produto })

            if (medicamento) {
                const produto = JSON.parse(JSON.stringify(farmacia.produtosFarmacia[i]))

                farmacia.produtosFarmacia[i] = { 
                    ...produto, 
                    miligramas: medicamento.miligramas,
                    tipo: medicamento.tipo,
                    generico: medicamento.generico,
                    tarja: medicamento.tarja,
                    retencao_receita: medicamento.retencao_receita
                }
            }
        }

        return res.status(200).json(farmacia.produtosFarmacia)
    },

    //buscar por categoria
    async searchByCategory(req, res) {
        const { id_categoria, id_farmacia } = req.params

        if (!await Farmacia.findByPk(id_farmacia))
            return res.status(404).json({'error':'Pharmacy not Found'})

        const produtos = await Produtos.findAll({
            include: [
                categoriAssociate({ id_categoria }),
                imagensAssociate(),
            ],
            where: {
                id_farmacia
            }
        })

        if (produtos.length == 0)
            return res.status(404).json({'error':'Produtos não encontrado, para a categoria'})

        return res.status(200).json(produtos)    
    },

    //buscar por id
    async searchById(req, res) {
        const { id_produto, id_farmacia } = req.params

        if (!await Farmacia.findByPk(id_farmacia))
            return res.status(404).json({'error':'Pharmacy not Found'})

        const produto = await Produtos.findOne({
            where: {
                id_farmacia,
                id_produto
            },
            include: [
                imagensAssociate(),
            ]
        })

        if(!produto)
            return res.status(404).json({'error':'produto não encontrado'})

        return res.status(200).json(produto)

    },

    //atualizar
    async dataUpdate(req, res) {
        const { id_farmacia, id_produto } = req.params
        let produto = req.body

        if (!await Farmacia.findByPk(id_farmacia))
            return res.status(404).json({'error':'Pharmacy not Found'})

        if (produto.id_categoria) {
            const categoria = await Categoria.findOne({ 
                where: {
                    id_farmacia,
                    id_categoria :produto.id_categoria
                } 
            })
    
            if (!categoria)
                return res.status(404).json({'error':'Category not Found'})
        }

        const updatePrduto = await Produtos.update(produto, {
            where: {
                id_produto,
                id_farmacia
            }
        })

        if (!updatePrduto[0])
            return res.status(404).json({'error':'Pruduto não encontado'})
            
        produto = await Produtos.findByPk(id_produto, {
            include:[
                categoriAssociate({}),
                imagensAssociate(),
            ]
        })

        return res.status(200).json(produto)
    },

    //deletar
    async deleteStorage(req, res) {
        const { id_farmacia, id_produto } = req.params

        if (!await Farmacia.findByPk(id_farmacia))
            return res.status(404).json({'error':'Pharmacy not Found'})

        const deleteProduct = await Produtos.destroy({
            where: {
                id_produto,
                id_farmacia
            }
        })

        if (!deleteProduct)
            return res.status(404).json({'error':'Pruduto não encontado'})

        return res.status(204).json()
    },

}