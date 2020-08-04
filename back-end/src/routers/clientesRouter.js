const router = require('express').Router()

const clienteController = require('../controllers/clientesController')
const enderecosController = require('../controllers/enderecosController')

router.get('/', clienteController.findAll)
router.get('/:id_cliente', clienteController.searchId)
router.put('/:id_cliente', clienteController.dataUpdate)
router.delete('/:id_cliente', clienteController.deleteStorage)

router.get('/:id_cliente/enderecos/:id_endereco', enderecosController.findById)
router.put('/:id_cliente/enderecos/:id_endereco', enderecosController.dataUpdate)
router.delete('/:id_cliente/enderecos/:id_endereco', enderecosController.deleteStorage)

module.exports = router