'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('farmacias', 'distancia_maxima_frete_gratis', {
            type: Sequelize.DataTypes.DOUBLE,
            after: 'preco_por_km',
            allowNull: true
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('farmacias', 'distancia_maxima_frete_gratis')
    }
};
