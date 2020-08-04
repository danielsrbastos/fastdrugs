package br.com.fastdrugs

import android.content.Intent
import android.content.pm.PackageInfo
import android.content.pm.PackageManager
import android.os.Bundle
import android.text.SpannableStringBuilder
import android.util.Base64
import android.util.Log
import android.view.MenuItem
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import br.com.fastdrugs.http.HttpHelper
import br.com.fastdrugs.models.EmailCode
import br.com.fastdrugs.models.EmailCpfCelular
import br.com.fastdrugs.models.EmailUsername
import br.com.fastdrugs.validacoes.ValidaEmail
import com.facebook.AccessToken
import com.facebook.CallbackManager
import com.facebook.FacebookCallback
import com.facebook.FacebookException
import com.facebook.login.LoginManager
import com.facebook.login.LoginResult
import com.google.android.material.textfield.TextInputEditText
import com.google.firebase.auth.FacebookAuthProvider
import com.google.firebase.auth.FirebaseAuth
import com.google.gson.Gson
import kotlinx.android.synthetic.main.activity_cadastro_email.*
import org.jetbrains.anko.doAsync
import org.jetbrains.anko.uiThread
import java.security.MessageDigest
import java.security.NoSuchAlgorithmException
import java.util.*


class CadastroEmailActivity : AppCompatActivity() {

    private lateinit var callbackManager: CallbackManager
    private lateinit var auth: FirebaseAuth

    val gson = Gson()
    val http = HttpHelper()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_cadastro_email)

        pgBar.visibility = View.GONE

        setSupportActionBar(toolbar_passo)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.setDisplayShowTitleEnabled(false)

        auth = FirebaseAuth.getInstance()
        callbackManager = CallbackManager.Factory.create()

        buttonFacebookLogin.setOnClickListener {
            pgBar.visibility = View.VISIBLE
            facebookLogin()
        }

        // Botão próxima etapa - Ir para a tela cadastro validação email
        button_proxima_etapa_email.setOnClickListener {
            if (ValidaEmail.validarEmail(edit_input_email)) {
                button_proxima_etapa_email.setEnabled(false)
                button_proxima_etapa_email.setBackgroundColor(
                    ContextCompat.getColor(
                        this@CadastroEmailActivity,
                        R.color.colorButtonPressed
                    )
                )

                doAsync {
                    try {
                        val emailValidate = EmailCpfCelular()
                        emailValidate.email = edit_input_email.text.toString()

                        val response = http.post("/clientes/validate", gson.toJson(emailValidate))

                        if (response != null) {
                            if (response.contains("Nenhum utilizamento")) {

                                val emailUsername = EmailUsername()
                                emailUsername.email = edit_input_email.text.toString()

                                val responseEmailSendCode = HttpHelper().post("/clientes/0/sendCodeEmail", gson.toJson(emailUsername))
                                val emailCode = gson.fromJson(responseEmailSendCode, EmailCode::class.java)

                                uiThread {
                                    button_proxima_etapa_email.setEnabled(true)
                                    button_proxima_etapa_email.setBackgroundColor(
                                        ContextCompat.getColor(
                                            this@CadastroEmailActivity,
                                            R.color.colorPrimaryDark
                                        )
                                    )
                                }

                                abrirCadastroValidacaoEmailActivity(emailCode)
                            } else {
                                uiThread {
                                    edit_input_email.setError("E-mail já cadastrado.")
                                    edit_input_email.requestFocus()
                                    button_proxima_etapa_email.setEnabled(true)
                                    button_proxima_etapa_email.setBackgroundColor(
                                        ContextCompat.getColor(
                                            this@CadastroEmailActivity,
                                            R.color.colorPrimaryDark
                                        )
                                    )
                                }
                            }
                        }
                    } catch (e: Exception) {
                        uiThread {
                            edit_input_email.setError("Falha ao conectar-se com a internet.")
                            edit_input_email.requestFocus()
                            button_proxima_etapa_email.setEnabled(true)
                            button_proxima_etapa_email.setBackgroundColor(
                                ContextCompat.getColor(
                                    this@CadastroEmailActivity,
                                    R.color.colorPrimaryDark
                                )
                            )
                        }
                    }
                }
            }
        }
    }

    // Função para abrir a tela cadastro validação email
    private fun abrirCadastroValidacaoEmailActivity(emailCode: EmailCode) {
        val dataNascimento = intent.getStringExtra("FASTDRUGS_EXTRA_DATA_NASCIMENTO")
        val editInputEmail = findViewById<TextInputEditText>(R.id.edit_input_email)
        val email = editInputEmail.text.toString()
        val intent = Intent(this, CadastroValidacaoEmailActivity::class.java).apply {
            putExtra("FASTDRUGS_EXTRA_DATA_NASCIMENTO", dataNascimento)
            putExtra("FASTDRUGS_EXTRA_EMAIL", email)
            putExtra("FASTDRUGS_EMAIL_CODE", gson.toJson(emailCode))
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

    fun facebookLogin() {
        LoginManager.getInstance()
            .logInWithReadPermissions(this, listOf("public_profile", "email"))

        LoginManager.getInstance()
            .registerCallback(callbackManager, object: FacebookCallback<LoginResult> {
                override fun onSuccess(result: LoginResult?) {
                    handleFacebookAccessToken(result?.accessToken)
                }

                override fun onCancel() {
                    TODO("Not yet implemented")
                }

                override fun onError(error: FacebookException?) {
                    TODO("Not yet implemented")
                }
            })
    }

    fun handleFacebookAccessToken(token: AccessToken?) {
        val credential = FacebookAuthProvider.getCredential(token?.token!!)
        auth.signInWithCredential(credential)
            .addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    val email = auth.currentUser?.email
                    val name = auth.currentUser?.displayName
                    val uid = auth.currentUser?.uid

                    doAsync {
                        try {
                            val emailValidate = EmailCpfCelular()
                            emailValidate.email = email!!

                            val response =
                                http.post("/clientes/validate", gson.toJson(emailValidate))

                            if (response != null) {
                                if (response.contains("Nenhum utilizamento")) {
                                    uiThread {
                                        val intent = Intent(this@CadastroEmailActivity, CadastroCpfActivity::class.java).apply {
                                            putExtra("FASTDRUGS_EXTRA_DATA_NASCIMENTO", intent.getStringExtra("FASTDRUGS_EXTRA_DATA_NASCIMENTO"))
                                            putExtra("FASTDRUGS_EXTRA_EMAIL", email)
                                            putExtra("FASTDRUGS_EXTRA_NOME", name)
                                            putExtra("FASTDRUGS_EXTRA_SENHA", uid)
                                        }
                                        startActivity(intent)
                                        pgBar.visibility = View.GONE
                                    }
                                } else {
                                    uiThread {
                                        edit_input_email.text = SpannableStringBuilder(email)
                                        edit_input_email.setError("E-mail do facebook já cadastrado.")
                                        edit_input_email.requestFocus()
                                        button_proxima_etapa_email.setEnabled(true)
                                        button_proxima_etapa_email.setBackgroundColor(
                                            ContextCompat.getColor(
                                                this@CadastroEmailActivity,
                                                R.color.colorPrimaryDark
                                            )
                                        )
                                        pgBar.visibility = View.GONE
                                    }
                                }
                            }
                        } catch (e: Exception) {
                            uiThread {
                                edit_input_email.setError("Falha ao conectar-se com a internet.")
                                edit_input_email.requestFocus()
                                button_proxima_etapa_email.setEnabled(true)
                                button_proxima_etapa_email.setBackgroundColor(
                                    ContextCompat.getColor(
                                        this@CadastroEmailActivity,
                                        R.color.colorPrimaryDark
                                    )
                                )
                            }
                        }
                    }
                } else {
                    // Show the error message
                    Toast.makeText(this, task.exception?.message, Toast.LENGTH_LONG).show()
                }
            }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        callbackManager.onActivityResult(requestCode, resultCode, data)
    }
}
