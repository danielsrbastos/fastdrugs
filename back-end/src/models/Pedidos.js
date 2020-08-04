const { DataTypes, Model } = require('sequelize')

class Pedidos extends Model {

    static init(sequelize) {
        super.init({
            id_pedido: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            numero: {
                type: DataTypes.STRING(45),
                allowNull: false
            },
            frete: {
                type: DataTypes.DOUBLE,
                allowNull: false
            },
            valor: {
                type: DataTypes.DOUBLE,
                allowNull: false
            },
            forma_pagamento: {
                type: DataTypes.STRING,
                allowNull: false
            },
            avaliacao: {
                type: DataTypes.DOUBLE
            },
            avaliacao: {
                type: DataTypes.STRING,
                allowNull: true
            },
            status: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.Clientes, {
            foreignKey: 'id_cliente',
            as: 'pedidosCliente'
        })
        this.belongsToMany(models.Produtos, {
            foreignKey: 'id_pedido',
            through: models.PedidosProdutos,
            as: 'produtosPedidos',
        })
    }

}

module.exports = Pedidos