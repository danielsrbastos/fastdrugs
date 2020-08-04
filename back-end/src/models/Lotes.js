const { DataTypes, Model } = require('sequelize')

class Lotes extends Model {

    static init(sequelize) {
        super.init({
            id_lote: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            numero_lote: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            data_val: {
                type: DataTypes.STRING(10),
                allowNull: false,
            },
            data_fab: {
                type: DataTypes.STRING(10),
                allowNull: false,
            },
            quantidade: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsTo(models.Produtos, {
            foreignKey: 'id_produto',
            as: 'lotesProdutos'
        })
    }
}

module.exports = Lotes