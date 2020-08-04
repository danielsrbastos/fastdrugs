package br.com.fastdrugs.models

class Cliente {

    var id_cliente = 0
    var nome = ""
    var email = ""
    var senha = ""
    var celular = ""
    var data_nascimento = ""
    var cpf = ""
    var clienteEnderecos = ArrayList<Endereco>()

    override fun toString(): String {
        return "Cliente(id_cliente=$id_cliente, nome='$nome', email='$email', senha='$senha', celular='$celular', data_nascimento='$data_nascimento', cpf='$cpf', clienteEnderecos=$clienteEnderecos)"
    }


}