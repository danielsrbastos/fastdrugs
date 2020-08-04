const fs = require('fs')
const path = require('path')

// Socket para pedido
module.exports = (socket, io) => {
    socket.on(`pedidoStatus`, pedido => {
        io.of('/pedidos').emit(`pedidoStatus-${pedido.id_pedido}`, pedido)
    })

    socket.on(`newPedido`, id_farmacia => {
        io.of('/pedidos').emit(`newPedido-${id_farmacia}`, id_farmacia)
    })
}

