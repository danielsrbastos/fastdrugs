'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('pedidos', 'status', {
			type: Sequelize.DataTypes.STRING,
			allowNull: true
		})
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('pedidos', 'status')
	}
};
