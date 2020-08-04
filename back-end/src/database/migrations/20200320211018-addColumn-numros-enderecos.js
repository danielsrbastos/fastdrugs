'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('enderecos', 'numero', {
            type: Sequelize.DataTypes.INTEGER,
            after: 'logradouro',
            allowNull: false
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('enderecos');
    }
};
