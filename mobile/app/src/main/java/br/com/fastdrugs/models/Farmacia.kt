package br.com.fastdrugs.models

data class Farmacia(
    var id_farmacia: Int,
    var nome: String,
    var email: String,
    var cnpj: String,
    var cep: String,
    var logradouro: String,
    var numero: Int,
    var complemento: String,
    var bairro: String,
    var cidade: String,
    var estado: String,
    var seg_sex: String,
    var sab: String,
    var dom_fer: String,
    var responsavel: String,
    var status: Boolean,
    var imagem: String,
    var url_imagem: String,
    var avaliacao: Double,
    var distancia_maxima_entrega: Int,
    var preco_por_km: Double,
    var distancia_maxima_frete_gratis: Int,
    var distancia: Double,
    var tempo: String,
    var frete: Double
){
    override fun toString(): String {
        return "Farmacia(id_farmacia=$id_farmacia, nome='$nome', email='$email', cnpj='$cnpj', cep='$cep', logradouro='$logradouro', numero=$numero, complemento='$complemento', bairro='$bairro', cidade='$cidade', estado='$estado', seg_sex='$seg_sex', sab='$sab', dom_fer='$dom_fer', responsavel='$responsavel', status=$status, imagem='$imagem', url_imagem='$url_imagem', avaliacao=$avaliacao, distancia_maxima_entrega=$distancia_maxima_entrega, preco_por_km=$preco_por_km, distancia_maxima_frete_gratis=$distancia_maxima_frete_gratis, distancia=$distancia, tempo='$tempo', frete=$frete)"
    }
}