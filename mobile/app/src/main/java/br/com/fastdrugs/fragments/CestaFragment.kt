package br.com.fastdrugs.fragments

import android.content.Intent
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import androidx.fragment.app.FragmentTransaction
import androidx.recyclerview.widget.LinearLayoutManager
import br.com.fastdrugs.DataSourceCestaDeCompras
import br.com.fastdrugs.ListaFarmaciaActivity
import br.com.fastdrugs.PedidoFinalizadoActivity
import br.com.fastdrugs.R
import br.com.fastdrugs.adapter.CestaDeComprasAdapter
import br.com.fastdrugs.http.HttpHelper
import br.com.fastdrugs.models.*
import br.com.fastdrugs.services.AuthSharedPreferences
import br.com.fastdrugs.services.CestaSharedPreferences
import com.bumptech.glide.Glide
import com.github.nkzawa.socketio.client.IO
import com.google.gson.Gson
import kotlinx.android.synthetic.main.activity_produto_selecionado.*
import kotlinx.android.synthetic.main.fragment_cesta.*
import kotlinx.android.synthetic.main.fragment_cesta.image_view_logo_farmacia
import kotlinx.android.synthetic.main.fragment_cesta.text_view_distancia
import kotlinx.android.synthetic.main.fragment_cesta.text_view_nome_farmacia
import kotlinx.android.synthetic.main.fragment_cesta.text_view_preco
import kotlinx.android.synthetic.main.fragment_cesta.view.*
import org.jetbrains.anko.doAsync
import org.jetbrains.anko.uiThread
import java.lang.Float
import java.text.DecimalFormat
import java.util.*
import kotlin.collections.ArrayList

/**
 * A simple [Fragment] subclass.
 */
class CestaFragment(val token: String, val id_cliente: Int) : Fragment() {

    private lateinit var cestaDeComprasAdapeter: CestaDeComprasAdapter
    private lateinit var cestaSharedPreferences: CestaSharedPreferences
    private lateinit var authSharedPreferences: AuthSharedPreferences

    private lateinit var farmacia: Farmacia
    private lateinit var produtos: List<Produto>
    private var valorTotal = 0.0

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        var view = View(context)

        if (activity != null && isAdded) {
            view = inflater.inflate(R.layout.fragment_cesta, container, false)

            view.loading_panel.visibility = View.VISIBLE
            view.error.visibility = View.GONE
            view.all.visibility = View.GONE

            cestaSharedPreferences = CestaSharedPreferences(this@CestaFragment.context!!)
            authSharedPreferences = AuthSharedPreferences(this@CestaFragment.context!!)

            if (cestaSharedPreferences.getProducts().isNotEmpty()) {
                doAsync {
                    produtos = cestaSharedPreferences.getProducts()
                    val gson = Gson()
                    val http = HttpHelper()

                    val response = http.get(
                        "/farmacias/${produtos[0].id_farmacia}/delivery/${authSharedPreferences.getAddressId()}",
                        token
                    )
                    farmacia = gson.fromJson(response, Farmacia::class.java)

                    val response2 = http.get(
                        "/clientes/$id_cliente/enderecos/${authSharedPreferences.getAddressId()}",
                        token
                    )
                    val endereco = gson.fromJson(response2, Endereco::class.java)

                    val response3 = http.get(
                        "/farmacias/${produtos[0].id_farmacia}/formasDePagamento",
                        token
                    )
                    val formasPagamento =
                        gson.fromJson(response3, Array<FormaPagamento>::class.java).toList()

                    uiThread {
                        // Toolbar Data
                        var frete = ""
                        if (farmacia.frete == 0.0)
                            frete = "Grátis"
                        else
                            frete = "R$ ${DecimalFormat("#.00").format(farmacia.frete)}"

                        if (!farmacia.url_imagem.isNullOrEmpty()) {
                            Glide.with(this@CestaFragment)
                                .load(farmacia.url_imagem)
                                .into(view.image_view_logo_farmacia)
                        }

                        view.text_view_nome_farmacia.text = farmacia.nome
                        view.text_view_distancia.text =
                            "${DecimalFormat("#.0").format(farmacia.distancia)} km"
                        view.text_view_preco.text = frete

                        var subtotal = 0.0
                        produtos.map { subtotal += it.preco * it.quantidade }

                        inicializarRecyclerView(view, produtos)

                        view.taxa_de_entrega_pedido_valor.text = frete
                        view.subtotal_pedido_valor.text =
                            "R$ ${DecimalFormat("#.00").format(subtotal)}"
                        view.total_pedido_valor.text =
                            "R$ ${DecimalFormat("#.00").format(subtotal + farmacia.frete)}"

                        valorTotal = subtotal + farmacia.frete

                        endereco_de_entrega.text =
                            "${endereco.logradouro}, ${endereco.numero} - ${endereco.bairro}"
                        cidade_estado_de_entrega.text = "${endereco.cidade} - ${endereco.estado}"

                        val formasPagamentoList = arrayListOf<String>()
                        formasPagamento.forEach {
                            formasPagamentoList.add("${it.tipo}")
                        }

                        ArrayAdapter<String>(
                            this@CestaFragment.context!!,
                            R.layout.simple_spinner_item,
                            formasPagamentoList
                        ).also { adapter ->
                            adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
                            spinner_formas_pagamento.adapter = adapter
                        }

                        view.loading_panel.visibility = View.GONE
                        view.error.visibility = View.GONE
                        view.all.visibility = View.VISIBLE
                    }
                }

                view.button_fazer_pedido.setOnClickListener {
                    val pedido = Pedido()
                    pedido.frete = farmacia.frete
                    pedido.forma_pagamento =
                        spinner_formas_pagamento.selectedItem.toString()
                    pedido.valor = valorTotal
                    pedido.produtos = ArrayList(produtos)

                    doAsync {
                        val gson = Gson()
                        val http = HttpHelper()

                        val requestBody = gson.toJson(pedido)
                        http.postPrivate(
                            "/pedidos/clientes/$id_cliente/farmacias/${produtos[0].id_farmacia}",
                            requestBody,
                            token
                        )

                        val socket = IO.socket(http.URL + "/pedidos")

                        socket.emit("newPedido", produtos[0].id_farmacia)
                        socket.connect()

                        uiThread {
                            val intentFinalizado = Intent(this@CestaFragment.context, PedidoFinalizadoActivity::class.java)

                            intentFinalizado.putExtra("id_cliente", id_cliente)
                            intentFinalizado.putExtra("token", token)

                            cestaSharedPreferences.clear()

                            startActivity(intentFinalizado)
                        }
                    }
                }

            } else {
                view.loading_panel.visibility = View.GONE
                view.all.visibility = View.GONE
                view.error.visibility = View.VISIBLE

                view.ver_farmacias_regiao.setOnClickListener {
                    (activity as ListaFarmaciaActivity).supportFragmentManager
                        .beginTransaction()
                        .replace(
                            R.id.frame_layout_lista_farmacia,
                            InicioFragment(token, id_cliente)
                        )
                        .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                        .commit()
                }
            }
        }

        return view
    }

    private fun inicializarRecyclerView(view: View, produtos: List<Produto>) {
        view.recycler_view_produtos_adicionados.layoutManager =
            LinearLayoutManager(this@CestaFragment.context)
        cestaDeComprasAdapeter = CestaDeComprasAdapter(
            this@CestaFragment.context!!,
            produtos
        )
        view.recycler_view_produtos_adicionados.adapter = cestaDeComprasAdapeter
    }
}
