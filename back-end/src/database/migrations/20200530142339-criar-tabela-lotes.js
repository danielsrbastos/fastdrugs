'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('lotes', {
			id_lote: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			numero_lote: {
				type: Sequelize.STRING(50),
				allowNull: false
			},
			data_val: {
				type: Sequelize.STRING(10),
				allowNull: false
			},
			data_fab: {
				type: Sequelize.STRING(10),
				allowNull: false
			},
			quantidade: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			id_produto: {
				type: Sequelize.INTEGER,
				references: {
					model: 'produtos',
					key: 'id_produto'
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
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
		return queryInterface.dropTable('lotes');
	}
};
