package br.com.fastdrugs

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.Handler
import com.bumptech.glide.Glide
import kotlinx.android.synthetic.main.activity_pedido_finalizado.*

class PedidoFinalizadoActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_pedido_finalizado)

        Glide.with(this).asGif().load(R.drawable.gif_hapy).into(gifImageView)

        Handler().postDelayed({
            val intentLista = Intent(this, ListaFarmaciaActivity::class.java)

            val token = intent.getStringExtra("token")!!
            val id_cliente = intent.getIntExtra("id_cliente", 0)

            intentLista.putExtra("token", token)
            intentLista.putExtra("id_cliente", id_cliente)
            intentLista.putExtra("PEDIDOS", true)

            startActivity(intentLista)
            finish()
        }, 3000L)
    }
}
