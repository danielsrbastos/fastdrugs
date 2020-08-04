const { DataTypes, Model } = require('sequelize')

class Categorias extends Model {

    static init(sequelize) {
        super.init({
            id_categoria: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            nome: {
                type: DataTypes.STRING(50),
                allowNull: false
            }
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.Farmacias, {
            foreignKey: 'id_farmacia',
            as: 'categoriaFarmacia'
        })
        this.hasMany(models.Produtos, { foreignKey: 'id_categoria', as: 'categoriaProdutos'})
    }

}

module.exports = Categorias