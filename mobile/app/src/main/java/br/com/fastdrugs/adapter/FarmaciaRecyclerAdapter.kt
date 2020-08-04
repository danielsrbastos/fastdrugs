package br.com.fastdrugs.adapter

import android.content.Context
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import br.com.fastdrugs.FarmaciaSelecionadaActivity
import br.com.fastdrugs.R
import br.com.fastdrugs.`interface`.ItemClickListener
import br.com.fastdrugs.http.HttpHelper
import br.com.fastdrugs.models.Farmacia
import com.bumptech.glide.Glide
import com.bumptech.glide.request.RequestOptions
import com.google.gson.Gson
import kotlinx.android.synthetic.main.layout_lista_farmacia.view.*
import java.text.DecimalFormat

class FarmaciaRecyclerAdapter(var context: Context, var lista: List<Farmacia>, val token: String, val id_cliente: Int) :
    RecyclerView.Adapter<RecyclerView.ViewHolder>() {

    class FarmaciaViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView),
        View.OnClickListener {

        val txtNome = itemView.txt_nome_farmacia_lista
        val txtAvaliacao = itemView.txt_avaliacao_farmacia_lista
        val txtTempo = itemView.txt_tempo_farmacia_lista
        val txtPreco = itemView.txt_preco_farmacia_lista
        val txtDistancia = itemView.txt_distancia_farmacia_lista
        var imgFarmacia = itemView.image_view_farmacia
        lateinit var itemClickListener: ItemClickListener

        fun setClick(itemClickListener: ItemClickListener) {
            this.itemClickListener = itemClickListener
        }

        init {
            itemView.setOnClickListener(this)
        }

        fun bind(farmacia: Farmacia) {
            var frete = ""
            if (farmacia.frete == 0.0)
                frete = "Grátis"
            else
                frete = "R$ ${DecimalFormat("#.00").format(farmacia.frete)}"

            txtNome.text = farmacia.nome
            txtAvaliacao.text = farmacia.avaliacao.toString()
            txtTempo.text = farmacia.tempo
            txtPreco.text = frete
            txtDistancia.text = "${DecimalFormat("#.0").format(farmacia.distancia)} km"

            if (!farmacia.url_imagem.isNullOrEmpty()) {
                val requestOptions = RequestOptions()
//                    .placeholder(R.drawable.ic_person_light)
//                    .error(R.drawable.ic_sentiment)

                Glide.with(itemView.context)
                    .applyDefaultRequestOptions(requestOptions)
                    .load(farmacia.url_imagem)
                    .into(imgFarmacia)
            }
        }

        override fun onClick(v: View?) {
            if (v != null) {
                itemClickListener.onItemCLickListener(v, adapterPosition)
            }
        }

    }


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        val itemView = LayoutInflater
            .from(parent.context)
            .inflate(R.layout.layout_lista_farmacia, parent, false)

        return FarmaciaViewHolder(itemView)
    }

    override fun getItemCount(): Int {
        return lista.size
    }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        when (holder) {
            is FarmaciaViewHolder -> {
                holder.bind(lista[position])
                holder.setClick(object : ItemClickListener {
                    override fun onItemCLickListener(view: View, position: Int) {
                        val gson = Gson()

                        val farmaciaSelecionada = Intent(context, FarmaciaSelecionadaActivity::class.java)
                        farmaciaSelecionada.putExtra("FARMACIA", gson.toJson(lista[position]))
                        farmaciaSelecionada.putExtra("TOKEN", token)
                        farmaciaSelecionada.putExtra("ID_CLIENTE", id_cliente)

                        context.startActivity(farmaciaSelecionada)
                    }
                })
            }
        }
    }


}