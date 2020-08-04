const express = require('express')
const app = express()
const server = require('http').createServer(app)
const router = require('./routers/router')(app, express)
const connection = require('./database/index')

// server.on('connection', () => {
//     console.log("Hello world")
// })

// server.on('close', () => {
//     console.log("fim de jogo")
// })

module.exports = server