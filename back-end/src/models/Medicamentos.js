const { DataTypes, Model } = require('sequelize')

class Medicamentos extends Model {

    static init(sequelize) {
        super.init({
            id_produto: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true, 
                autoIncrement: false,
            },
            miligramas: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            tipo: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            generico: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            tarja: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            retenção_receita: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            }
        },{
            sequelize
        })
    }

}

module.exports = Medicamentos