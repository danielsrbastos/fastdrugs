'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.addColumn('pedidos', 'valor', {
				type: Sequelize.DataTypes.DOUBLE,
				allowNull: false
			}),
			queryInterface.addColumn('pedidos', 'forma_pagamento', {
				type: Sequelize.DataTypes.STRING(150),
				allowNull: false
			}),
		]);
	},

	down: (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.removeColumn('pedidos', 'valor'),
			queryInterface.removeColumn('pedidos', 'forma_pagamento'),
		]);
	}
};
