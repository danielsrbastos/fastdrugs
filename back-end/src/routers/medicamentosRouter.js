const router = require('express').Router()

const medicamentosController = require('../controllers/medicamentosController')

router.get('/:id_produto', medicamentosController.searchId)
router.post('/:id_produto', medicamentosController.newStorage)
router.put('/:id_produto', medicamentosController.dataUpdate)
router.delete('/:id_produto', medicamentosController.deleteStorage)

module.exports = router