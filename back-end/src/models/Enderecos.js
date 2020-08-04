const { Model, DataTypes } = require('sequelize');

class Enderecos extends Model {
    static init(sequelize) {
        super.init({
            id_endereco: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: true,
                autoIncrement: true
            },
            cep: {
                type: DataTypes.STRING,
                allowNull: false
            },
            logradouro: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    max: 100,
                    min: 5,
                }
            },
            numero: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            complemento: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            bairro: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    max: 100
                }
            },
            cidade: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: { max: 100 }
            },
            estado: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: { max: 2 }
            }

        }, { sequelize })
    }

    static associate(models) {
        this.belongsTo(models.Clientes, { foreignKey: 'id_cliente', as: 'clienteEnderecos' })
    }
}

module.exports = Enderecos