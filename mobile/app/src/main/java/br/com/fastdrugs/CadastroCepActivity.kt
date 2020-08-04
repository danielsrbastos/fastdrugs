package br.com.fastdrugs

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Address
import android.location.Geocoder
import android.os.Bundle
import android.os.Looper
import android.text.SpannableStringBuilder
import android.view.MenuItem
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import br.com.fastdrugs.http.HttpHelper
import br.com.fastdrugs.models.CepDados
import br.com.fastdrugs.validacoes.Mascara
import br.com.fastdrugs.validacoes.ValidarCampos
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.LocationServices
import com.google.android.material.textfield.TextInputEditText
import com.google.gson.Gson
import kotlinx.android.synthetic.main.activity_cadastro_cep.*
import org.jetbrains.anko.doAsync
import org.jetbrains.anko.uiThread
import java.io.IOException
import java.util.*


class CadastroCepActivity : AppCompatActivity() {

    private val REQUEST_CODE_LOCATION_PERMISSION = 1

    private val gson = Gson()
    private val http = HttpHelper()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_cadastro_cep)

        setSupportActionBar(toolbar_passo)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.setDisplayShowTitleEnabled(false)

        pgBar.visibility = View.GONE

        useMinhaLocalizacao.setOnClickListener {
            if (ContextCompat.checkSelfPermission(applicationContext, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this, Array(1) { Manifest.permission.ACCESS_FINE_LOCATION }, REQUEST_CODE_LOCATION_PERMISSION)
            } else {
                getCurrentLocation()
            }
        }

        edit_input_cep.addTextChangedListener(Mascara.mascara("#####-###", edit_input_cep))

        // Botão próxima etapa - Ir para a tela cadastro de endereço
        button_proxima_etapa_cep.setOnClickListener {

            if (ValidarCampos.validarCampos(edit_input_cep, "Informe um CEP válido.")) {
                if (edit_input_cep.text.toString().length != 9) {
                    edit_input_cep.setError("Informe um CEP válido.")
                    edit_input_cep.requestFocus()
                } else {
                    button_proxima_etapa_cep.setEnabled(false)
                    button_proxima_etapa_cep.setBackgroundColor(
                        ContextCompat.getColor(
                            this@CadastroCepActivity,
                            R.color.colorButtonPressed
                        )
                    )

                    doAsync {
                        try {
                            val response = http.getExternal(
                                "https://viacep.com.br/ws/${edit_input_cep.text.toString()
                                    .replace("-", "")}/json/"
                            )

                            if (response != null) {
                                if (response.contains("\"erro\": true")) {
                                    uiThread {
                                        edit_input_cep.setError("Informe um CEP válido.")
                                        edit_input_cep.requestFocus()
                                        button_proxima_etapa_cep.setEnabled(true)
                                        button_proxima_etapa_cep.setBackgroundColor(
                                            ContextCompat.getColor(
                                                this@CadastroCepActivity,
                                                R.color.colorPrimaryDark
                                            )
                                        )
                                    }
                                } else {
                                    var cepDados = CepDados()
                                    cepDados = gson.fromJson(response, CepDados::class.java)

                                    uiThread {
                                        button_proxima_etapa_cep.setEnabled(true)
                                        button_proxima_etapa_cep.setBackgroundColor(
                                            ContextCompat.getColor(
                                                this@CadastroCepActivity,
                                                R.color.colorPrimaryDark
                                            )
                                        )
                                    }

                                    abrirCadastroCepEnderecoActivity(cepDados)
                                }
                            }
                        } catch (e: Exception) {
                            uiThread {
                                edit_input_cep.setError("Falha ao conectar-se com a internet.")
                                edit_input_cep.requestFocus()
                                button_proxima_etapa_cep.setEnabled(true)
                                button_proxima_etapa_cep.setBackgroundColor(
                                    ContextCompat.getColor(
                                        this@CadastroCepActivity,
                                        R.color.colorPrimaryDark
                                    )
                                )
                            }
                        }
                    }
                }
            }
        }
    }

    // Função para abrir a tela cadastro endereço
    private fun abrirCadastroCepEnderecoActivity(cepDados: CepDados) {
        val dataNascimento = intent.getStringExtra("FASTDRUGS_EXTRA_DATA_NASCIMENTO")
        val email = intent.getStringExtra("FASTDRUGS_EXTRA_EMAIL")
        val codigoValidaEmail = intent.getStringExtra("FASTDRUGS_EXTRA_CODIGO_VALIDA_EMAIL")
        val nome = intent.getStringExtra("FASTDRUGS_EXTRA_NOME")
        val cpf = intent.getStringExtra("FASTDRUGS_EXTRA_CPF")
        val celular = intent.getStringExtra("FASTDRUGS_EXTRA_CELULAR")
        val cep = findViewById<TextInputEditText>(R.id.edit_input_cep).text.toString()

        var senha = ""
        if (intent.getStringExtra("FASTDRUGS_EXTRA_SENHA") != null) {
            senha = intent.getStringExtra("FASTDRUGS_EXTRA_SENHA")!!
        }

        val intent = Intent(this, CadastroCepEnderecoActivity::class.java).apply {
            putExtra("FASTDRUGS_EXTRA_DATA_NASCIMENTO", dataNascimento)
            putExtra("FASTDRUGS_EXTRA_EMAIL", email)
            putExtra("FASTDRUGS_EXTRA_CODIGO_VALIDA_EMAIL", codigoValidaEmail)
            putExtra("FASTDRUGS_EXTRA_NOME", nome)
            putExtra("FASTDRUGS_EXTRA_CPF", cpf)
            putExtra("FASTDRUGS_EXTRA_CELULAR", celular)
            putExtra("FASTDRUGS_EXTRA_CEP", cep)
            putExtra("FASTDRUGS_EXTRA_LOGRADOURO", cepDados.logradouro)
            putExtra("FASTDRUGS_EXTRA_BAIRRO", cepDados.bairro)
            putExtra("FASTDRUGS_EXTRA_CIDADE", cepDados.localidade)
            putExtra("FASTDRUGS_EXTRA_ESTADO", cepDados.uf)
            putExtra("FASTDRUGS_EXTRA_SENHA", senha)
        }

        startActivity(intent)
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)

        if (requestCode == REQUEST_CODE_LOCATION_PERMISSION && grantResults.isNotEmpty()) {
            if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                getCurrentLocation()
            } else {
                Toast.makeText(this, "Permission denied", Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun getCurrentLocation() {

        pgBar.visibility = View.VISIBLE

        val locationRequest = LocationRequest()
        locationRequest.interval = 10000
        locationRequest.fastestInterval = 3000
        locationRequest.priority = LocationRequest.PRIORITY_HIGH_ACCURACY

        LocationServices.getFusedLocationProviderClient(this)
            .requestLocationUpdates(locationRequest, object: LocationCallback() {
                override fun onLocationResult(locationResult: LocationResult?) {
                    super.onLocationResult(locationResult)

                    LocationServices.getFusedLocationProviderClient(this@CadastroCepActivity)
                        .removeLocationUpdates(this)

                    if (locationResult != null && locationResult.locations.size > 0) {
                        val latestLocationIndex = locationResult.locations.size - 1

                        val latitude = locationResult.locations[latestLocationIndex].latitude
                        val longitude = locationResult.locations[latestLocationIndex].longitude

                        doAsync {
                            val address = getAddress(latitude, longitude)

                            if (address != null) {
                                uiThread {
                                    edit_input_cep.text = SpannableStringBuilder(address.postalCode.substring(0, 5))
                                    edit_input_cep.text = SpannableStringBuilder(edit_input_cep.text.toString() + address.postalCode.substring(6, 9))

                                    button_proxima_etapa_cep.callOnClick()
                                }
                            }
                        }
                    }

                    pgBar.visibility = View.GONE
                }
            }, Looper.getMainLooper())
    }

    private fun getAddress(latitude: Double, longitude: Double): Address? {
        val geocoder = Geocoder(this, Locale.getDefault())

        return try {
            geocoder.getFromLocation(latitude, longitude, 1)[0]
        } catch (e: IOException) {
            Address(Locale.getDefault())
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
