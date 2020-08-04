package br.com.fastdrugs.models

class Produto {
    var id_produto = 0
    var nome = ""
    var descricao = ""
    var preco = 0.0
    var id_categoria = 0
    var id_farmacia = 0
    var quantidade = 1
    var ImagemProduto = ArrayList<ImageProduto>()
    var produtosFarmacia = Farma()

    override fun toString(): String {
        return "Produto(id_produto=$id_produto, nome='$nome', descricao='$descricao', preco=$preco, id_categoria=$id_categoria, id_farmacia=$id_farmacia, quantidade=$quantidade, ImagemProduto=$ImagemProduto, produtosFarmacia=$produtosFarmacia)"
    }
}

class Farma {
    var nome = ""
    var url_imagem = ""

    override fun toString(): String {
        return "Farma(nome='$nome', url_imagem='$url_imagem')"
    }
}