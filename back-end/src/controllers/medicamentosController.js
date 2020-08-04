const Medicamentos = require('../models/Medicamentos')

module.exports = {

    async newStorage(req, res) {
        const medicine = req.body

        const addMedicine = await Medicamentos.create(medicine)

        return res.status(201).json(addMedicine)
    },

    async searchId(req, res) {
        const { id_produto } = req.params

        const medicine = await Medicamentos.findByPk(id_produto)

        if (!medicine)
            return res.status(404).json({'error':'Medicine Not Found'})

        return res.status(200).json(medicine)

    },

    async dataUpdate(req, res) {
        const { id_produto } = req.params
        let medicine = req.body

        if (!await Medicamentos.findByPk(id_produto))
            return res.status(404).json({'error':'Medicine Not Found'})

        const medicineUpdate = await Medicamentos.update(medicine, {
            where: {
                id_produto,
            }
        })

        if (!medicineUpdate[0])
            return res.status(400).json({'msg': 'No data updated'})

        medicine = { id_produto, ...medicine }
        return res.status(200).json(medicine)

    },

    async deleteStorage(req, res) {
        const { id_produto } = req.params

        if (!await Medicamentos.findByPk(id_produto))
            return res.status(404).json({'error':'Medicine Not Found'})

        const deleteMedicine = await Medicamentos.destroy({
            where:{
                id_produto
            }
        })

        if (!deleteMedicine) 
            return res.status(400).json({'msg': 'No data deleted'})

        return res.status(204).json()
    },

}