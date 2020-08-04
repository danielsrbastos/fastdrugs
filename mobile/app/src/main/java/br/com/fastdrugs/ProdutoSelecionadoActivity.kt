package br.com.fastdrugs

import android.content.Intent
import android.graphics.Color
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.MenuItem
import android.view.View
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.LinearLayoutManager
import br.com.fastdrugs.adapter.ProdutoImagensAdapter
import br.com.fastdrugs.http.HttpHelper
import br.com.fastdrugs.models.Farmacia
import br.com.fastdrugs.models.Produto
import br.com.fastdrugs.services.CestaSharedPreferences
import com.bumptech.glide.Glide
import com.google.gson.Gson
import kotlinx.android.synthetic.main.activity_cesta_de_compras.*
import kotlinx.android.synthetic.main.activity_farmacia_selecionada.*
import kotlinx.android.synthetic.main.activity_produto_selecionado.*
import kotlinx.android.synthetic.main.activity_produto_selecionado.image_view_logo_farmacia
import kotlinx.android.synthetic.main.activity_produto_selecionado.text_view_distancia
import kotlinx.android.synthetic.main.activity_produto_selecionado.text_view_nome_farmacia
import kotlinx.android.synthetic.main.activity_produto_selecionado.text_view_preco
import kotlinx.android.synthetic.main.activity_produto_selecionado.toolbar_farmacia_selecionada
import java.text.DecimalFormat

class ProdutoSelecionadoActivity : AppCompatActivity() {

    private lateinit var farmaciaJson: String
    private lateinit var token: String
    private lateinit var produto: Produto

    private var id_cliente = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_produto_selecionado)

        setSupportActionBar(toolbar_farmacia_selecionada)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        val gson = Gson()

        farmaciaJson = intent.getStringExtra("FARMACIA")!!
        token = intent.getStringExtra("TOKEN")!!
        id_cliente = intent.getIntExtra("ID_CLIENTE", 0)
        produto = gson.fromJson(intent.getStringExtra("PRODUTO"), Produto::class.java)

        val farmacia = gson.fromJson(farmaciaJson, Farmacia::class.java)

        // Toolbar Data
        var frete = ""
        if (farmacia.frete == 0.0)
            frete = "Grátis"
        else
            frete = "R$ ${DecimalFormat("#.00").format(farmacia.frete)}"

        if (!farmacia.url_imagem.isNullOrEmpty()) {
            Glide.with(this)
                .load(farmacia.url_imagem)
                .into(image_view_logo_farmacia)
        }

        text_view_nome_farmacia.text = farmacia.nome
        text_view_distancia.text = "${DecimalFormat("#.0").format(farmacia.distancia)} km"
        text_view_preco.text = frete

        text_view_produto.text = produto.nome
        text_view_descricao.text = produto.descricao

        recycler_view_imagens.setHasFixedSize(true)
        recycler_view_imagens.layoutManager = LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false)
        recycler_view_imagens.adapter = ProdutoImagensAdapter(this, produto.ImagemProduto.toList())
        recycler_view_imagens.isNestedScrollingEnabled = false

        button_adicionar_a_cesta.setOnClickListener {
            adicionarACesta()
        }
    }

    fun adicionarACesta(){
        text_produto_adicionado.text = ""
        text_produto_adicionado.setTextColor(Color.parseColor("#155724"))
        produto_adicionado.background = ContextCompat.getDrawable(this, R.drawable.produto_adicionado)
        produto_adicionado.visibility = View.GONE
        button_cesta_compras.visibility = View.GONE
        buttons_adicionar_produto.visibility = View.GONE

        val cestaSharedPreferences = CestaSharedPreferences(this)

        produto.quantidade = Integer.parseInt(edit_input_quantidade.text.toString())

        if (cestaSharedPreferences.addProduct(produto)) {
            text_produto_adicionado.text = "Foi adicionado ${edit_input_quantidade.text.toString()} unidade(s) de ${produto.nome} à cesta de compras."
            button_cesta_compras.visibility = View.VISIBLE
            produto_adicionado.visibility = View.VISIBLE
        } else {
            text_produto_adicionado.text = "Não é possível adicionar produtos de farmácias diferentes na cesta, gostaria de limpá-lo e adicionar o seguinte produto?"
            text_produto_adicionado.setTextColor(Color.parseColor("#721c24"))
            buttons_adicionar_produto.visibility = View.VISIBLE
            produto_adicionado.background = ContextCompat.getDrawable(this, R.drawable.produto_nao_adicionado)
            produto_adicionado.visibility = View.VISIBLE
        }

        button_adicionar_produto.setOnClickListener {
            cestaSharedPreferences.clear()
            cestaSharedPreferences.addProduct(produto)

            text_produto_adicionado.text = "Foi adicionado ${produto.quantidade} unidade(s) de ${produto.nome} à cesta de compras."
            text_produto_adicionado.setTextColor(Color.parseColor("#155724"))
            produto_adicionado.background = ContextCompat.getDrawable(this, R.drawable.produto_adicionado)
            button_cesta_compras.visibility = View.VISIBLE
            produto_adicionado.visibility = View.VISIBLE
            buttons_adicionar_produto.visibility = View.GONE

        }

        button_nao_adicionar_produto.setOnClickListener {
            produto_adicionado.visibility = View.GONE
        }

        button_cesta_compras.setOnClickListener {
            val intent = Intent(this, ListaFarmaciaActivity::class.java)

            intent.putExtra("CESTA", true)
            intent.putExtra("token", token)
            intent.putExtra("id_cliente", id_cliente)
            intent.putExtra("FARMACIA", farmaciaJson)

            startActivity(intent)
        }
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            android.R.id.home -> {
                val intent = Intent(this, FarmaciaSelecionadaActivity::class.java)

                intent.putExtra("FARMACIA", farmaciaJson)
                intent.putExtra("TOKEN", token)
                intent.putExtra("ID_CLIENTE", id_cliente)

                startActivity(intent)
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }
}
