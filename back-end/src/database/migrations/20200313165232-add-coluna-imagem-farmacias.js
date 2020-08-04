module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('farmacias', 'imagem', {
            type: Sequelize.STRING(300),
            allowNull: true
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('farmacias', 'imagem')
    }
};
