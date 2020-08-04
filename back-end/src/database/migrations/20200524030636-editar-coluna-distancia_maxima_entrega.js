'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.changeColumn('farmacias', 'distancia_maxima_entrega', {
            type: Sequelize.DOUBLE
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.changeColumn('farmacias', 'distancia_maxima_entrega', {
            type: Sequelize.INTEGER
        })
    }
};
