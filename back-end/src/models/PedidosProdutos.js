const { DataTypes, Model } = require('sequelize')

class PedidosProdutos extends Model {

    static init(sequelize) {
        super.init({
            id_pedido_produto: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            quantidade: {
                type: DataTypes.INTEGER,
                allowNull: false,
                set(value) {
                    let idProduto = this.getDataValue('id_produto')
                    value.forEach((item) => {
                        if(idProduto == item.id_produto)
                            this.setDataValue('quantidade', item.quantidade)
                    })
                }
            }
        }, {
            sequelize
        })
    }

    static associate(models){
        this.belongsTo(models.Pedidos, {
            foreignKey: 'id_pedido',
            as: 'produtosPedidos'
        })
        this.belongsTo(models.Produtos, {
            foreignKey: 'id_produto',
            as: 'pedidosProduto'
        })
    }

}

module.exports = PedidosProdutos