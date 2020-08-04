package br.com.fastdrugs.models

class ImageProduto {
    var id_imagem = 0
    var imagem = ""
    var url_imagem = ""

    override fun toString(): String {
        return "ImagemProduto(id_imagem=$id_imagem, imagem='$imagem', url_imagem='$url_imagem')"
    }
}