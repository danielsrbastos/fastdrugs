let rotaTipo = "publicas"

const reduceMenu = (acc, json) => {
    let submenu = ''
    let element = 'a'
    let classTag = 'hrefCard'
    if(json.submenu){
        submenu = generateSubmenu(json)
        element = 'div'
        classTag = "menu"
    }
    return acc + `
        <${element} id="btn${json.nomeId+rotaTipo}" href="#card${json.nomeId}" class="${json.id} ${rotaTipo} ${json.userRota} list-group-item ${classTag} list-group-item-action" data-toggle="list">${json.nome}</${element}>
    ` + submenu
}

const generateSubmenu = (json) => {
    console.log(json)
    const submenu = json.submenu
    return `<div id="submenu_${json.nomeId+rotaTipo}" class="list-group list-group-flush submenu">
        ${submenu.reduce(createSubmenu, '')}
    </div>
    `
}

const createSubmenu = (acc, json) =>{
    return acc + `
        <a href="#card${json.nomeId}" class="list-group-item hrefCard list-group-item-action" data-toggle="list">${json.nome}</a>
    `
}

const createMenuPrivates = (json) =>{
    rotaTipo = "privadas"
    const menu = document.getElementById('caixaMenu')
    const menuPrivado = json.reduce(reduceMenu, '')
    menu.innerHTML = `
    <h6 class="title text-center p-2">
        Rotas Privadas
    </h6>
    `
    menu.innerHTML += menuPrivado
}
const createMenuPublic = (json) =>{
    rotaTipo = "publicas"
    const menu = document.getElementById('caixaMenu')
    const menupublic = json.reduce(reduceMenu, '')
    menu.innerHTML += `
    <h6 class="title text-center p-2">
        Rotas Publicas
    </h6>
    `
    menu.innerHTML += menupublic
}

//Ativando Click

const ativaSubmenu = (menuName) => {
    let id = ""
    for (let index = 0; index < menuName.length; index++) {
        if (index >= 3) id += menuName[index]
    }
    const submenu = document.getElementById(`submenu_${id}`)
    if (submenu != null)
        displaySubmenu(submenu, 'block')
        
}

const displaySubmenu = (submenu, display) => {
    submenu.style = `display: ${display};`
}

const ocultarSubmenus = () => {
    const submenus = document.querySelectorAll('.submenu')
    submenus.forEach((item) => {
        displaySubmenu(item, 'none')
    })
}

const clickMenu = () => {
    const allMenus = document.querySelectorAll('.menu')
    allMenus.forEach((item) => {
        item.addEventListener("click", () => {
            ativaMenu(item)
            paginaMenu(item)
        })
    })
    hrefCard()
}

const ativaMenu = (menu) => {
    ocultarSubmenus()
    setMenuId(menu.id)
    ativaSubmenu(menu.id)
}