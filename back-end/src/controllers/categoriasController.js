const Categorias = require('../models/Categorias')
const Farmacias = require('../models/Farmacias')

module.exports = {

    async newStorage(req, res) {
        const { id_farmacia } = req.params
        const categoria = req.body

        let farmacia = await Farmacias.findByPk(id_farmacia)

        if (!farmacia)
            return res.status(404).json({ 'error': 'Farmacia Not Found' })

        const novaCategoria = await Categorias.create({
            ...categoria,
            id_farmacia
        })

        return res.status(201).json(novaCategoria)
    },

    async searchId(req, res) {
        const { id_farmacia, id_categoria } = req.params
        
        let categoria = await Categorias.findOne({
            where: {
                id_farmacia,
                id_categoria
            }
        })

        if (!categoria)
            return res.status(404).json({ 'error': 'Not Found' })

        return res.status(200).json(categoria)
    },

    async searchByPharmacy(req, res) {
        const { id_farmacia } = req.params

        let farmacia = await Farmacias.findByPk(id_farmacia, {
            include: {
                association: 'categoriaFarmacia'
            }
        })
        if (!farmacia)
            return res.status(404).json({ 'error': 'Farmacia Not Found' })

        farmacia = farmacia.get()

        return res.json(farmacia.categoriaFarmacia)

    },

    async deleteStorage(req, res) {
        const { id_farmacia, id_categoria } = req.params

        if (!await Farmacias.findByPk(id_farmacia))
            return res.status(404).json({ 'error': 'Farmacia Not Found' })

        const deleted = await Categorias.destroy({
            where:{
                id_categoria,
                id_farmacia
            }
        })

        if (!deleted)
            res.status(404).json({'Ops':'Not Deleted, categoria not found'})

        res.status(204).json()

    },

    async dataUpdate(req, res) {
        const { id_farmacia, id_categoria } = req.params
        let categoria = req.body

        if (!await Farmacias.findByPk(id_farmacia))
            return res.status(404).json({ 'error': 'Farmacia Not Found' })

        const updateCategoria = await Categorias.update(categoria, {
            where:{
                id_categoria,
                id_farmacia
            }
        })

        if (!updateCategoria[0])
            res.status(400).json({'Ops':'Not update, categoria not found'})

        categoria = {
            id_categoria,
            id_farmacia,
            ...categoria
        }

        res.status(200).json(categoria)
    },

}