const { Model, DataTypes } = require('sequelize')

class FarmaciaFormasPagamentos extends Model {

    static init(sequelize) {
        super.init({
            id_forma_pagamento_farmacia: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
        }, {
            sequelize
        })
    }

}

module.exports = FarmaciaFormasPagamentos