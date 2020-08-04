package br.com.fastdrugs.models

import java.util.*
import kotlin.collections.ArrayList

class Pedido {

    var id_pedido = 0
    var numero = UUID.randomUUID().toString().substring(0, 35)
    var frete = 0.0
    var valor = 0.0
    var forma_pagamento = ""
    var status = ""
    var avaliacao = ""
    var produtos = ArrayList<Produto>()
    var id_cliente = 0
    var produtosPedidos = ArrayList<Produto>()
    var createdAt = ""
    var updatedAt = ""
    val nomeFarmacia = ""

    override fun toString(): String {
        return "Pedido(id_pedido=$id_pedido, numero='$numero', frete=$frete, valor=$valor, forma_pagamento='$forma_pagamento', status='$status', avaliacao='$avaliacao', produtos=$produtos, id_cliente=$id_cliente, produtosPedidos=$produtosPedidos, createdAt='$createdAt', updatedAt='$updatedAt', nomeFarmacia='$nomeFarmacia')"
    }
}