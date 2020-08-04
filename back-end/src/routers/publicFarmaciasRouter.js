const router = require('express').Router()
const multer = require ('multer') 

const uploadConfig = require('../config/upload')('farmacias')
const farmaciaCtrl = require('../controllers/farmaciasController')
const telefonesCtrl = require('../controllers/telefonesController')
const FarmaciasValidator = require('../validations/FarmaciasValidator') 

uploadConfig.dest = "uploads/farmacia"
const upload = multer(uploadConfig)

//farmacias
router.get('/', farmaciaCtrl.findAll)
router.post('/', farmaciaCtrl.newStorage)

//Codigo de Verificação
router.post('/:id_farmacia/send_code', farmaciaCtrl.sendCode)

//login
router.post('/auth', farmaciaCtrl.authenticate)
router.post('/:id_farmacia/refresh/token', farmaciaCtrl.refreshToken)

//validação de dados 
router.post('/validate', FarmaciasValidator.validations(), farmaciaCtrl.validateData)

//telefones da farmacia
router.post('/:id_farmacia/telefones', telefonesCtrl.newStorage)

//imagem da farmacia
router.post('/:id_farmacia/imagem', upload.single('farmacia'), farmaciaCtrl.photoUpload)

module.exports = router
