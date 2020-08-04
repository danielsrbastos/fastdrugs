package br.com.fastdrugs

import android.content.Intent
import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.MenuItem
import androidx.annotation.RequiresApi
import br.com.fastdrugs.validacoes.Mascara
import br.com.fastdrugs.validacoes.ValidaDataNascimento
import br.com.fastdrugs.validacoes.ValidarCampos
import com.google.android.material.textfield.TextInputEditText
import kotlinx.android.synthetic.main.activity_cadastro_nascimento.*

class CadastroNascimentoActivity : AppCompatActivity() {

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_cadastro_nascimento)

        setSupportActionBar(toolbar_passo)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.setDisplayShowTitleEnabled(false)

        edit_input_data_nascimento.addTextChangedListener(
            Mascara.mascara(
                "##/##/####",
                edit_input_data_nascimento
            )
        )

        button_proxima_etapa_nascimento.setOnClickListener {
            if (ValidarCampos.validarCampos(
                    edit_input_data_nascimento,
                    "Informe uma data de nascimento válida."
                )
            ) {
            if (ValidaDataNascimento.validarData(edit_input_data_nascimento)) {
                if (ValidaDataNascimento.validarMaioridade(edit_input_data_nascimento))
                    abrirCadastroEmailActivity()
            } else {
                edit_input_data_nascimento.setError("Informe uma data de nascimento válida.")
                edit_input_data_nascimento.requestFocus()
            }
            }
        }

    }

    //Função para abrir a tela  cadastro de email passando a data de nascimento
    private fun abrirCadastroEmailActivity() {
        val editInputdataNascimento =
            findViewById<TextInputEditText>(R.id.edit_input_data_nascimento)
        val dataNascimento = editInputdataNascimento.text.toString()
        val intent = Intent(this, CadastroEmailActivity::class.java).apply {
            putExtra("FASTDRUGS_EXTRA_DATA_NASCIMENTO", dataNascimento)
        }
        startActivity(intent)
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            android.R.id.home -> {
                super.onBackPressed()
                finish()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }
}
