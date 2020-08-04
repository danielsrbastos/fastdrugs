let apiJson = {}

const setAPIJson = (json) => {
    apiJson = json
}

const quem = document.querySelectorAll('.rdWho'),
    titulo = document.getElementById('titulo'),
    descricao = document.getElementById('descricao'),
    subRota = document.getElementById('subRota'),
    pathVariaveis = document.getElementById('PathVariaveis'),
    nomeId = '',
    method = document.getElementById('tipoMethod'),
    url = document.getElementById('url'),
    tipoRota = document.getElementById('tipoRota'),
    btnSalvarRota = document.getElementById('salvarRota')

let requestsErrors = {},
    subtitulo,
    statusErros = [],
    statusSuccess, request, response

const novaRotaJson = () => {
    if(subRota.value == 1){
        return {
            nome: titulo.value,
            submenu: [
                dataJson(subtitulo.value)
            ]
        }
    }else{
        return dataJson(titulo.value)
    }
    
}

const dataJson = (nome) => {
    return {
        nome,
        nomeId: getNomeId(nome),
        descricao: descricao.value,
        method: method.options[tipoRota.selectedIndex].value,
        url: url.value,
        authorization: autorizacaoRota(tipoRota.value),
        pathVariables: formatPathVariaveis(pathVariaveis.value),
        requestSuccess: {
            statusCode: statusSuccess.value,
            request: createJson(requets.value),
            response: createJson(response.value)
        },
        requestsErrors: formatRequestsJson(requestsErrors)
    }
}

const formatPathVariaveis = (path) => {
    let variaveis = ""
    for (let index = 0; index < path.length; index++) {
        if ((path.length - 2) > index) {
            variaveis += path[index]
        }
    }
    return variaveis.split(', ')
}

const gerarJson = () => {
    const rota = tipoRota.options[tipoRota.selectedIndex].value
    let myjson = {}, jsonUser = [], user
    quem.forEach(value => {
        if (value.checked){
            jsonUser = apiJson[value.value][rota]
            user = value.value
        }
            
    })
    statusSuccess = document.getElementById('statusSuccess')
    requets = document.getElementById('requestSuccess')
    response = document.getElementById('responseSuccess')
    requestsErrors = {
        requests: document.querySelectorAll('.requestErros'),
        responses: document.querySelectorAll('.responseErros'),
    }
    statusErros = document.querySelectorAll('.statusErros')
    subtitulo = document.getElementById('subtitulo')
    myjson = novaRotaJson()
    if (parseInt(btnSalvarRota.value) != 0) {
        jsonUser.forEach(el =>{
            if (el.id == btnSalvarRota.value) {
                jsonUser = el.submenu
            }
        })
        jsonUser.push(myjson.submenu[0])

        // apiJson[user][rota].submenu = jsonUser
    } else{
        myjson = {
            userRota: user,
            id: (jsonUser.length + 1),
            ...myjson
        }
        jsonUser.push(myjson)
        apiJson[user][rota] = jsonUser
    }
    salvarNovoJson(apiJson)
}

const createJson = (value) => {
    if (value == "" || value == null || value == "{}")
        return {}

    return JSON.parse(value)
}

const formatRequestsJson = (arrayJson) => {
    const array = []
    if (arrayJson.requests.length != 0) {
        arrayJson.requests.forEach((value, index) => {
            array.push({
                statusCode: statusErros[index].value,
                request: createJson(arrayJson.requests[index].value),
                response: createJson(arrayJson.responses[index].value)
            })
        })
    }
    return array
}

const autorizacaoRota = (value) => value == "privadas" ? "Bearer Token" : ""

const getNomeId = str => camelCase(str)

const camelCase = (str) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        if ((str.length - 1) == index) {
            return word.toLowerCase()
        }else{
            return index == 0 ? word.toLowerCase() : word.toUpperCase()
        }
    }).replace(/\s+/g, '')
}

btnSalvarRota.addEventListener('click', () => gerarJson())