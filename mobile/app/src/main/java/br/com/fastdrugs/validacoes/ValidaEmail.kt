package br.com.fastdrugs.validacoes

import android.util.Patterns
import com.google.android.material.textfield.TextInputEditText

class ValidaEmail {
    companion object {
        fun validarEmail(etEmail: TextInputEditText): Boolean {

            var retorno = false
            var email = etEmail.text.toString()

            if (!email.isEmpty() && Patterns.EMAIL_ADDRESS.matcher(email).matches())
                retorno = true
            else {
                etEmail.setError("Informe um e-mail válido.")
                etEmail.requestFocus()
            }

            return retorno
        }
    }

}