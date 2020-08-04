package br.com.fastdrugs.adapter

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.graphics.Color
import android.os.Build
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.annotation.RequiresApi
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.recyclerview.widget.RecyclerView
import br.com.fastdrugs.R
import br.com.fastdrugs.http.HttpHelper
import br.com.fastdrugs.models.ImageProduto
import br.com.fastdrugs.models.Pedido
import br.com.fastdrugs.models.PedidoProduto
import com.bumptech.glide.Glide
import com.github.nkzawa.emitter.Emitter
import com.github.nkzawa.engineio.client.transports.WebSocket
import com.github.nkzawa.socketio.client.IO
import com.github.nkzawa.socketio.client.Socket
import com.google.gson.Gson
import kotlinx.android.synthetic.main.layout_lista_imagens.view.*
import kotlinx.android.synthetic.main.layout_lista_pedido.view.*
import kotlinx.android.synthetic.main.layout_produto_pedido.view.*
import org.jetbrains.anko.doAsync
import org.jetbrains.anko.uiThread
import java.lang.IndexOutOfBoundsException
import java.text.DecimalFormat
import java.text.SimpleDateFormat
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.*

class PedidosAdapter(var context: Context, var lista: List<Pedido>) :
    RecyclerView.Adapter<RecyclerView.ViewHolder>() {

    class PedidoViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val textViewFarmacia = itemView.text_view_farmacia
        val imageViewFarmacia = itemView.image_view_farmacia
        val textViewStatus = itemView.text_view_status
        val textViewData = itemView.text_view_data

        private lateinit var notificationManager: NotificationManager
        private lateinit var notificationChannel: NotificationChannel
        private lateinit var builder: Notification.Builder
        private val channelId = " br.com.fastdrugs.adapter"

        fun statusFormat(statusPedido: String, textViewStatus: TextView): String {
            var status = ""

            if (statusPedido == "analise") {
                textViewStatus.setTextColor(Color.parseColor("#cc3535"))
                status = "Aguardando confirmação"
            } else if (statusPedido == "confirmado") {
                textViewStatus.setTextColor(Color.parseColor("#28a745"))
                status = "Separando os produtos"
            } else if (statusPedido == "caminho") {
                textViewStatus.setTextColor(Color.parseColor("#ffc107"))
                status = "Em transporte"
            } else if (statusPedido == "finalizado") {
                textViewStatus.setTextColor(Color.parseColor("#05b52e"))
                status = "Finalizado"
            } else if (statusPedido == "cancelado") {
                textViewStatus.setTextColor(Color.parseColor("#7a7a7a"))
                status = "Cancelado"
            }

            return status
        }

        fun notificationFormat(pedido: Pedido): String {
            var text = ""

            if (pedido.status == "analise")
                text =
                    "O seu pedido na ${pedido.nomeFarmacia} está em análise!"
            else if (pedido.status == "confirmado")
                text =
                    "O seu pedido na ${pedido.nomeFarmacia} já está sendo preparado!"
            else if (pedido.status == "caminho")
                text =
                    "O seu pedido na ${pedido.nomeFarmacia} já saiu para entrega!"
            else if (pedido.status == "finalizado")
                text =
                    "O seu pedido na ${pedido.nomeFarmacia} foi finalizado!"
            else if (pedido.status == "cancelado")
                text =
                    "O seu pedido na ${pedido.nomeFarmacia} foi cancelado!"

            return text
        }

        fun bind(pedido: Pedido) {
            val isoDateFormat =
                SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX", Locale.getDefault())
            val date = isoDateFormat.parse(pedido.createdAt)!!

            val x = date.toString().split(" ")
            val c = Calendar.getInstance()
            c.time = date

            try {
                textViewFarmacia.text = pedido.produtosPedidos[0].produtosFarmacia.nome
            } catch (e: IndexOutOfBoundsException) {}
            textViewStatus.text = statusFormat(pedido.status, textViewStatus)
            textViewData.text =
                "${DecimalFormat("00").format(c.get(Calendar.DAY_OF_MONTH) + 1)}/${DecimalFormat("00").format(
                    c.get(Calendar.MONTH) + 1
                )}/${DecimalFormat("0000").format(c.get(Calendar.YEAR))} às ${x[3].substring(0, 5)}"

            try {
                if (pedido.produtosPedidos[0].produtosFarmacia.url_imagem.isNotEmpty()) {
                    Glide.with(itemView.context)
                        .load(pedido.produtosPedidos[0].produtosFarmacia.url_imagem)
                        .into(imageViewFarmacia)
                }
            } catch (e: IndexOutOfBoundsException) {}


            doAsync {
                val http = HttpHelper()
                val socket = IO.socket(http.URL + "/pedidos")

                socket.on("pedidoStatus-${pedido.id_pedido}") { parameters ->
                    val pedidoSocket = Gson().fromJson(parameters[0].toString(), Pedido::class.java)

                    uiThread {
                        textViewStatus.text = statusFormat(pedidoSocket.status, textViewStatus)

                        notificationManager = itemView.context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                            notificationChannel = NotificationChannel(channelId, notificationFormat(pedidoSocket), NotificationManager.IMPORTANCE_HIGH)
                            notificationManager.createNotificationChannel(notificationChannel)

                            builder = Notification.Builder(itemView.context, channelId)
                                .setContentTitle("Fast Drugs")
                                .setContentText(notificationFormat(pedidoSocket))
                                .setSmallIcon(R.drawable.fastdrugs_splash)
                        } else {
                            builder = Notification.Builder(itemView.context)
                                .setContentTitle("Fast Drugs")
                                .setContentText(notificationFormat(pedidoSocket))
                                .setSmallIcon(R.drawable.fastdrugs_splash)
                        }

                        notificationManager.notify(1234, builder.build())
                    }
                }

                socket.connect()
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        val itemView = LayoutInflater
            .from(parent.context)
            .inflate(R.layout.layout_lista_pedido, parent, false)

        return PedidoViewHolder(itemView)
    }


    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        when (holder) {
            is PedidoViewHolder -> {
                holder.bind(lista[position])
            }
        }
    }

    override fun getItemCount(): Int {
        return lista.size
    }
}