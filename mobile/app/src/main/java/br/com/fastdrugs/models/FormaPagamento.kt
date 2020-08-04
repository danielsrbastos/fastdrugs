package br.com.fastdrugs.models

class FormaPagamento {
    var id_forma_pagamento = 0
    var tipo = ""

    override fun toString(): String {
        return "FormaPagamento(id_forma_pagamento=$id_forma_pagamento, tipo='$tipo')"
    }
}