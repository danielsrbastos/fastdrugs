package br.com.fastdrugs

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.text.SpannableStringBuilder
import android.view.MenuItem
import androidx.core.content.ContextCompat
import br.com.fastdrugs.http.HttpHelper
import br.com.fastdrugs.models.EmailCpfCelular
import br.com.fastdrugs.validacoes.Mascara
import br.com.fastdrugs.validacoes.ValidaCPF
import br.com.fastdrugs.validacoes.ValidarCampos
import com.google.android.material.textfield.TextInputEditText
import com.google.gson.Gson
import kotlinx.android.synthetic.main.activity_cadastro_cpf.*
import org.jetbrains.anko.doAsync
import org.jetbrains.anko.uiThread
import java.lang.Exception

class CadastroCpfActivity : AppCompatActivity() {

    val gson = Gson()
    val http = HttpHelper()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_cadastro_cpf)

        if (intent.getStringExtra("FASTDRUGS_EXTRA_NOME") != null) {
            edit_input_nome.text = SpannableStringBuilder(intent.getStringExtra("FASTDRUGS_EXTRA_NOME"))
        }

        setSupportActionBar(toolbar_passo)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.setDisplayShowTitleEnabled(false)

        edit_input_cpf.addTextChangedListener(Mascara.mascara("###.###.###-##", edit_input_cpf))
        edit_input_celular.addTextChangedListener(
            Mascara.mascara(
                "(##) #####-####",
                edit_input_celular
            )
        )

        // Botão próxima etapa - Ir para a tela cadastro cep
        button_proxima_etapa_cpf.setOnClickListener {

            if (ValidarCampos.validarCampos(
                    edit_input_nome,
                    "Informe um nome válido."
                ) && ValidarCampos.validarCampos(
                    edit_input_cpf,
                    "Informe um CPF válido."
                ) && ValidarCampos.validarCampos(
                    edit_input_celular,
                    "Informe um celular válido."
                )
            ) {
                if (ValidaCPF.validarCpf(edit_input_cpf.text.toString())) {
                    button_proxima_etapa_cpf.setEnabled(false)
                    button_proxima_etapa_cpf.setBackgroundColor(ContextCompat.getColor(this@CadastroCpfActivity, R.color.colorButtonPressed))

                    doAsync {
                        try {
                            val cpfCelularValidate = EmailCpfCelular()
                            cpfCelularValidate.celular = edit_input_celular.text.toString()
                            cpfCelularValidate.cpf = edit_input_cpf.text.toString()

                            val response = http.post("/clientes/validate", gson.toJson(cpfCelularValidate))
    println(">>>>>>>>>>>>>>>>>>>>> $response")

                            if (response != null) {
                                if (response.contains("Nenhum utilizamento")) {

                                    uiThread {
                                        button_proxima_etapa_cpf.setEnabled(true)
                                        button_proxima_etapa_cpf.setBackgroundColor(ContextCompat.getColor(this@CadastroCpfActivity, R.color.colorPrimaryDark))
                                    }

                                    abrirCadastroCepActivity()
                                } else if (response.contains("o CPF já esta em uso")) {
                                    uiThread {
                                        edit_input_cpf.setError("CPF já cadastrado.")
                                        edit_input_cpf.requestFocus()
                                        button_proxima_etapa_cpf.setEnabled(true)
                                        button_proxima_etapa_cpf.setBackgroundColor(ContextCompat.getColor(this@CadastroCpfActivity, R.color.colorPrimaryDark))
                                    }
                                } else if (response.contains("o numero já esta em uso")) {
                                    uiThread {
                                        edit_input_celular.setError("Celular já cadastrado.")
                                        edit_input_celular.requestFocus()
                                        button_proxima_etapa_cpf.setEnabled(true)
                                        button_proxima_etapa_cpf.setBackgroundColor(ContextCompat.getColor(this@CadastroCpfActivity, R.color.colorPrimaryDark))
                                    }
                                }
                            }
                        } catch (e: Exception) {
                            uiThread {
                                edit_input_cpf.setError("Falha ao conectar-se com a internet.")
                                edit_input_cpf.requestFocus()
                                button_proxima_etapa_cpf.setEnabled(true)
                                button_proxima_etapa_cpf.setBackgroundColor(ContextCompat.getColor(this@CadastroCpfActivity, R.color.colorPrimaryDark))
                            }
                        }
                    }
                }
                else {
                    edit_input_cpf.setError("Informe um CPF válido")
                    edit_input_cpf.requestFocus()
                }
            }
        }
    }

    // Função para abrir a tela cadastro cep
    private fun abrirCadastroCepActivity() {
        val dataNascimento = intent.getStringExtra("FASTDRUGS_EXTRA_DATA_NASCIMENTO")
        val email = intent.getStringExtra("FASTDRUGS_EXTRA_EMAIL")
        val codigoValidaEmail = intent.getStringExtra("FASTDRUGS_EXTRA_CODIGO_VALIDA_EMAIL")
        val nome = findViewById<TextInputEditText>(R.id.edit_input_nome).text.toString()
        val cpf = findViewById<TextInputEditText>(R.id.edit_input_cpf).text.toString()
        val celular = findViewById<TextInputEditText>(R.id.edit_input_celular).text.toString()

        var senha = ""
        if (intent.getStringExtra("FASTDRUGS_EXTRA_SENHA") != null) {
            senha = intent.getStringExtra("FASTDRUGS_EXTRA_SENHA")!!
        }

        val intent = Intent(this, CadastroCepActivity::class.java).apply {
            putExtra("FASTDRUGS_EXTRA_DATA_NASCIMENTO", dataNascimento)
            putExtra("FASTDRUGS_EXTRA_EMAIL", email)
            putExtra("FASTDRUGS_EXTRA_CODIGO_VALIDA_EMAIL", codigoValidaEmail)
            putExtra("FASTDRUGS_EXTRA_NOME", nome)
            putExtra("FASTDRUGS_EXTRA_CPF", cpf)
            putExtra("FASTDRUGS_EXTRA_CELULAR", celular)
            putExtra("FASTDRUGS_EXTRA_SENHA", senha)
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
