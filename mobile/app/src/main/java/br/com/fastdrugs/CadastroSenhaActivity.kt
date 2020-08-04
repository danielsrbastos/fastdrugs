package br.com.fastdrugs

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.text.SpannableStringBuilder
import android.view.MenuItem
import androidx.core.content.ContextCompat
import br.com.fastdrugs.http.HttpHelper
import br.com.fastdrugs.models.Cliente
import br.com.fastdrugs.models.Endereco
import br.com.fastdrugs.validacoes.ValidarCampos
import com.google.android.material.textfield.TextInputEditText
import com.google.gson.Gson
import kotlinx.android.synthetic.main.activity_cadastro_senha.*
import org.jetbrains.anko.doAsync
import org.jetbrains.anko.uiThread
import java.lang.Exception

class CadastroSenhaActivity : AppCompatActivity() {

    val gson = Gson()
    val http = HttpHelper()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_cadastro_senha)

        setSupportActionBar(toolbar_passo)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.setDisplayShowTitleEnabled(false)

        button_finalizar_cadastro.setOnClickListener {
            if (ValidarCampos.validarCampos(
                    edit_input_senha,
                    "Informe uma senha válida."
                ) && ValidarCampos.validarCampos(
                    edit_input_confirme_senha, ""
                )
            ) {
                if (!edit_input_senha.text.toString().equals(edit_input_confirme_senha.text.toString())) {
                    edit_input_confirme_senha.setError("As senhas inseridas não coincidem.")
                } else {

                    button_finalizar_cadastro.setEnabled(false)
                    button_finalizar_cadastro.setBackgroundColor(ContextCompat.getColor(this@CadastroSenhaActivity, R.color.colorButtonPressed))

                    postData()


                }
            }
        }

        if (intent.getStringExtra("FASTDRUGS_EXTRA_SENHA") != "") {
            edit_input_senha.text = SpannableStringBuilder(intent.getStringExtra("FASTDRUGS_EXTRA_SENHA"))
            edit_input_confirme_senha.text = SpannableStringBuilder(intent.getStringExtra("FASTDRUGS_EXTRA_SENHA"))
            button_finalizar_cadastro.callOnClick()
        }
    }

    fun postData() {
        val dataNascimento = intent.getStringExtra("FASTDRUGS_EXTRA_DATA_NASCIMENTO")
        val email = intent.getStringExtra("FASTDRUGS_EXTRA_EMAIL")
        val codigoValidaEmail = intent.getStringExtra("FASTDRUGS_EXTRA_CODIGO_VALIDA_EMAIL")
        val nome = intent.getStringExtra("FASTDRUGS_EXTRA_NOME")
        val cpf = intent.getStringExtra("FASTDRUGS_EXTRA_CPF")
        val celular = intent.getStringExtra("FASTDRUGS_EXTRA_CELULAR")
        val cep = intent.getStringExtra("FASTDRUGS_EXTRA_CEP")
        val logradouro = intent.getStringExtra("FASTDRUGS_EXTRA_CEP_ENDERECO_LOGRADOURO")
        val bairro = intent.getStringExtra("FASTDRUGS_EXTRA_CEP_ENDERECO_BAIRRO")
        val cidade = intent.getStringExtra("FASTDRUGS_EXTRA_CEP_ENDERECO_CIDADE")
        val estado = intent.getStringExtra("FASTDRUGS_EXTRA_CEP_ENDERECO_ESTADO")
        val complemento = intent.getStringExtra("FASTDRUGS_EXTRA_CEP_ENDERECO_COMPLEMENTO")
        val numero = intent.getStringExtra("FASTDRUGS_EXTRA_CEP_ENDERECO_NUMERO")
        val senha = findViewById<TextInputEditText>(R.id.edit_input_senha).text.toString()

        doAsync {
            try {
                // Instancia o objeto cliente, coloca os dados e converte o objeto em json
                val cliente = Cliente()
                cliente.nome = nome
                cliente.email = email
                cliente.senha = senha
                cliente.celular = celular
                cliente.cpf = cpf
                cliente.data_nascimento = dataNascimento

                val responseCliente = http.post("/clientes", gson.toJson(cliente))

                if (responseCliente != null) {
                    var clienteResponse = Cliente()
                    clienteResponse = gson.fromJson(responseCliente, Cliente::class.java)

                    // Instancia o objeto endereço, coloca os dados e converte o objeto em json
                    val endereco = Endereco()
                    endereco.cep = cep
                    endereco.logradouro = logradouro
                    endereco.numero = Integer.parseInt(numero)
                    endereco.complemento = complemento
                    endereco.bairro = bairro
                    endereco.cidade = cidade
                    endereco.estado = estado

                    var enderecoJson = gson.toJson(endereco)
                    enderecoJson = "{ \"enderecos\": [${enderecoJson}] }"

                    val responseEndereco = http.post("/clientes/${clienteResponse.id_cliente}/enderecos", enderecoJson)

                    if (responseEndereco != null) {
                        uiThread {
                            button_finalizar_cadastro.setEnabled(true)
                            button_finalizar_cadastro.setBackgroundColor(ContextCompat.getColor(this@CadastroSenhaActivity, R.color.colorPrimaryDark))

                            val intent = Intent(this@CadastroSenhaActivity, LoginActivity::class.java)
                            intent.putExtra("FASTDRUGS_EXTRA_EMAIL", email)
                            intent.putExtra("FASTDRUGS_EXTRA_SENHA", senha)
                            startActivity(intent)
                        }
                    }
                }
            } catch (e: Exception) {
                uiThread {
                    edit_input_confirme_senha.setError("Falha ao conectar-se com a internet.")
                    edit_input_confirme_senha.requestFocus()
                    button_finalizar_cadastro.setEnabled(true)
                    button_finalizar_cadastro.setBackgroundColor(ContextCompat.getColor(this@CadastroSenhaActivity, R.color.colorPrimaryDark))
                }
            }
        }
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
