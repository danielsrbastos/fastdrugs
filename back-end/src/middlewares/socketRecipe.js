const imageModules = require('../modules/convertImage')
const cryptoNameModules = require('../modules/cryptoName')

const fs = require('fs')
const path = require('path')

//Variaveis para os sockets
let receitas = [],
	pharmacy = {},
	client = {},
	imagesRecipe = []

const addPharmacy = (id, email, name, socketId, type) => {
	const dataPharmacy = {
		id,
		email,
		name,
		socketId: {}
	}

	if (!pharmacy[id]) {
		pharmacy = {
			...pharmacy,
			[id]: dataPharmacy
		}
	}

	if (pharmacy[id].socketId[type])
		pharmacy[id].socketId[type].push(socketId)
	else
		pharmacy[id].socketId = {
			...pharmacy[id].socketId,
			[type]: [
				socketId
			]
		}
}

const addClient = (id, email, name, socketId, type) => {
	const dataClient = {
		id,
		email,
		name,
		socketId: {}
	}

	if (!client[id]) {
		client = {
			...client,
			[id]: dataClient
		}
	}

	if (client[id].socketId[type])
		client[id].socketId[type].push(socketId)
	else
		client[id].socketId = {
			...client[id].socketId,
			[type]: [
				socketId
			]
		}
}

//Socket para receitas
module.exports = (socket) => {

	let dataUser = {}
	socket.on('setClient', body => {
		const { name, email, clientId, pharmacyId } = JSON.parse(body)

		addClient(clientId, email, name, socket.id, 'receita')
		dataUser = { clientId, pharmacyId, who: 'client' }
	})

	socket.on('setPharmacy', ({ pharmacyId, name, email }) => {
		addPharmacy(pharmacyId, email, name, socket.id, 'receita')
		dataUser = {
			pharmacyId,
			who: 'pharmacy'
		}
	})

	socket.on('sendRecipe', body => {
		let data = JSON.parse(body)

		const ext = data.filename.split('.')
		const cryptoName = cryptoNameModules.cryptoName(data.filename)
		const filename = `${cryptoName}.${ext[1]}`
		imageModules.decodeBase64(data.base64, filename)

		data.urlImage = 'http://localhost:3000/imagem/tmp/' + filename
		data.filename = filename
		data.clientId = dataUser.clientId
		data.name = client[dataUser.clientId].name
		data.pharmacyId = dataUser.pharmacyId
		data.date = Date.now()
		delete data.base64

		imagesRecipe.push({ ...dataUser, filename })
		receitas.push(data)

		if (typeof pharmacy[dataUser.pharmacyId] !== 'undefined') {
			const localPharmacy = JSON.parse(JSON.stringify(pharmacy[dataUser.pharmacyId]))

			let socketsId = localPharmacy.socketId.receita
			socketsId.forEach(value => {
				socket.broadcast.to(value).emit('received', data);
			})
		}
	})

	socket.on('returnProduct', data => {
		const localClient = JSON.parse(JSON.stringify(client[data.cliente]))

		let socketsId = localClient.socketId.receita
		socketsId.forEach(value => {
			socket.broadcast.to(value).emit('productRecipe', data)
		})
	})

	socket.on('deleteRecipe', ({ clientId, pharmacyId }) => {
		imagesRecipe = imagesRecipe.filter(value => {
			if (value.clientId === clientId && value.pharmacyId === pharmacyId) {
				try {
					fs.unlinkSync(path.join(__dirname, '..', '..', 'uploads', 'tmp', value.filename))
				} catch(e) {
					console.log(e)
				}

				return false
			}

			return value
		})
	});

	socket.on('disconnect', () => {
		let index = -1
		if (dataUser.who == 'pharmacy') {
			const localPharmacy = JSON.parse(JSON.stringify(pharmacy[dataUser.pharmacyId]))

			localPharmacy.socketId.receita.forEach((value, i) => {
				if (value == socket.id) {
					index = i
				}
			})
			pharmacy[dataUser.pharmacyId].socketId.receita.splice(index, 1)
		} else if (dataUser.who == 'client') {
			const localClient = JSON.parse(JSON.stringify(client[dataUser.clientId]))

			localClient.socketId.receita.forEach((value, i) => {
				if (value == socket.id) {
					index = i
				}
			})
			client[dataUser.clientId].socketId.receita.splice(index, 1)
		}
	})
}

