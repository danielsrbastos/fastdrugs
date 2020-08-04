package br.com.fastdrugs.models

class Client {

    var id = 0
    var nome = ""
    var email = ""
    var senha = ""
    var celular = ""
    var data_nascimento = ""
    var cpf = ""

    override fun toString(): String {
        return "Client(id=$id, nome='$nome', email='$email', senha='$senha', celular='$celular', data_nascimento='$data_nascimento', cpf='$cpf')"
    }


}