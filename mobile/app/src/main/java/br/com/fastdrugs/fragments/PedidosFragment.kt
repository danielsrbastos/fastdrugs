package br.com.fastdrugs.fragments

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import br.com.fastdrugs.R
import br.com.fastdrugs.adapter.PedidosAdapter
import br.com.fastdrugs.http.HttpHelper
import br.com.fastdrugs.models.Pedido
import com.github.nkzawa.engineio.client.transports.WebSocket
import com.github.nkzawa.socketio.client.IO
import com.github.nkzawa.socketio.client.Socket
import com.google.gson.Gson
import kotlinx.android.synthetic.main.fragment_pedidos.view.*
import org.jetbrains.anko.doAsync
import org.jetbrains.anko.uiThread

/**
 * A simple [Fragment] subclass.
 */
class PedidosFragment(val token: String, val id_cliente: Int) : Fragment() {

    private val gson = Gson()

    private lateinit var http: HttpHelper
    private lateinit var pedidosAdapter: PedidosAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        var view = View(context)

        if (activity != null && isAdded) {
            view = inflater.inflate(R.layout.fragment_pedidos, container, false)

            http = HttpHelper()

            doAsync {
                val response = http.get("/pedidos/clientes/$id_cliente", token)
                val pedidos = gson.fromJson(response, Array<Pedido>::class.java).toList()

                uiThread {
                    view.recycler_view_pedidos.layoutManager = LinearLayoutManager(this@PedidosFragment.context)
                    pedidosAdapter = PedidosAdapter(this@PedidosFragment.context!!, pedidos)
                    view.recycler_view_pedidos.adapter = pedidosAdapter

                    view.loading_panel.visibility = View.GONE
                }
            }
        }

        return view
    }
}
