const multer = require('multer')
const path = require('path')
const crypto = require('crypto')

module.exports = (rota) => {
    
    return {
    dest: 'uploads/'+rota,
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/'+rota)
        },
        filename: function (req, file, cb) {
            const ext = path.extname(file.originalname)
            const nome = path.basename(file.originalname, ext)
    
            const hash = crypto.createHash('sha256').update(nome + Date.now()).digest('hex')
            cb(null, `${hash}${ext}`)
        }
    }),
    limits: {
        fileSize: 1024 * 1024 * 3
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/jpg',
            'image/png'
        ]

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true)
        }else {
            let error = new Error
            error.name = 'uploadImagem'
            error.message = 'Invalid file type'
            error.codigo = '100'
            cb(error)
        }
    }
    }

}