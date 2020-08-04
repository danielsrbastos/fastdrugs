'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.changeColumn('farmacias', 'avaliacao', {
            type: Sequelize.DOUBLE
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.changeColumn('farmacias', 'avaliacao', {
            type: Sequelize.INTEGER
        })
    }
};
