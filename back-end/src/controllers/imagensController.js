const fs = require('fs')

const firebaseConfig = require('../config/firebase')
const bucket = firebaseConfig.bucket

const Imagens = require('../models/Imagens')
const Produto = require('../models/Produtos')
const Upload = require('../models/Upload')

module.exports = {
    
    async newStorage(req, res) {
        const { filename } = req.file
        const { id_produto } = req.params
        let publicUrl = {}
        let produto = await Produto.findByPk(id_produto)

        if (!produto) {
            fs.unlinkSync('./uploads/produtos/' + filename)
            return res.status(404).json({ 'erro': 'Produto não encontrado' })
        }

        try {
            publicUrl = await Upload.uploadImage(bucket, filename, 'produtos/')
        } catch (error) {
            return res.status(400).json({'erro': 'não foi possivel fazer o upload de arquivo'})
        }

        const body = { 
            imagem: filename, id_produto,
            url_imagem: publicUrl
        }

        const imagem = await Imagens.create(body)
        fs.unlinkSync('./uploads/produtos/' + filename)

        return res.status(201).json(imagem)
    },

    async searchById(req, res) {
        const { id_imagem } = req.params

        const imagem = await Imagens.findByPk(id_imagem)

        if (!imagem)
            return res.status(404).json({'erro':'imagem nao encontrada'})

        return res.status(200).json(imagem)
    },

    async searchByProduct(req, res) {
        const { id_produto } = req.params

        const imagem = await Imagens.findAll({
            include: {
                association: 'ImagemProduto',
                where: {
                    id_produto
                },
                required: true
            }
        })

        if (imagem.length == 0)
            return res.status(404).json({'erro':'imagem não encontrada'})

        return res.status(200).json(imagem)
    },

    async dataUpdate(req, res) {
        const { filename } = req.file
        const { id_imagem } = req.params
        let imagem = await Imagens.findByPk(id_imagem)
        let publicUrl = {}
        if (!imagem) {
            fs.unlinkSync('./uploads/produtos/' + filename)
            return res.status(404).json({ 'erro': 'Imagem não encontrado' })
        }

        imagem = imagem.get()

        try {
            publicUrl = await Upload.uploadImage(bucket, filename, 'produtos/')
        } catch (error) {
            return res.status(400).json({'erro': 'não foi possivel fazer o upload de arquivo'})
        }

        const update = await Imagens.update({ imagem: filename, url_imagem: publicUrl}, {
            where: {
                id_imagem
            }
        })

        if (!update[0]){
            await Upload.delete(bucket, filename, 'produtos/')
            return res.status(400).json({'erro': 'nenhum dado atualizado'})
        }else{
            await Upload.delete(bucket, imagem.imagem, 'produtos/')
            imagem.imagem = filename
        }

        fs.unlinkSync('./uploads/produtos/' + filename)

        return res.status(201).json(imagem)
    },

    async deleteStorage(req, res) {
        const { id_imagem } = req.params

        const imagem = await Imagens.findByPk(id_imagem)

        if (!imagem)
            return res.status(404).json({ 'erro': 'Imagem não encontrado' })

        const deleted = await Imagens.destroy({
            where: {
                id_imagem
            }
        })

        if(!deleted)
            return res.status(400).json({'erro':'nenhum dado deletado'})

        await Upload.delete(bucket, imagem.imagem, 'produtos/')

        return res.status(204).json()
    },

}