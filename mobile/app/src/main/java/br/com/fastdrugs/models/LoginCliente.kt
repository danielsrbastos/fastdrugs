package br.com.fastdrugs.models

class LoginCliente {


    var email = ""
    var senha = ""
    var client = Client()
    var token = ""

    override fun toString(): String {
        return "LoginCliente(email='$email', senha='$senha', client=$client, token='$token')"
    }


}