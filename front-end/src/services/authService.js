import api from './api'
import jwtDecode from 'jwt-decode'

import CestaDeCompras from './cestaService'

const userKey = type => {
    return type === 'farmacia' ? '@FastDrugs:farmacia' : '@FastDrugs:cliente'
}

const signIn = async (user, type) => {
    signOut('cliente')
    signOut('farmacia')
    
    try {
        const { data } = await api.post((type === 'farmacia' ? '/farmacias' : '/clientes') + '/auth', user)
    
        const storageData = type === 'farmacia' ? { id_farmacia: data.pharmacy.id_farmacia, token: data.token } : { id_cliente: data.client.id, token: data.token }

        localStorage.setItem(userKey(type), JSON.stringify(storageData))
        
        return true
    } catch (e) {
        return false
    }
}

const signOut = type => {
    if (type === 'cliente') 
        CestaDeCompras.removeCesta()

    localStorage.removeItem(userKey(type))
}

const isSignedIn = type => {
    return JSON.parse(localStorage.getItem(userKey(type)))
}

const getToken = type => {
    const json = JSON.parse(localStorage.getItem(userKey(type)))

    if (!json)
        return false

    return json.token
}

const getId = type => {
    const json = JSON.parse(localStorage.getItem(userKey(type)))

    if (!json)  
        return false 

    return json[type === 'farmacia' ? 'id_farmacia' : 'id_cliente']
}

const setIdEndereco = id_endereco => {
    const json = JSON.parse(localStorage.getItem(userKey('cliente')))

    localStorage.setItem(userKey('cliente'), JSON.stringify({...json, id_endereco }))

    return {...json, id_endereco }
}

const getIdEndereco = () => {
    const json = JSON.parse(localStorage.getItem(userKey('cliente')))

    if (!json)
        return false

    return json.id_endereco
}

const checkSession = token => {
    const decoded = jwtDecode(token)
    const exp = new Date(decoded.exp * 1000)

    if (new Date(Date.now()) > exp) {
        return false
    }

    return true
}

const setTokenAsDefaultHeader = () => {
    const token = getToken('cliente') ? getToken('cliente') : getToken('farmacia')
    api.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

export { signIn, signOut, isSignedIn, getToken, getId, checkSession, setIdEndereco, getIdEndereco, setTokenAsDefaultHeader }