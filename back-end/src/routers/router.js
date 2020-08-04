const farmaciasRouter = require('./farmaciasRouter')
const publicFarmaciasRouter = require('./publicFarmaciasRouter')
const clientesRouter = require('./clientesRouter')
const publicClientesRouter = require('./publicClientesRoutes')
const medicamentosRouter = require('./medicamentosRouter')
const pedidosRouter = require('./pedidosRouter')
const formasPagamentoRouter = require('./formasPagamentoRouter')

const authenticateMidd = require('../middlewares/authenticate')
const errorMidd = require('../middlewares/errors')

const cors = require('cors')

module.exports = (app, express) => {

    //utilizando cors
    app.use(cors())
    //utilizar manuseamento de json
    app.use(express.json())

    //Deixando staticas pasta e rotas
    app.use('/doc', express.static('public/'))
    app.use('/imagem', express.static('uploads/'))

    //rotas
    app.use('/farmacias', publicFarmaciasRouter)
    app.use('/clientes', publicClientesRouter)

    //rota que precisará do token para utilizar
    app.use(authenticateMidd)
    app.use('/clientes', clientesRouter)
    app.use('/farmacias', farmaciasRouter)
    app.use('/medicamentos/', medicamentosRouter)
    app.use('/pedidos', pedidosRouter)
    app.use('/formasDePagamento', formasPagamentoRouter)

    //middlewares para erros no servidor
    app.use(errorMidd)

}