const multer = require ( 'multer' ) 
const router = require('express').Router()

const farmaciaCtrl = require('../controllers/farmaciasController')
const telefonesCtrl = require('../controllers/telefonesController')
const categoriaCtrl = require('../controllers/categoriasController')
const formasPagamentosCtrl = require('../controllers/formasPagamentosController')
const produtoCtrl = require('../controllers/produtosControllers')
const imagemCtrl = require('../controllers/imagensController')
const lotesCtrl = require('../controllers/lotesController')

const uploadConfig = require('../config/upload')('produtos')
uploadConfig.dest = 'uploads/produtos'

const productUpload = multer(uploadConfig)

//farmacias
router.get('/:id_farmacia', farmaciaCtrl.searchId)
router.put('/:id_farmacia', farmaciaCtrl.dataUpdate)
router.delete('/:id_farmacia', farmaciaCtrl.deleteStorage)

//regiao
router.get('/regiao/:id_endereco', farmaciaCtrl.findInRegion)
router.get('/:id_farmacia/delivery/:id_endereco', farmaciaCtrl.deliveryDataByFarmaciaId)

//endereços
router.delete('/:id_farmacia/telefones/:id_telefone', telefonesCtrl.deleteStorage)
router.put('/:id_farmacia/telefones/:id_telefone', telefonesCtrl.dataUpdate)

//categorias
router.post('/:id_farmacia/categorias', categoriaCtrl.newStorage)
router.get('/:id_farmacia/categorias/:id_categoria', categoriaCtrl.searchId)
router.get('/:id_farmacia/categorias', categoriaCtrl.searchByPharmacy)
router.put('/:id_farmacia/categorias/:id_categoria', categoriaCtrl.dataUpdate)
router.delete('/:id_farmacia/categorias/:id_categoria', categoriaCtrl.deleteStorage)

//produtos
router.post('/:id_farmacia/produtos/categorias/:id_categoria', produtoCtrl.newStorage)
router.get('/:id_farmacia/produtos/:id_produto', produtoCtrl.searchById)
router.get('/:id_farmacia/produtos/categorias/:id_categoria', produtoCtrl.searchByCategory)
router.get('/:id_farmacia/produtos', produtoCtrl.searchByPharmacy)
router.put('/:id_farmacia/produtos/:id_produto', produtoCtrl.dataUpdate)
router.delete('/:id_farmacia/produtos/:id_produto', produtoCtrl.deleteStorage)
//imagens produtos
router.post('/:id_farmacia/produtos/:id_produto/imagem', productUpload.single('produtos'), imagemCtrl.newStorage)
router.post('/:id_farmacia/produtos/:id_produto/atualizar/imagem/:id_imagem', productUpload.single('produtos'), imagemCtrl.dataUpdate)
router.get('/:id_farmacia/produtos/:id_produto/imagem', imagemCtrl.searchByProduct)
router.delete('/:id_farmacia/produtos/imagem/:id_imagem', imagemCtrl.deleteStorage)

//lotes 
router.post('/:id_farmacia/lotes', lotesCtrl.newStorage)
router.get('/:id_farmacia/lotes', lotesCtrl.searchByPharmacy)
router.get('/:id_farmacia/lotes/:id_lote', lotesCtrl.searchById)
router.get('/:id_farmacia/lotes/produtos/:id_produto', lotesCtrl.searchByProduct)
router.get('/:id_farmacia/lotes/validade/:dia/:mes/:ano', lotesCtrl.searchByValidity)
router.get('/:id_farmacia/lotes/fabricacao/:dia/:mes/:ano', lotesCtrl.searchByManufacturing)
router.put('/:id_farmacia/lotes/:id_lote', lotesCtrl.dataUpdate)
router.delete('/:id_farmacia/lotes/:id_lote', lotesCtrl.deleteStorage)

//Forma de pagamento
router.get('/:id_farmacia/formasDePagamento', formasPagamentosCtrl.searchShapesPaymentsByPharmacy)
router.post('/:id_farmacia/formasDePagamento', formasPagamentosCtrl.addShapesPaymentsThePharmacy)
router.delete('/:id_farmacia/formasDePagamento/:id_forma_pagamento', formasPagamentosCtrl.deletePaymentMethod)

module.exports = router