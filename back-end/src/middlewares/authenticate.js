const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.json')

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization

    if(!authHeader)
        return res.status(401).json({error: 'token not found'})

    const parts = authHeader.split(' ')

    const [ bearer, token ] = parts

    if(parts.length !== 2)
        return res.status(400).json({'error':'token not formatted'})

    jwt.verify(token, authConfig.code, (error, user) => {
        if(error)
            return res.status(401).json({'error':'token invalid'})

            req.userId = user.id
            return next()
    })

}