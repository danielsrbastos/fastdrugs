const { DataTypes, Model } = require('sequelize')

class Imagens extends Model {
    static init(sequelize) {
        super.init({
            id_imagem: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            imagem: {
                type: DataTypes.STRING(300)
            },
            url_imagem: {
                type: DataTypes.STRING(400),
                allowNull: false
            }
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.Produtos, {
            foreignKey: 'id_produto',
            as: 'ImagemProduto'
        })
    }

}

module.exports = Imagens