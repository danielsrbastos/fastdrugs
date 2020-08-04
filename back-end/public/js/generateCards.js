let typeRota = ''
let indexAPi = 0

const setTypeRota = (type) => {
    typeRota = type
}

const htmlCard = (acc, json, indice, array) => {
    let safeRoute = ''
    let auth = ''
    myIndex = indexAPi
    indexAPi ++ 
    switch(typeRota){
        case 'privado':
            safeRoute = `
            <div class="mb-0">
                <p class="">
                    <strong>
                        Authorization: 
                    </strong>
                    <span id="auth">
                        ${json.authorization}
                    </span>
                </p>
            </div>
            `
            auth = `<h6 class="card-subtitle mb-2 text-muted">Rota Privada</h6`
            break
    }

    return acc + `
    <div id="card${json.nomeId}" class="card mb-2">
        <div class="card-body d-flex flex-column">
            <div class="mb-0">
                <h5 id="tituloCard${json.nomeId}" class="card-title mb-2">${json.nome}</h5>
                ${auth} 
            </div>
            <br>
            <div class="mb-0">
                <p class="">
                    <strong>
                        Descrição:
                    </strong>
                    <span id="descricao${json.nomeId}">
                        ${json.descricao}
                    </span>
                </p>
            </div>
            <div class="mb-0">
                <p class="">
                    <strong>
                        URL:
                    </strong>
                    <span id="url${json.nomeId}">
                        ${json.url}
                    </span>
                </p>
            </div>
            <div class="mb-0">
                <p class="">
                    <strong>
                        PathVariaveis:
                    </strong>
                    <span id="pathVariable${json.nomeId}">
                        ${json.pathVariables.map((value, index) => {
                            return " " + value
                        })}
                    </span>
                </p>
            </div>
            <div class="mb-0">
                <p class="">
                    <strong>
                        Method:
                    </strong>
                    <span id="method${json.nomeId}">
                        ${json.method}
                    </span>
                </p>
            </div>
            ${safeRoute}
            <div class="mb-2 d-flex align-items-center">
                <p>
                    <strong>
                        Status HTTP:
                    </strong>
                </p>
                <div class="btn-group ml-3">
                        <button id="btn${json.nomeId}Ativado" type="button" value="${json.requestSuccess.statusCode} 0" class="btn${json.nomeId} ${myIndex} btn btn-primary">
                        ${json.requestSuccess.statusCode}
                    </button>
                    <button type="button" class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="sr-only">Toggle Dropdown</span>
                    </button>
                    <div class="dropdown-menu">
                    ${dropdownStatusCode(json, myIndex)}
                    </div>
                </div>
            </div>
            <div class="mb-3">
                <h6>
                    Body Params
                </h6>
                <div class="card my-border">
                    <div class="card-body p-0 rounded-sm ">
                        <textarea id="textParams${json.nomeId}" class="caixaJson p-1 border-0 form-control" disabled>${formatJson(json.requestSuccess.request)}</textarea>
                    </div>
                </div>
            </div>
            <div class="mb-3">
                <h6>
                    Retorno
                </h6>
                <div class="card my-border">
                    <div class="card-body p-0 rounded-sm">
                        <textarea id="textResponse${json.nomeId}" class="p-1 caixaJson border-0 form-control" disabled>${formatJson(json.requestSuccess.response)}</textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
    `
}

const dropdownStatusCode = (json, indice) => {
    const statusErrors = json.requestsErrors.map(arrayStatusCode)
    let htmlStatusCode = ''
    statusErrors.forEach((value, i) => {
        htmlStatusCode += `<button value="${value} ${i}" class="btn${json.nomeId} ${indice} btnDropdown dropdown-item" type="button">${value}</button>` 
    })

    return htmlStatusCode
}

const arrayStatusCode = (value) => value.statusCode

const formatJson = (json) => {
    let stringJson = JSON.stringify(json, null, '\t')
    stringJson = stringJson.replace(stringJson[0],stringJson[0] + '\n')
    return stringJson
}

const generateCards = (json) => {
    const private = json.privadas
    const public = json.publicas
    let html = ''
    let dadosJson = []

    const cardArray = createCardArray(private, public)

    cardArray.forEach((el, index) => {
        if (el.json.length !== 0){
            el.json.forEach((value, index) => {
                if (value.submenu){
                    html += createCardHtml(value.submenu, el.type)
                    value.submenu.forEach(el => {
                        dadosJson.push(el)
                    })
                }else{
                    html += createCardHtml([value], el.type)
                    dadosJson.push(value)
                }
            })
        }
            
    })

    acionaContainer(html, dadosJson)
}

const acionaContainer = (cardsHtml, json) => {
    const cardContainer = document.getElementById('cardContainer')

    cardContainer.innerHTML = cardsHtml
    caixaJson()
    btnDropdown(json)
}

const caixaJson = () => {
    const caixaJson = document.querySelectorAll('.caixaJson')
    caixaJson.forEach((value) => {
        ajustaCaixaJson([value])
    })
}

const ajustaCaixaJson = (caixaJson) =>{
    caixaJson.forEach((item) => {
        let string = item.value.replace(/[\n|\n\r]/, '')
        item.value = string
        string = string.split(/[\n|\n\r]/)
        item.rows = string.length
    })
}

const btnDropdown = (json) =>{
    const btns = document.querySelectorAll('.btnDropdown')
    btns.forEach((item) => [
        item.addEventListener('click', () => ativaDropdown(item, json))
    ])
}

const ativaDropdown = (btn, json) =>{
    const classNames = btn.classList
    const cardJson = json[classNames[1]]
    const btns = document.querySelectorAll('.' + classNames[0])
    const btnAtivado = classNames[0] + "Ativado"
    const btnValue = validaValue(btn.value)
    btns.forEach((value) => {
        if (value.id == btnAtivado) {
            const nomeAtivado = validaValue(value.value)
            const valueAtivado = value.value
            value.innerHTML = btnValue
            value.value = btn.value
            btn.innerHTML = nomeAtivado
            btn.value = valueAtivado
            statusAtivo(cardJson, value)
        }
    })
}

const dividirString = (value, divisor) => {
    return value.split(divisor)
}

const validaValue = (value) => {
    let arrayValue = dividirString(value, " ")
    const length = arrayValue.length - 1
    let stringValue = '' 
    if (typeof parseInt(arrayValue[length]) == 'number'){
        arrayValue.pop()
    }
    arrayValue.forEach((item) => {
        stringValue += item + " "
    })

    return stringValue
}

const statusAtivo = (json, btn) => {
    const status = btn.value.split(" ")
    if (parseInt(status[0]) >= 200 && parseInt(status[0]) <= 299){
        criarCardRequisicoes(json.nomeId, json.requestSuccess)
    }else{
        let statusIndice = status.length - 1
        let indice = status[statusIndice]
        criarCardRequisicoes(json.nomeId, json.requestsErrors[indice])
    }
}

const criarCardRequisicoes = (nomeId, json) => {
    const cardRequest = document.getElementById(`textParams${nomeId}`)
    const cardResponse = document.getElementById(`textResponse${nomeId}`)
    let jsonRequisicao = createJsonRequisicao(json)

    cardRequest.value = formatJson(jsonRequisicao[0])
    cardResponse.value = formatJson(jsonRequisicao[1])

    ajustaCaixaJson([cardRequest, cardResponse])
}

const createJsonRequisicao = (json) => {
    return [
        json.request,
        json.response
    ]
}

const createCardHtml = (array, type) => {
    setTypeRota(type)
    let html = array.reduce(htmlCard, '')
    return html
}

const createCardArray = (jsonPrivate, jsonPublic) => {

    return [
        {
            type: 'publico',
            json: jsonPublic.filter(checkCard)
        },
        {
            type: 'publico',
            json: jsonPublic.filter(checkSubcard),
        },
        {
            type: 'privado',
            json: jsonPrivate.filter(checkCard),
        },
        {
            type: 'privado',
            json: jsonPrivate.filter(checkSubcard),
        }

    ]
}

const checkCard = (item) => !item.submenu

const checkSubcard = (item) => item.submenu