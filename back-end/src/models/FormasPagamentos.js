const { Model, DataTypes } = require('sequelize')

class FormasPagamentos extends Model {

    static init(sequelize) {
        super.init({
            id_forma_pagamento: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true
            },
            tipo: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, {
            sequelize
        })
    }

    static associate(models) {
        this.belongsToMany(models.Farmacias, {
            foreignKey: 'id_forma_pagamento',
            through: models.FarmaciaFormasPagamentos,
            as: 'formasPagamentos'
        })
    }

}

module.exports = FormasPagamentos