'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('farmacias', 'seg_sex', {
              type: Sequelize.DataTypes.STRING(50),
              allowNull: false
            }),
            queryInterface.addColumn('farmacias', 'sab', {
                type: Sequelize.DataTypes.STRING(50),
                allowNull: false
              }),
            queryInterface.addColumn('farmacias', 'dom_fer', {
              type: Sequelize.DataTypes.STRING(50),
              allowNull: false
            }),
            queryInterface.addColumn('farmacias', 'responsavel', {
                type: Sequelize.STRING(150),
                allowNull: false,
            }),
            queryInterface.addColumn('farmacias', 'status', {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            })
          ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('farmacias', 'seg_sex'),
            queryInterface.removeColumn('farmacias', 'sab'),
            queryInterface.removeColumn('farmacias', 'dom_fer'),
            queryInterface.removeColumn('farmacias', 'responsavel'),
            queryInterface.removeColumn('farmacias', 'status'),
          ]);
    }
};
