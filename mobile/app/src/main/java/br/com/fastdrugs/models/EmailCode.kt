package br.com.fastdrugs.models

class EmailCode {

    var name = ""
    var codeHash = ""
    var to = ""
    var status = false

    override fun toString(): String {
        return "EmailCode(name='$name', codeHash='$codeHash', to='$to', status=$status)"
    }
}