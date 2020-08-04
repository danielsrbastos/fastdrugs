'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('produtos', {
		id_produto: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false
		},
		nome:{
			type: Sequelize.STRING,
			allowNull: false
		},
		descricao:{
			type: Sequelize.TEXT,
			allowNull: true,
		},
		preco: {
			type: Sequelize.DOUBLE,
			allowNull: false,
		},
		id_farmacia: {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'farmacias',
				key: 'id_farmacia'
			},
			onUpdate: 'CASCADE',
			onDelete: 'CASCADE',

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
      return queryInterface.dropTable('produtos');
  }
};
