const { DataTypes, Model } = require('sequelize');

class Telefones extends Model {

    static init(sequelize) {
        super.init({
            id_telefone: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            telefone: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    max: 19,
                    min: 15,
                }
            }
        }, { sequelize })
    }

    static associate(models){
        this.belongsTo(models.Farmacias, {
            foreignKey: 'id_farmacia',
            as: 'fk_telefone'
        })
    }
}

module.exports = Telefones