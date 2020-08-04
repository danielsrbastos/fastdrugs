const router = require('express').Router()

const formasPagamentosCtrl = require('../controllers/formasPagamentosController')

router.get('/', formasPagamentosCtrl.findAll)
router.post('/', formasPagamentosCtrl.store)

module.exports = router