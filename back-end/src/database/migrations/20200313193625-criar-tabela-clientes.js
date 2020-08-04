'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('clientes', {
            id_cliente: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            nome: {
                type: Sequelize.STRING(150),
                allowNull: false
            },
            email: {
                type: Sequelize.STRING(150),
                allowNull: false
            },
            senha: {
                type: Sequelize.STRING(150),
                allowNull: false
            },
            celular: {
                type: Sequelize.STRING(16),
                allowNull: false
            },
            data_nascimento: {
                type: Sequelize.STRING(10),
                allowNull: false
            },
            cpf: {
                type: Sequelize.STRING(18),
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
        return queryInterface.dropTable('clientes');
    }
};
