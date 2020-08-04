const crypto = require('crypto')

module.exports = {
    cryptoName: (filename) => {
        return crypto.createHash('sha256')
            .update(filename + 'Fast1Drugs-receitas' + Date.now())
            .digest('hex')
    },
    
    hashName: (value1, value2) => {
        return crypto.createHash('sha256')
        .update(value1 + value2)
        .digest('hex')
    }
}