'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('categorias', {
			id_categoria: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			nome: {
				type: Sequelize.STRING(50),
				allowNull: false
			},
			id_farmacia: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'farmacias',
					key: 'id_farmacia'
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
		return queryInterface.dropTable('categorias');
	}
};
