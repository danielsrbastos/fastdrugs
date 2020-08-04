package br.com.fastdrugs.fragments

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.LinearLayoutManager

import br.com.fastdrugs.R
import br.com.fastdrugs.adapter.FarmaciaRecyclerAdapter
import br.com.fastdrugs.http.HttpHelper
import br.com.fastdrugs.models.Cliente
import br.com.fastdrugs.models.Farmacia
import br.com.fastdrugs.services.AuthSharedPreferences
import com.google.gson.Gson
import kotlinx.android.synthetic.main.activity_lista_farmacia.*
import kotlinx.android.synthetic.main.fragment_inicio.*
import kotlinx.android.synthetic.main.fragment_inicio.view.*
import org.jetbrains.anko.doAsync
import org.jetbrains.anko.uiThread

/**
 * A simple [Fragment] subclass.
 */
class InicioFragment(val token: String, val id_cliente: Int) : Fragment() {

    lateinit var farmaciaRecyclerAdapter: FarmaciaRecyclerAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        var view = View(context)

        if (activity != null && isAdded) {
            view = inflater.inflate(R.layout.fragment_inicio, container, false)
            inicializarRecyclerView(view)
        }

        return view
    }

    private fun inicializarRecyclerView(view: View) {
        val gson = Gson()

        doAsync {
            val http = HttpHelper()
            val response = http.get("/clientes/" + id_cliente, token!!)

            var responseCliente = Cliente()
            responseCliente = gson.fromJson(response, Cliente::class.java)

            val id_endereco = responseCliente.clienteEnderecos[0].id_endereco

            val authSharedPreferences = AuthSharedPreferences(this@InicioFragment.context!!)
            authSharedPreferences.setAddressId(id_endereco)

            val response2 = http.get("/farmacias/regiao/${id_endereco}", token)

            var listaFarmacias: List<Farmacia>

            listaFarmacias = gson.fromJson(response2, Array<Farmacia>::class.java).toList()
            listaFarmacias = listaFarmacias.filter { f -> f.status }

            uiThread {
                view.rvFarmacias.layoutManager = LinearLayoutManager(this@InicioFragment.context)
                farmaciaRecyclerAdapter =
                    FarmaciaRecyclerAdapter(this@InicioFragment.context!!, listaFarmacias, token, id_cliente)
                view.rvFarmacias.adapter = farmaciaRecyclerAdapter

                view.loading_panel.visibility = View.GONE

                val e = responseCliente.clienteEnderecos[0]
                view.text_endereco.text = "${e.logradouro}, ${e.numero} - ${e.cidade}"
            }
        }
    }
}
