const { DataTypes, Model } = require('sequelize')

class Produtos extends Model {

    static init(sequelize){
        super.init({
            id_produto: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true, 
                autoIncrement: true,            
            },
            nome: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },
            descricao: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            preco:{
                type: DataTypes.DOUBLE,
                allowNull: false,
            }
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.Farmacias, {
            foreignKey: 'id_farmacia',
            as: 'produtosFarmacia'
        })
        this.belongsTo(models.Categorias, {
            foreignKey: 'id_categoria',
            as: 'categoriaProdutos'
        })
        this.hasMany(models.Imagens, {
            foreignKey: 'id_produto',
            as: 'ImagemProduto'
        })
        this.belongsToMany(models.Pedidos, {
            foreignKey: 'id_produto',
            through: models.PedidosProdutos,
            as: 'pedidos'
        })
    }

}

module.exports = Produtos