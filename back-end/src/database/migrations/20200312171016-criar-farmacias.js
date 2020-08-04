module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('farmacias', {
            id_farmacia: {
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
                allowNull: false,
                unique: true
            },
            senha: {
                type: Sequelize.STRING(150),
                allowNull: false
            },
            cnpj: {
                type: Sequelize.STRING(18),
                allowNull: false,
                unique: true
            },
            cep: {
                type: Sequelize.STRING(9),
                allowNull: false
            },
            logradouro: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            complemento: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            bairro: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            cidade: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            estado: {
                type: Sequelize.STRING(2),
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
        return queryInterface.dropTable('farmacias');
    }
};
