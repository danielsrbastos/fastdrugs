'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('pedidos', 'avaliacao', {
			type: Sequelize.DataTypes.DOUBLE,
			allowNull: true
		})
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('pedidos', 'avaliacao')
	}
};
