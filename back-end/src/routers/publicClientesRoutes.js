const router = require('express').Router()

const clienteController = require('../controllers/clientesController')
const enderecosController = require('../controllers/enderecosController')

const ClientesValidator = require('../validations/ClientesValidator')

// clientes
router.post('/', clienteController.newStorage)

//Validar dados de cliente
router.post('/validate', ClientesValidator.validations(), clienteController.validateData)

//Authenticação por token de cliente
router.post('/auth', clienteController.authenticate)
router.post('/:id_cliente/refresh/token', clienteController.refreshToken)

//Endereços de cliente
router.post('/:id_cliente/enderecos', enderecosController.newStorage)

//Envio de codigo de verificação
router.post('/:id_cliente/sendCode', clienteController.sendCodeNumber)
router.post('/:id_cliente/sendCodeEmail', clienteController.sendCodeEmail)

module.exports = router