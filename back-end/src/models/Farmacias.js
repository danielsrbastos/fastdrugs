const { Model, DataTypes } = require('sequelize');

class Farmacias extends Model {
    static init(sequelize) {
        super.init({
            id_farmacia: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: true,
                autoIncrement: true
            },
            nome: {
                type: DataTypes.STRING,
                validate: {
                    min: 3,
                    max: 150
                },
            },
            email: {
                type: DataTypes.STRING,
                validate: {
                    isEmail: true,
                    max: 150,
                    min: 10
                },
                unique: true
            },
            senha: {
                type: DataTypes.STRING,
                allowNull: false
            },
            cnpj: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
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
                allowNull: false,
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
            },
            seg_sex: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            sab: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            dom_fer: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            responsavel: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            imagem: {
                type: DataTypes.STRING,
                allowNull: true
            },
            url_imagem: {
                type: DataTypes.STRING(400),
                allowNull: true
            },
            avaliacao: {
                type: DataTypes.DOUBLE,
                allowNull: true
            },
            distancia_maxima_entrega: {
                type: DataTypes.DOUBLE,
                allowNull: false
            },
            preco_por_km: {
                type: DataTypes.DOUBLE,
                allowNull: false
            },
            distancia_maxima_frete_gratis: {
                type: DataTypes.DOUBLE,
                allowNull: true
            }
        }, { sequelize })
    }

    static associate(models) {
        this.hasMany(models.Telefones, { foreignKey: 'id_farmacia', as: 'telefones' })
        this.hasMany(models.Categorias, {foreignKey: 'id_farmacia', as: 'categoriaFarmacia'})
        this.hasMany(models.Produtos, { foreignKey: 'id_farmacia', as: 'produtosFarmacia' })
        this.belongsToMany(models.FormasPagamentos, {
            foreignKey: 'id_farmacia',
            through: models.FarmaciaFormasPagamentos,
            as: 'formasPagamentos'
        })
    }
}

module.exports = Farmacias