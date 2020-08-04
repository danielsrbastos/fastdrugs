package br.com.fastdrugs.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import br.com.fastdrugs.R
import br.com.fastdrugs.`interface`.ItemClickListener
import br.com.fastdrugs.models.ImageProduto
import br.com.fastdrugs.models.PedidoProduto
import com.bumptech.glide.Glide
import kotlinx.android.synthetic.main.layout_lista_imagens.view.*
import kotlinx.android.synthetic.main.layout_produto_pedido.view.*
import java.util.ArrayList

class ProdutoImagensAdapter(var context: Context, var lista: List<ImageProduto>) : RecyclerView.Adapter<RecyclerView.ViewHolder>() {

    class ProdutoImagensViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val imageViewProduto = itemView.produto_selecionado_image

        fun bind(imgProduto: ImageProduto) {
            Glide.with(itemView.context)
                .load(imgProduto.url_imagem)
                .into(imageViewProduto)
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        val itemView = LayoutInflater
            .from(parent.context)
            .inflate(R.layout.layout_lista_imagens, parent, false)

        return ProdutoImagensViewHolder(itemView)
    }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        when (holder) {
            is ProdutoImagensViewHolder -> {
                holder.bind(lista[position])
            }
        }
    }

    override fun getItemCount(): Int {
        return lista.size
    }
}