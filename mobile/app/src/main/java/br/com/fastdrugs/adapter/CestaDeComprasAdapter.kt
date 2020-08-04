package br.com.fastdrugs.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import br.com.fastdrugs.R
import br.com.fastdrugs.models.Produto
import kotlinx.android.synthetic.main.layout_produto_pedido.view.*
import java.lang.Float
import java.text.DecimalFormat
import java.util.ArrayList

class CestaDeComprasAdapter(var context: Context, var lista:List<Produto>):
    RecyclerView.Adapter<RecyclerView.ViewHolder>() {

    class CestaDeComprasViewHolder(itemView: View):RecyclerView.ViewHolder(itemView){
        val txtProdutoPedido = itemView.txt_produto_pedido
        val txtPrecoProdutoUnidade = itemView.txt_preco_produto_unidade
        val txtTotalProdutoPedido = itemView.txt_total_produto_pedido

        fun bind(produto: Produto){
            txtProdutoPedido.text = "${produto.quantidade}x ${produto.nome}"
            txtPrecoProdutoUnidade.text = "R$ ${DecimalFormat("#.00").format(produto.preco)} a unidade"
            txtTotalProdutoPedido.text = "Total: R$ ${DecimalFormat("#.00").format(produto.quantidade * produto.preco)}"
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        val itemView = LayoutInflater
            .from(parent.context)
            .inflate(R.layout.layout_produto_pedido, parent, false)

        return CestaDeComprasViewHolder(itemView)
    }


    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        when(holder){
            is CestaDeComprasViewHolder ->{
                holder.bind(lista[position])
            }
        }
    }

    override fun getItemCount(): Int {
        return lista.size
    }
}