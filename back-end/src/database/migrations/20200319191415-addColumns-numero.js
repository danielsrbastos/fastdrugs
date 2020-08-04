'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('farmacias', 'numero', {
			type: Sequelize.DataTypes.INTEGER,
			after: 'logradouro',
			allowNull: false
		})
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('farmacias', 'numero')
	}
};
