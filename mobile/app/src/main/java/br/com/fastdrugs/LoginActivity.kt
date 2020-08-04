package br.com.fastdrugs

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.text.SpannableStringBuilder
import android.view.View
import android.widget.Toast
import androidx.core.content.ContextCompat
import br.com.fastdrugs.http.HttpHelper
import br.com.fastdrugs.models.LoginCliente
import br.com.fastdrugs.services.AuthSharedPreferences
import br.com.fastdrugs.services.CestaSharedPreferences
import br.com.fastdrugs.validacoes.ValidaEmail
import br.com.fastdrugs.validacoes.ValidarCampos
import com.facebook.AccessToken
import com.facebook.CallbackManager
import com.facebook.FacebookCallback
import com.facebook.FacebookException
import com.facebook.login.LoginManager
import com.facebook.login.LoginResult
import com.google.firebase.auth.FacebookAuthProvider
import com.google.firebase.auth.FirebaseAuth
import com.google.gson.Gson
import kotlinx.android.synthetic.main.activity_cadastro_senha.*
import kotlinx.android.synthetic.main.activity_login.*
import org.jetbrains.anko.doAsync
import org.jetbrains.anko.uiThread
import java.lang.Exception

class LoginActivity : AppCompatActivity() {

    private lateinit var callbackManager: CallbackManager
    private lateinit var auth: FirebaseAuth

    val gson = Gson()
    val http = HttpHelper()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        auth = FirebaseAuth.getInstance()
        callbackManager = CallbackManager.Factory.create()

        button_entrar_facebook_login.setOnClickListener {
            facebookLogin()
        }

        // Link cadastra-se - Ir para a primeira tela de cadastro(cadastro da data de nascimento)
        text_cadastrar_login.setOnClickListener {
            val intent = Intent(this@LoginActivity, CadastroNascimentoActivity::class.java)
            startActivity(intent)
        }

        button_entrar_login.setOnClickListener {
            if (ValidaEmail.validarEmail(edit_input_email_login) && ValidarCampos.validarCampos(
                    edit_input_senha_login,
                    "Informe uma senha válida."
                )
            ) {
                text_login_senha_invalido.setVisibility(View.INVISIBLE)
                text_login_senha_invalido.setText("Login e/ou senha inválidos.")
                button_entrar_login.setEnabled(false)
                button_entrar_login.setBackgroundColor(
                    ContextCompat.getColor(
                        this@LoginActivity,
                        R.color.colorButtonWhitePressed
                    )
                )

                doAsync {
                    try {
                        val loginCliente = LoginCliente()
                        loginCliente.email = edit_input_email_login.text.toString()
                        loginCliente.senha = edit_input_senha_login.text.toString()

                        val response = http.post("/clientes/auth", gson.toJson(loginCliente))

                        var responseLoginCliente = LoginCliente()
                        responseLoginCliente = gson.fromJson(response, LoginCliente::class.java)

                        println("********************* ${responseLoginCliente}")

                        if (response != null) {
                            if (response.contains("error")) {
                                uiThread {
                                    text_login_senha_invalido.setVisibility(View.VISIBLE)
                                    button_entrar_login.setEnabled(true)
                                    button_entrar_login.setBackgroundColor(
                                        ContextCompat.getColor(
                                            this@LoginActivity,
                                            R.color.colorWhite
                                        )
                                    )
                                }
                            } else if (response.contains("token")) {
                                uiThread {
                                    text_login_senha_invalido.setVisibility(View.INVISIBLE)
                                    button_entrar_login.setEnabled(true)
                                    button_entrar_login.setBackgroundColor(
                                        ContextCompat.getColor(
                                            this@LoginActivity,
                                            R.color.colorWhite
                                        )
                                    )

                                    val intent = Intent(
                                        this@LoginActivity,
                                        ListaFarmaciaActivity::class.java
                                    )
                                    intent.putExtra("token", responseLoginCliente.token)
                                    intent.putExtra("id_cliente", responseLoginCliente.client.id)

                                    edit_input_email_login.text = SpannableStringBuilder("")
                                    edit_input_senha_login.text = SpannableStringBuilder("")

                                    val cestaSharedPreferences = CestaSharedPreferences(this@LoginActivity)
                                    cestaSharedPreferences.clear()

                                    startActivity(intent)
                                    //Toast.makeText(this@LoginActivity, responseLoginCliente.token, Toast.LENGTH_LONG).show()
                                }
                            }
                        }
                    } catch (e: Exception) {
                        uiThread {
                            text_login_senha_invalido.setVisibility(View.VISIBLE)
                            text_login_senha_invalido.setText("Falha ao conectar-se com a internet.")
                            button_entrar_login.setEnabled(true)
                            button_entrar_login.setBackgroundColor(
                                ContextCompat.getColor(
                                    this@LoginActivity,
                                    R.color.colorWhite
                                )
                            )
                        }
                    }
                }
            }
        }

        if (intent.getStringExtra("FASTDRUGS_EXTRA_EMAIL") != null) {
            val email = intent.getStringExtra("FASTDRUGS_EXTRA_EMAIL")
            val senha = intent.getStringExtra("FASTDRUGS_EXTRA_SENHA")

            edit_input_email_login.text = SpannableStringBuilder(email)
            edit_input_senha_login.text = SpannableStringBuilder(senha)

            button_entrar_login.callOnClick()
        }
    }

    override fun onBackPressed() {
        val intent = Intent(this@LoginActivity, Home::class.java)
        startActivity(intent)
    }

    fun facebookLogin() {
        LoginManager.getInstance()
            .logInWithReadPermissions(this, listOf("public_profile", "email"))

        LoginManager.getInstance()
            .registerCallback(callbackManager, object : FacebookCallback<LoginResult> {
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
                    val uid = auth.currentUser?.uid

                    edit_input_email_login.text = SpannableStringBuilder(email)
                    edit_input_senha_login.text = SpannableStringBuilder(uid)
                    button_entrar_login.callOnClick()
                } else {
                    Toast.makeText(this, task.exception?.message, Toast.LENGTH_LONG).show()
                }
            }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        callbackManager.onActivityResult(requestCode, resultCode, data)
    }
}
