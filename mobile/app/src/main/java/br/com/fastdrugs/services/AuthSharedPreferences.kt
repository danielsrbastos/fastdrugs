package br.com.fastdrugs.services

import android.content.Context

class AuthSharedPreferences(context: Context) {

    private val sharedPreferences = context.getSharedPreferences("auth", Context.MODE_PRIVATE)
    private val editor = sharedPreferences.edit()

    fun setAddressId(addressId: Int) {
        editor.putInt("addressId", addressId)
        editor.commit()
    }

    fun getAddressId(): Int {
        return sharedPreferences.getInt("addressId", 0)
    }
}