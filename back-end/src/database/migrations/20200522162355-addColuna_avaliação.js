'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('farmacias', 'avaliacao', {
			type: Sequelize.INTEGER,
			allowNull: true
		})
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('farmacias', 'avaliacao')
	}
};
