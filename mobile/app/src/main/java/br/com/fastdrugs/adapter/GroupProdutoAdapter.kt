package br.com.fastdrugs.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import br.com.fastdrugs.R
import br.com.fastdrugs.models.Categoria
import br.com.fastdrugs.models.Farmacia

class GroupProdutoAdapter(private val context: Context,
                          private val dataList: List<Categoria>,
                          private val farmacia: String,
                          private val token: String,
                          private val id_cliente: Int):
    RecyclerView.Adapter<GroupProdutoAdapter.ViewHolder>() {

    inner class ViewHolder(view: View): RecyclerView.ViewHolder(view){
        var itemTitleCategoria: TextView
        var recyclerViewList: RecyclerView

        init {
            itemTitleCategoria = view.findViewById(R.id.item_title_categoria) as TextView
            recyclerViewList = view.findViewById(R.id.recycler_view_list) as RecyclerView
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(context).inflate(R.layout.layout_group_produtos, parent, false)
        return ViewHolder(view)
    }

    override fun getItemCount(): Int {
        return dataList.size
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.itemTitleCategoria.text = dataList[position].nome

        val items = dataList[position].listItem

        val itemProdutoAdaper = ItemProdutoAdapter(context, items, farmacia, token, id_cliente)

        holder.recyclerViewList.setHasFixedSize(true)
        holder.recyclerViewList.layoutManager = LinearLayoutManager(context, LinearLayoutManager.HORIZONTAL, false)
        holder.recyclerViewList.adapter = itemProdutoAdaper
        holder.recyclerViewList.isNestedScrollingEnabled = false
    }

}