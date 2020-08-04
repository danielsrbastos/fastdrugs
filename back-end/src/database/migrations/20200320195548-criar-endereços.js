'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('enderecos', {
            id_endereco: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            id_cliente: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'clientes',
                    key: 'id_cliente'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            cep: {
                type: Sequelize.STRING(9),
                allowNull: false,
            },
            logradouro: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            numero: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            complemento: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            bairro: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            cidade: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            estado: {
                type: Sequelize.STRING(2),
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
            },
            updated_at: {
                type: Sequelize.DATE,
            }
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('enderecos');
    }
};
