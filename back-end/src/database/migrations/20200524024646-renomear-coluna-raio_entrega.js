'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.renameColumn('farmacias', 'raio_entrega', 'distancia_maxima_entrega')
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.renameColumn('farmacias', 'distancia_maxima_entrega', 'raio_entrega')
    }
};
