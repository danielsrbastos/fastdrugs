'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('imagens', 'url_imagem', {
			type: Sequelize.STRING(400),
			allowNull: true
		})
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('imagens', 'url_imagem')
	}
};