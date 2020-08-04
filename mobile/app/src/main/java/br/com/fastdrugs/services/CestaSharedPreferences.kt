package br.com.fastdrugs.services

import android.content.Context
import br.com.fastdrugs.models.Produto
import com.google.gson.Gson

class CestaSharedPreferences(context: Context) {

    private val sharedPreferences = context.getSharedPreferences("cesta", Context.MODE_PRIVATE)
    private val editor = sharedPreferences.edit()

    private val gson = Gson()

    fun addProduct(productToAdd: Produto): Boolean {
        val products = gson.fromJson(sharedPreferences.getString("produtos", "[]"), Array<Produto>::class.java).toMutableList()
        var productToRemove = Produto()

        try {
            if (products[0].id_farmacia != productToAdd.id_farmacia)
                return false
        } catch (e: IndexOutOfBoundsException) {}

        products.forEach { product: Produto ->
            if (product.id_produto == productToAdd.id_produto) {
                productToAdd.quantidade += product.quantidade
                productToRemove = product
            }
        }

        products.remove(productToRemove)
        products.add(productToAdd)

        editor.putString("produtos", gson.toJson(products))
        editor.commit()

        return true
    }

    fun getProducts(): List<Produto> {
        return gson.fromJson(sharedPreferences.getString("produtos", "[]"), Array<Produto>::class.java).toList()
    }

    fun setProducts(products: List<Produto>) {
        editor.putString("produtos", gson.toJson(products))
        editor.commit()
    }

    fun clear() {
        editor.putString("produtos", "[]")
        editor.commit()
    }
}