package br.com.fastdrugs

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.MenuItem
import android.view.View
import android.widget.EditText
import br.com.fastdrugs.http.HttpHelper
import br.com.fastdrugs.models.EmailCode
import com.google.gson.Gson
import kotlinx.android.synthetic.main.activity_cadastro_validacao_email.*
import org.jetbrains.anko.doAsync
import java.security.MessageDigest

class CadastroValidacaoEmailActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_cadastro_validacao_email)

        setSupportActionBar(toolbar_passo)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.setDisplayShowTitleEnabled(false)

        email.text = intent.getStringExtra("FASTDRUGS_EXTRA_EMAIL")
        val emailCode = Gson().fromJson(intent.getStringExtra("FASTDRUGS_EMAIL_CODE"), EmailCode::class.java)

        // Botão próxima etapa - Ir para a tela cadastro cpf
        button_proxima_etapa_validacao_email.setOnClickListener {
            invalidCode.visibility = View.GONE
            val code = edit_codigo.text.toString().replace(" ", "").trim()

            println(">>>>>>>>>>>>>>>>>>>>>>>>>>> ${(code + emailCode.to).sha256()}")
            println(">>>>>>>>>>>>>>>>>>>>>>>>>>> ${(emailCode.codeHash)}")

            if ((code + emailCode.to).sha256() == emailCode.codeHash) {
                abrirCadastroCpfActivity()
            } else {
                invalidCode.visibility = View.VISIBLE
            }
        }
    }

    // Função para abrir a tela cadastro cpf
    private fun abrirCadastroCpfActivity() {
        val dataNascimento = intent.getStringExtra("FASTDRUGS_EXTRA_DATA_NASCIMENTO")
        val email = intent.getStringExtra("FASTDRUGS_EXTRA_EMAIL")
        val intent = Intent(this, CadastroCpfActivity::class.java).apply {
            putExtra("FASTDRUGS_EXTRA_DATA_NASCIMENTO", dataNascimento)
            putExtra("FASTDRUGS_EXTRA_EMAIL", email)
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

    fun String.sha256(): String {
        return hashString(this, "SHA-256")
    }

    private fun hashString(input: String, algorithm: String): String {
        return MessageDigest
            .getInstance(algorithm)
            .digest(input.toByteArray())
            .fold("", { str, it -> str + "%02x".format(it) })
    }
}
