package br.com.fastdrugs

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.recyclerview.widget.LinearLayoutManager
import br.com.fastdrugs.adapter.CestaDeComprasAdapter
import kotlinx.android.synthetic.main.activity_cesta_de_compras.*

class CestaDeComprasActivity : AppCompatActivity() {


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_cesta_de_compras)

    }
}
