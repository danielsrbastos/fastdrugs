package br.com.fastdrugs.models

class Endereco {

    var id_endereco = 0
    var cep = ""
    var logradouro = ""
    var numero = 0
    var complemento = ""
    var bairro = ""
    var cidade = ""
    var estado = ""

    override fun toString(): String {
        return "Endereco(id_endereco=$id_endereco, cep='$cep', logradouro='$logradouro', numero=$numero, complemento='$complemento', bairro='$bairro', cidade='$cidade', estado='$estado')"
    }


}