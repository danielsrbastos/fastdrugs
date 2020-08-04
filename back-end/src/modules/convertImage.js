const fs = require('fs')
const path = require('path')

//Funçoes 
module.exports = {

    decodeBase64: decode_base64 = (base64str, filename) => {
        let buf = Buffer.from(base64str, 'base64');

        fs.writeFile(path.join('./uploads/tmp', filename), buf, function (error) {
            if (error) {
                throw error;
            } else {
                return true;
            }
        });

        return filename
    }
}