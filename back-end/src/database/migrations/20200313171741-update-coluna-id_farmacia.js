'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('telefones', 'id_farmacia', {
            type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'farmacias',
                    key: 'id_farmacia'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('telefones', 'id_farmacia')
    }
};
