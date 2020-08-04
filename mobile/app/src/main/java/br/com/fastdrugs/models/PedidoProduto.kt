package br.com.fastdrugs.models

data class PedidoProduto(
    val id_pedido:Int,
    val produto: String,
    val preco_produto: Double,
    val quantidade:Int,
    val total:Double
){

}