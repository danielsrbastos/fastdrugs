'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('farmacias', 'preco_por_km', {
            type: Sequelize.DataTypes.INTEGER,
			after: 'raio_entrega',
			allowNull: false
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('farmacias', 'preco_por_km')
    }
};
