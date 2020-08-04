module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('telefones', {
            id_telefone: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            telefone: {
                type: Sequelize.STRING(150),
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
        return queryInterface.dropTable('telefones');
    }
};
