'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('medicamentos', {
            id_produto: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: false,
                allowNull: false
            },
            miligramas:{
                type: Sequelize.INTEGER,
                allowNull: false
            },
            tipo:{
                type: Sequelize.STRING(100),
                allowNull: false
            },
            generico:{
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            tarja: {
                type: Sequelize.STRING,
                allowNull: false
            },
            retenção_receita:{
                type: Sequelize.BOOLEAN,
                allowNull: false
            },
            created_at: {
                type: Sequelize.DATE
            },
            updated_at: {
                type: Sequelize.DATE
            }
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('medicamentos');
    }
};
