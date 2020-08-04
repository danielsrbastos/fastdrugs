const KEY = '@FastDrugs:cestaDeCompras'

class CestaDeCompras {
    init = () => {
        let products = JSON.parse(localStorage.getItem(KEY))

        if (products === null)
            products = []

        localStorage.setItem(KEY, JSON.stringify(products))
    }

    addProduct = product => {
        let products = JSON.parse(localStorage.getItem(KEY))

        if (products.length > 0) {
            if (products[0].id_farmacia !== product.id_farmacia) {
                return false
            }
        }

        products.map(p => {
            if (p.id_produto === product.id_produto) {
                p.quantidade = +p.quantidade + product.quantidade
                product = false
            }

            return p
        })

        if (product)
            products.push(product)

        localStorage.setItem(KEY, JSON.stringify(products))

        return true
    }

    getProducts = () => {
        return JSON.parse(localStorage.getItem(KEY))
    }

    clearCesta = () => {
        return localStorage.setItem(KEY, JSON.stringify([]))
    }

    removeCesta = () => {
        return localStorage.removeItem(KEY)
    }

    setCesta = products => {
        return localStorage.setItem(KEY, JSON.stringify(products))
    }
}

export default new CestaDeCompras()