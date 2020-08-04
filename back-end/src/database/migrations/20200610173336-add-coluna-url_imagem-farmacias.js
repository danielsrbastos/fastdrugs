'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('farmacias', 'url_imagem', {
			type: Sequelize.STRING(400),
			after: 'imagem',
			allowNull: true
		})
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('farmacias', 'url_imagem')
	}
};
