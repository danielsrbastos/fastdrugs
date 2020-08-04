'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('imagens', {
			id_imagem: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			imagem: {
				type: Sequelize.STRING(300),
				allowNull: true
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
		return queryInterface.dropTable('imagens');
	}
};
