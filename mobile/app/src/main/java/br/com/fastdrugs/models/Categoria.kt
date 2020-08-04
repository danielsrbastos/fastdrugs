package br.com.fastdrugs.models

class Categoria {
    var id_categoria = 0
    var nome = ""
    var listItem = ArrayList<Produto>()

    override fun toString(): String {
        return "Categoria(id_categoria=$id_categoria, nome='$nome', listItem=$listItem)"
    }
}