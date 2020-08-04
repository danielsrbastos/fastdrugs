'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('formas_pagamentos', {
			id_forma_pagamento: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			tipo:{
				type: Sequelize.STRING,
				allowNull: false
			},
			created_at: {
				type: Sequelize.DATE
			},
			updated_at: {
				type: Sequelize.DATE
			}
		});
	},

	down: (queryInterface, Sequelize) => {
		  return queryInterface.dropTable('formas_pagamentos');
	}
};
