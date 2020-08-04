const server = require('./server')
const chatMidd = require('./middlewares/socketChat')
const recipeMidd = require('./middlewares/socketRecipe')
const pedidoMidd = require('./middlewares/socketPedido')

const io = require('socket.io')(server)
io.origins((origin, callback) => callback(null, true))

const recipesIo = io.of('receitas').on('connection', recipeMidd)
const chatIo = io.of('chat').on('connection', chatMidd)
const pedidoIo = io.of('pedidos').on('connection', socket => pedidoMidd(socket, io))

server.listen(3000, () => {
    console.log(`http://localhost:3000`)
})