const firebaseConfig = require('../config/firebase').firebaseAdmin
const Cliente = require('../models/Clientes')
const Farmacia = require('../models/Farmacias')

//Variaveis para os sockets
let messages = [],
	pharmacy = {},
	client = {}

const getMessagesChat = () => {
	messages = []
	const chatMessages = firebaseConfig.database()
		.ref('messages/')
		.orderByValue()
		.on('child_added', (data) => {
			messages.push({
				...data.val(),
				key: data.key
			})
		})
}

const getSocketsId = (quem, id) => {
	if (quem == 'pharmacy') {
		if (pharmacy[id]) {
			return pharmacy[id].socketId.chat
		}
	} else if (quem == 'client') {
		if (client[id]) {
			return client[id].socketId.chat
		}
	}

	return []
}

getMessagesChat()

setInterval(() => getMessagesChat(), '1800000')

// Socket Para chat
const setMessagesChatData = (path, clientId, pharmacyId, userMessages, ref) => {
	switch (ref) {
		case 'insert':
			firebaseConfig.database().ref('messages' + path).push({
				client: {
					id: clientId,
					name: client[clientId].name,
					email: client[clientId].email,
				},
				pharmacy: {
					id: pharmacyId,
					name: pharmacy[pharmacyId].name,
					email: pharmacy[pharmacyId].email
				},
				messages: userMessages,
				messageView: false
			})
			break;

		case 'update':
			firebaseConfig.database().ref('messages/' + path + '/messages').set(userMessages)
			firebaseConfig.database().ref('messages/' + path + '/messageView').set(false)
			break
		case 'viewMessage':
			firebaseConfig.database().ref('messages/' + path + '/messages').set(userMessages)
			firebaseConfig.database().ref('messages/' + path + '/messageView').set(true)
			break
		default:
			break;
	}

	getMessagesChat()

}



const addPharmacy = (id, email, name, socketId, type) => {
	const dataPharmacy = {
		id,
		email,
		name,
		socketId: {
			[type]: []
		}
	}

	if (!pharmacy[id]) {
		pharmacy = {
			...pharmacy,
			[id]: dataPharmacy
		}
	}

	if (socketId.length) {
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


}

const addClient = (id, email, name, socketId, type) => {
	const dataClient = {
		id,
		email,
		name,
		socketId: {
			[type]: []
		}
	}

	if (!client[id]) {
		client = {
			...client,
			[id]: dataClient
		}
	}

	if (socketId.length) {
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
}

const init = async () => {
	const farmacias = await Farmacia.findAll({
		where: { status: true }
	}),
		clientes = await Cliente.findAll()

	farmacias.forEach(value => {
		let farmacia = value.get()
		addPharmacy(farmacia.id_farmacia,
			farmacia.email,
			farmacia.nome,
			'',
			'chat')
	})

	clientes.forEach(value => {
		let cliente = value.get()
		addClient(cliente.id_cliente,
			cliente.email,
			cliente.nome,
			'',
			'chat')
	})

}

init()

module.exports = (socket) => {
	let dataUser = {}
	socket.on('setClient', (data) => {
		init()
		addClient(data.clientId, data.email, data.name, socket.id, 'chat')
		dataUser = { id: data.clientId, who: 'client' }

	})

	socket.on('setPharmacy', (data) => {
		init()
		addPharmacy(data.pharmacyId, data.email, data.name, socket.id, 'chat')
		dataUser = {
			id: data.pharmacyId,
			who: 'pharmacy'
		}
	})

	socket.on('getPreviousMessages', () => {
		let dataMessages = [],
			lengths = 0
		if (messages.length != 0) {
			messages.forEach(value => {
				if (value[(dataUser.who)].id == dataUser.id) {
					dataMessages.push(value)
					if (!value.messageView)
						lengths++
				}

			})
			socket.emit('newsChatMessages', lengths)
			socket.emit('previousMessages', dataMessages)
		}
	})


	socket.on('sendMessage', (dataMessage) => {
		let clientId = 0
		let pharmacyId = 0
		let socketsId = []
		let path = '/'
		let method = 'insert'
		let message = { message: dataMessage.message, destinatario: dataMessage.destinatario.tipo, newMessage: true }
		let userMessages = []

		switch (dataMessage.remetente.tipo) {
			case 'farmacia':
				pharmacyId = dataMessage.remetente.id
				clientId = dataMessage.destinatario.id
				socketsId = getSocketsId('client', clientId)
				dataMessage.remetente.email = pharmacy[pharmacyId].email
				dataMessage.remetente.name = pharmacy[pharmacyId].name
				break;

			case 'cliente':
				clientId = dataMessage.remetente.id
				pharmacyId = dataMessage.destinatario.id
				socketsId = getSocketsId('pharmacy', pharmacyId)
				dataMessage.remetente.email = client[clientId].email
				dataMessage.remetente.name = client[clientId].name
				break;

			default:
				break;
		}

		let index = 0
		messages.forEach((value, i) => {
			if (value.pharmacy.id == pharmacyId && value.client.id == clientId) {
					path = `/${value.key}`
					method = 'update'
					messages[i].messages.push(message)
					userMessages = (value.messages)
					index++	
			}
		})

		if (index == 0) {
			userMessages.push(message)
			// messages.push({
			// 	client: {
			// 		id: clientId,
			// 		name: client[clientId].name,
			// 		email: client[clientId].email,
			// 	},
			// 	pharmacy: {
			// 		id: pharmacyId,
			// 		name: pharmacy[pharmacyId].name,
			// 		email: pharmacy[pharmacyId].email
			// 	},
			// 	messages: userMessages,
			// 	messageView: false
			// })
		}

		setMessagesChatData(path,
			clientId,
			pharmacyId,
			userMessages,
			method)

		if (socketsId.length) {
			dataMessage.newMessage = true
			socketsId.forEach(value => {
				socket.broadcast.to(value).emit('received', dataMessage)
			})
		}
	})

	socket.on('view', (data) => {
		let path = ''
		let messagesData
		messages.forEach((json, i) => {
			if (json.pharmacy.id == data.pharmacyId && json.client.id == data.clientId) {
				path = `/${json.key}`
				messagesData = messages[i].messages
				messages[i].messageView = true
			}
		})

		if (path.length) {
			messagesData = messagesData.map((value) => {
				value.newMessage = false
				return value
			})

			setMessagesChatData(
				path,
				data.clientId,
				data.pharmacyId,
				messagesData,
				'viewMessage'
			)
		}
	})

	socket.on('disconnect', () => {
		let index = -1
		if (dataUser.who == 'pharmacy') {
			pharmacy[(dataUser.id)].socketId.chat.forEach((value, i) => {
				if (value == socket.id) {
					index = i
				}
			})
			pharmacy[(dataUser.id)].socketId.chat.splice(index, 1)
		}
		if (dataUser.who == 'client') {
			client[(dataUser.id)].socketId.chat.forEach((value, i) => {
				if (value == socket.id) {
					index = i
				}
			})

			client[(dataUser.id)].socketId.chat.splice(index, 1)
		}

	})

}