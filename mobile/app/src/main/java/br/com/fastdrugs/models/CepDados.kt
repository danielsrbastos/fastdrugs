package br.com.fastdrugs.models

class CepDados {

    var logradouro = ""
    var bairro = ""
    var localidade = ""
    var uf = ""

    override fun toString(): String {
        return "CepDados(logradouro='$logradouro', bairro='$bairro', localidade='$localidade', uf='$uf')"
    }
}