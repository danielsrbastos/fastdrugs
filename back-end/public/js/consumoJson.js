const consumirApi = (json, page) => {
    switch (page) {
        case 'clientes': 
            createHtml(json.cliente)
            // salvar()
            break
        case 'farmacias':
            createHtml(json.farmacia)
            break
        case 'novaRota':
            generateMenuRotes(formatJsonMenu(json))
            setAPIJson(json)
            break            
    }
}

const salvarNovoJson = (json) => {
    let blob = new Blob([JSON.stringify(json)], { type: "application/json; charset=UTF-8" });
    saveAs(blob, "API.json");
 }

const createHtml = (json) => {
    generateMenuRotes(json)
    generateCards(json)
}

const formatJsonMenu = (json) => {
    let privadas = [
        ...json.cliente.privadas,
        ...json.farmacia.privadas
    ]

    let publicas = [
        ...json.cliente.publicas,
        ...json.farmacia.publicas
    ]
    return {
        privadas,
        publicas
    }
}

const generateMenuRotes = (json) => {
    createMenuPrivates(json.privadas)
    createMenuPublic(json.publicas) 
    clickMenu()
}