import axios from 'axios'

const apiCep = axios.create({
    baseURL: 'https://viacep.com.br/ws/'
})

export default apiCep