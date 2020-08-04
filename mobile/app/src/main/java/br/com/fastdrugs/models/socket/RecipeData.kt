package br.com.fastdrugs.models.socket

import br.com.fastdrugs.models.Produto

class RecipeData {

    var name = ""
    var email = ""
    var pharmacyId = 0
    var clientId = 0
    var error = ""
    var products = ArrayList<Produto>()

    override fun toString(): String {
        return "RecipeData(name='$name', email='$email', pharmacyId=$pharmacyId, clientId=$clientId, error='$error', products=$products)"
    }
}