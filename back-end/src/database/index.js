const { Sequelize } = require('sequelize')

const dbConfig = require('../config/database')

const Categorias = require('../models/Categorias')
const Clientes = require('../models/Clientes')
const Enderecos = require('../models/Enderecos')
const FarmaciaFormasPagamentos = require('../models/FarmaciaFormasPagamentos')
const Farmacias = require('../models/Farmacias')
const FormasPagamentos = require('../models/FormasPagamentos')
const Lotes = require('../models/Lotes')
const Imagens = require('../models/Imagens')
const Medicamentos = require('../models/Medicamentos')
const Pedidos = require('../models/Pedidos')
const PedidosProdutos = require('../models/PedidosProdutos')
const Produtos = require('../models/Produtos')
const Telefones = require('../models/Telefones')

const connection = new Sequelize(dbConfig)

// Inicializando as models
Categorias.init(connection)
Clientes.init(connection)
Enderecos.init(connection)
FarmaciaFormasPagamentos.init(connection)
Farmacias.init(connection)
FormasPagamentos.init(connection)
Lotes.init(connection)
Imagens.init(connection)
Medicamentos.init(connection)
Pedidos.init(connection)
PedidosProdutos.init(connection)
Produtos.init(connection)
Telefones.init(connection)

// Farmacias.associate(connection.models);
Categorias.associate(connection.models)
Clientes.associate(connection.models)
Enderecos.associate(connection.models)
Farmacias.associate(connection.models)
FormasPagamentos.associate(connection.models)
Lotes.associate(connection.models)
Imagens.associate(connection.models)
Pedidos.associate(connection.models)
PedidosProdutos.associate(connection.models)
Produtos.associate(connection.models)
Telefones.associate(connection.models)

module.exports = connection