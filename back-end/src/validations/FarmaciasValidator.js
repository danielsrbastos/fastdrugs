const { body } = require('express-validator')

const Farmacias = require('../models/Farmacias')

class FarmaciasValidator {

    static validations() {
        return [
            body('email').custom(async email => {
                let farmacia = await Farmacias.findOne({
                    where: {
                        email
                    }
                })

                if(farmacia)
                    return Promise.reject({'error': 'O E-mail ja esta em uso'})

            }),
            body('cnpj').custom(async cnpj => {
                let farmacia = await Farmacias.findOne({
                    where: {
                        cnpj
                    }
                })

                if(farmacia)
                    return Promise.reject({'error': 'O CNPJ ja esta em uso'})

            }),
        ]
    }

}

module.exports = FarmaciasValidator