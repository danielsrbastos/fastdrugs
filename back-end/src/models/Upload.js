const fs = require('fs')
const path = require('path')
const {format} = require('util')

class Upload {

    static uploadImage(bucket, filename, filePackage) {
        const buffer = this.encode_buffer(filename, filePackage)
        return new Promise((resolve, reject) =>{
            const blob = bucket.file(filePackage + filename)
            const blobStream = blob.createWriteStream()
            blobStream.on('error', (e) => {
                reject(e)
            })
    
            blobStream.on('finish', () => {
                resolve(format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`))
            })
            blobStream.end(buffer);
        })
    }

    static delete(bucket, filename, filePackage){
        const blob = bucket.file(filePackage + filename)
        return blob.delete()
    }
    
    static encode_buffer = (filename, filePackage) => {
        return fs.readFileSync(path.join(__dirname, '../','../','uploads/',filePackage, filename), (error, data) =>{
            if (error) throw error
        })
    }

}

module.exports = Upload