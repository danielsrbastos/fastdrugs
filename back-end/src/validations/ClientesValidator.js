const { body } = require('express-validator')

const Clientes = require('../models/Clientes')

class ClientesValidator {

    static validations() {
        return [
            body('email').custom(async email => {
                let client = await Clientes.findOne({
                    where: {
                        email
                    }
                })

                if(client)
                    return Promise.reject({'error': 'O E-mail já esta em uso'})

            }),
            body('celular').custom(async numero => {
                let client = await Clientes.findOne({
                    where: {
                        celular: numero
                    }
                })

                if(client)
                    return Promise.reject({'error': 'o numero já esta em uso'})

            }),
            body('cpf').custom(async cpf => {
                let client = await Clientes.findOne({
                    where:{
                        cpf
                    }
                })

                if(client)
                    return Promise.reject({'error': 'o CPF já esta em uso'})

            }),
        ]
    }

}

module.exports = ClientesValidator