const { Model, DataTypes } = require('sequelize')

class Clientes extends Model {
    
    static init(sequelize) {
        super.init({
            id_cliente: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            nome: {
                type: DataTypes.STRING(150),
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(150),
                allowNull: false,
                unique: true
            },
            senha: {
                type: DataTypes.STRING(150),
                allowNull: false
            },
            celular: {
                type: DataTypes.STRING(16),
                allowNull: false,
                unique: true
            },
            data_nascimento: {
                type: DataTypes.STRING(10),
                allowNull: false
            },
            cpf: {
                type: DataTypes.STRING(18),
                allowNull: false,
                unique: true
            },
        }, { sequelize })
    }

    static associate(models) {
        this.hasMany(models.Enderecos, { 
            foreignKey: 'id_cliente',
            as: 'clienteEnderecos'
        })
        this.hasMany(models.Pedidos, {
            foreignKey: 'id_cliente',
            as: 'pedidosCliente'
        })
    }

}

module.exports = Clientes