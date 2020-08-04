package br.com.fastdrugs.adapter

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import br.com.fastdrugs.ProdutoSelecionadoActivity
import br.com.fastdrugs.R
import br.com.fastdrugs.`interface`.ItemClickListener
import br.com.fastdrugs.models.Farmacia
import br.com.fastdrugs.models.Produto
import com.bumptech.glide.Glide
import com.bumptech.glide.request.RequestOptions
import com.google.gson.Gson
import java.lang.IndexOutOfBoundsException
import java.text.DecimalFormat

class ItemProdutoAdapter(private val context: Context,
                         private val itemList: List<Produto>?,
                         private val farmacia: String,
                         private val token: String,
                         private val id_cliente: Int):
    RecyclerView.Adapter<ItemProdutoAdapter.ViewHolder>(){

    private val gson = Gson()

    inner class ViewHolder(view: View): RecyclerView.ViewHolder(view), View.OnClickListener{

        var txtTitulo: TextView
        var imagemProduto: ImageView
        var txtPreco: TextView

        lateinit var itemClickListener: ItemClickListener
        fun setClick(itemClickListener: ItemClickListener) {
            this.itemClickListener = itemClickListener
        }

        override fun onClick(view: View?) {
            itemClickListener.onItemCLickListener(view!!, adapterPosition)
        }

        init {
            txtTitulo = view.findViewById(R.id.item_title_produto) as TextView
            imagemProduto = view.findViewById(R.id.item_imagem) as ImageView
            txtPreco = view.findViewById(R.id.item_preco_produto) as TextView
            view.setOnClickListener(this)
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(context).inflate(R.layout.layout_item_produto, parent, false)
        return ViewHolder(view)
    }

    override fun getItemCount(): Int {
        return itemList?.size ?: 0
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.txtTitulo.text = itemList!![position].nome
        holder.txtPreco.text = "R$ ${DecimalFormat("#.00").format(itemList[position].preco)}"

        try {
            if (!itemList[position].ImagemProduto[0].url_imagem.isNullOrEmpty()) {
                Glide.with(context)
                    .load(itemList[position].ImagemProduto[0].url_imagem)
                    .into(holder.imagemProduto)
            }
        } catch (e: IndexOutOfBoundsException) {
            Glide.with(context)
                .load("https://storage.googleapis.com/fastdrugs-4cdfa.appspot.com/ProdutoDefault.png")
                .into(holder.imagemProduto)
        }

        holder.setClick(object: ItemClickListener {
            override fun onItemCLickListener(view: View, position: Int) {
                val intent = Intent(context, ProdutoSelecionadoActivity::class.java)

                intent.putExtra("FARMACIA", farmacia)
                intent.putExtra("TOKEN", token)
                intent.putExtra("PRODUTO", gson.toJson(itemList[position]))
                intent.putExtra("ID_CLIENTE", id_cliente)

                context.startActivity(intent)
            }
        })
    }
}