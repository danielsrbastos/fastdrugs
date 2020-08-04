package br.com.fastdrugs.models.socket

class ImageRecipe {

    var filename = ""
    var base64 = ""

    override fun toString(): String {
        return "ImageRecipe(filename='$filename', base64='$base64')"
    }
}