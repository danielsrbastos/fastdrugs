var idMenu = 0

//Trocar pagina
const trocarPagina = (value) => {
    window.location.href = validaPagina(value)
}

const validaPagina = (value) => {
    switch (value) {
        case 'pharmacy':
            return 'pharmacy.html'
            break
        case 'client':
            return 'client.html'
            break
        case 'adicionarRota':
            return 'addRouter.html'
            break
        default:
            return 'index.html'
    }
}

const btnTrocarPagina = () => {
    let btnRoutes = document.querySelectorAll('.btnRoutes')
    btnRoutes.forEach((item, indice, array) => {
        item.addEventListener("click", () => trocarPagina(item.value))
    })
}

btnTrocarPagina()
//Get Json API
const getJson = (docJson, pagina) => {
    consumirApi(docJson, pagina)
}

const setMenuId = (id) => {
    idMenu = id
}

//Funçoes da Pagina addRouter
const statushttpContainer = document.getElementById('statusHttpContainer')
const btnStatusHttp = document.getElementById('adicionarStatus')
const containerRequest = document.getElementById('requestContainer')
const containerResponse = document.getElementById('responseContainer')
const checkRota = document.getElementById('subRota')
const tituloRota = document.getElementById('tituloRota')

const adicionarStatus = () => {
    statushttpContainer.innerHTML = statushttpContainer.innerHTML + `
            <div class="form-group">
                <input type=" text" class="form-control statusErros">
            </div>
            `
}

const adicinaRequest = () => {
    containerRequest.innerHTML += `
            <textarea class="p-1 mb-2 caixaJson form-control requestErros"></textarea>
            `
}

const adicinaResponse = () => {
    containerResponse.innerHTML += `
            <textarea class="p-1 mb-2 caixaJson form-control responseErros"></textarea>
            `
}

const adicionarNovasCaixas = () => {
    adicionarStatus()
    adicinaRequest()
    adicinaResponse()
}

const adicionarParametrosSubRotas = () => {
    if (checkRota.value == 0) {
        checkRota.value = 1
        adicionarParametros()
    } else {
        checkRota.value = 0
        removerParametros()
    }
}

const adicionarParametros = () => {
    tituloRota.innerHTML = `
            <label for="titulo">Titulo da Rota</label>
            <input type="text" class="form-control" id="subtitulo">
            `
}

const removerParametros = () => {
    tituloRota.innerHTML = ''
}

const btnAddRoute = () => {
    checkRota.addEventListener('click', () => adicionarParametrosSubRotas())
    btnStatusHttp.addEventListener('click', () => { adicionarNovasCaixas() })
}

const hrefCard = () => {
    $(".hrefCard").on('click', function (e) {
        e.preventDefault()
        var target = $(this).attr('href')
        $('html, body').animate({
            scrollTop: ($(target).offset().top - 6),
        }, 1000)
    })
}