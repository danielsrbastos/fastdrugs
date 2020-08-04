'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('farmacias', 'raio_entrega', {
            type: Sequelize.DataTypes.INTEGER,
			after: 'avaliacao',
			allowNull: true
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('farmacias', 'raio_entrega')
    }
};
