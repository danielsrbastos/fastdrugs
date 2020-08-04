package br.com.fastdrugs.validacoes

import android.os.Build
import androidx.annotation.RequiresApi
import com.google.android.material.textfield.TextInputEditText
import java.lang.Exception
import java.time.LocalDate
import java.time.Period
import java.time.format.DateTimeFormatter
import java.time.format.ResolverStyle

class ValidaDataNascimento {
    companion object {

        // Função para validar a entrada de data
        @RequiresApi(Build.VERSION_CODES.O)
        fun validarData(etData: TextInputEditText): Boolean {

            var retorno = false

            var dataTexto = etData.text.toString()

            var formatter = "dd/MM/uuuu"

            var df = DateTimeFormatter.ofPattern(formatter).withResolverStyle(ResolverStyle.STRICT)

            try {
                var data = LocalDate.parse(dataTexto, df)
                retorno = true
            } catch (e: Exception) {
//                retorno = false
            }
            return retorno

        }

        // Função para validar se o usuário é maior de idade
        @RequiresApi(Build.VERSION_CODES.O)
        fun validarMaioridade(etDataNascimento: TextInputEditText): Boolean {
            var retorno = false
            var dataAtual = LocalDate.now()
            var formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy")
            var dataNascimento = LocalDate.parse(etDataNascimento.text, formatter)

            var period = Period.between(dataNascimento, dataAtual)

            if (period.years >= 18 && period.months >= 0 && period.days >= 0) {
                println("Maior de idade")
                retorno = true
            } else {
                etDataNascimento.setError("Você precisa ter no mínimo 18 anos.")
                etDataNascimento.requestFocus()
            }

            return retorno
        }
    }
}