'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('pedidos_produtos', {
			id_pedido_produto: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			id_pedido: {
				type: Sequelize.INTEGER,
				references: {
					model: 'pedidos',
					key: 'id_pedido'
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
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
				allowNull: false
			},
			quantidade: {
				type: Sequelize.INTEGER,
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
		return queryInterface.dropTable('pedidos_produtos');
	}
};
