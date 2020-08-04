'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('farmacia_formas_pagamentos', {
			id_forma_pagamento_farmacia: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			id_farmacia: {
				type: Sequelize.INTEGER,
				references: {
					model: 'farmacias',
					key: 'id_farmacia'
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
				allowNull: false
			},
			id_forma_pagamento: {
				type: Sequelize.INTEGER,
				references: {
					model: 'formas_pagamentos',
					key: 'id_forma_pagamento'
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
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
		return queryInterface.dropTable('farmacia_formas_pagamentos');
	}
};
