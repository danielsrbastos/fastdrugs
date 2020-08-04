'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('pedidos', {
			id_pedido: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			numero: {
				type: Sequelize.STRING(45),
				allowNull: true
			},
			frete: {
				type: Sequelize.DOUBLE
			},
			id_cliente: {
				type: Sequelize.INTEGER,
				references: {
					model: 'clientes',
					key: 'id_cliente'
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
		return queryInterface.dropTable('pedidos');
	}
};
