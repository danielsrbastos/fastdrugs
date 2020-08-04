package br.com.fastdrugs

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.MenuItem
import br.com.fastdrugs.validacoes.ValidarCampos
import com.google.android.material.textfield.TextInputEditText
import kotlinx.android.synthetic.main.activity_cadastro_cep_endereco.*

class CadastroCepEnderecoActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_cadastro_cep_endereco)

        setSupportActionBar(toolbar_passo)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.setDisplayShowTitleEnabled(false)

        val logradouro = intent.getStringExtra("FASTDRUGS_EXTRA_LOGRADOURO")
        val bairro = intent.getStringExtra("FASTDRUGS_EXTRA_BAIRRO")
        val cidade = intent.getStringExtra("FASTDRUGS_EXTRA_CIDADE")
        val estado = intent.getStringExtra("FASTDRUGS_EXTRA_ESTADO")

        edit_input_logradouro.setText(logradouro)
        edit_input_bairro.setText(bairro)
        edit_input_cidade.setText(cidade)
        edit_input_estado.setText(estado)

        // Botão próxima etapa - Ir para a tela cadastro de senha
        button_proxima_etapa_cep_endereco.setOnClickListener {

            if (ValidarCampos.validarCampos(edit_input_numero, "Informe um número válido.")) {
                abrirCadastroSenhaActivity(logradouro, bairro, cidade, estado)
            }
        }
    }

    // Função para abrir a tela cadastro senha
    private fun abrirCadastroSenhaActivity(logradouro: String, bairro: String, cidade: String, estado: String) {
        val dataNascimento = intent.getStringExtra("FASTDRUGS_EXTRA_DATA_NASCIMENTO")
        val email = intent.getStringExtra("FASTDRUGS_EXTRA_EMAIL")
        val codigoValidaEmail = intent.getStringExtra("FASTDRUGS_EXTRA_CODIGO_VALIDA_EMAIL")
        val nome = intent.getStringExtra("FASTDRUGS_EXTRA_NOME")
        val cpf = intent.getStringExtra("FASTDRUGS_EXTRA_CPF")
        val celular = intent.getStringExtra("FASTDRUGS_EXTRA_CELULAR")
        val cep = intent.getStringExtra("FASTDRUGS_EXTRA_CEP")
        val complemento = findViewById<TextInputEditText>(R.id.edit_input_complemento).text.toString()
        val numero = findViewById<TextInputEditText>(R.id.edit_input_numero).text.toString()

        var senha = ""
        if (intent.getStringExtra("FASTDRUGS_EXTRA_SENHA") != null) {
            senha = intent.getStringExtra("FASTDRUGS_EXTRA_SENHA")!!
        }

        val intent = Intent(this, CadastroSenhaActivity::class.java).apply {
            putExtra("FASTDRUGS_EXTRA_DATA_NASCIMENTO", dataNascimento)
            putExtra("FASTDRUGS_EXTRA_EMAIL", email)
            putExtra("FASTDRUGS_EXTRA_CODIGO_VALIDA_EMAIL", codigoValidaEmail)
            putExtra("FASTDRUGS_EXTRA_NOME", nome)
            putExtra("FASTDRUGS_EXTRA_CPF", cpf)
            putExtra("FASTDRUGS_EXTRA_CELULAR", celular)
            putExtra("FASTDRUGS_EXTRA_CEP", cep)
            putExtra("FASTDRUGS_EXTRA_CEP_ENDERECO_LOGRADOURO", logradouro)
            putExtra("FASTDRUGS_EXTRA_CEP_ENDERECO_BAIRRO", bairro)
            putExtra("FASTDRUGS_EXTRA_CEP_ENDERECO_CIDADE", cidade)
            putExtra("FASTDRUGS_EXTRA_CEP_ENDERECO_ESTADO", estado)
            putExtra("FASTDRUGS_EXTRA_CEP_ENDERECO_COMPLEMENTO", complemento)
            putExtra("FASTDRUGS_EXTRA_CEP_ENDERECO_NUMERO", numero)
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
