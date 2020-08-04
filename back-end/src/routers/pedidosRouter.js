const router = require('express').Router()

const pedidosCtrl = require('../controllers/pedidosController')

router.post('/clientes/:id_cliente/farmacias/:id_farmacia', pedidosCtrl.newStorage)
router.get('/farmacias/:id_farmacia/produtos/:id_produto', pedidosCtrl.searchByProduct)
router.get('/farmacias/:id_farmacia', pedidosCtrl.searchByPharmacy)
router.get('/clientes/:id_cliente', pedidosCtrl.searchByClient)
router.put('/:id_pedido/clientes/:id_cliente', pedidosCtrl.dataUpdate)
router.put('/:id_pedido/updateStatus', pedidosCtrl.updateStatus)
router.delete('/:id_pedido/clientes/:id_cliente', pedidosCtrl.deleteStorage)

module.exports = router