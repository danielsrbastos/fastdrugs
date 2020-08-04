'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('produtos', 'id_categoria', {
			type: Sequelize.INTEGER,
			after: 'preco',
			references: {
				model: 'categorias',
				key: 'id_categoria'
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE'
		})
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('produtos', 'id_categoria')
	}
};
