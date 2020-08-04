package br.com.fastdrugs.validacoes

import android.text.TextUtils
import com.google.android.material.textfield.TextInputEditText

class ValidarCampos {
    companion object{
        fun validarCampos(etCampo: TextInputEditText, erro: String): Boolean{

         var retorno: Boolean = false

         if(!TextUtils.isEmpty(etCampo.text.toString()))
             retorno = true
          else{
             etCampo.setError(erro)
             etCampo.requestFocus()
         }
            return retorno
        }
    }
}