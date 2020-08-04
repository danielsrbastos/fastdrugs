'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.changeColumn('farmacias', 'preco_por_km', {
            type: Sequelize.DOUBLE
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.changeColumn('farmacias', 'preco_por_km', {
            type: Sequelize.INTEGER
        })
    }
};
