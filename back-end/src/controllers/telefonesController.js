const { Op } = require('sequelize')

const Telefones = require('../models/Telefones')
const Farmacias = require('../models/Farmacias')

module.exports = {
    async newStorage (req, res) {
        const { id_farmacia } = req.params
        let { telefones } = req.body

        const farmacia = await Farmacias.findByPk(id_farmacia)

        if(!farmacia){
            return res.status(404).json({'error':'Not found'})
        }

        telefones = telefones.map(telefone => { 
            return { id_farmacia, ...telefone } 
        })

        const resultado = await Telefones.bulkCreate(telefones)

        return res.status(201).json(resultado)
    },

    async dataUpdate(req, res) {
        const { id_farmacia, id_telefone } = req.params
        let telefone = req.body

        if(!await Farmacias.findByPk(id_farmacia))
            return res.status(404).json({'error':'Not found'})

        const resultado = await Telefones.update( telefone , { 
            where: {
                [Op.and]: [
                    { id_farmacia },
                    { id_telefone }
                ]
            }
         })

        telefone = { id_telefone, ...telefone }

        if (resultado[0])
            return res.status(200).json(telefone)

        return res.status(404).json({ 'error': 'Not Found Telefone' })
    },

    async deleteStorage(req, res) {
        const { id_farmacia, id_telefone } = req.params

        if(!await Farmacias.findByPk(id_farmacia))
            return res.status(404).json({'error':'Not found'})

        const resultado = await Telefones.destroy({
            where: {
                [Op.and]: [
                    { id_farmacia },
                    { id_telefone }
                ]
            }
        })

        if(resultado)
            return res.status(204).json({'success': 'Deleted' })

        return res.status(404).json({ 'error': 'Not Found Telefone' })
    }

}