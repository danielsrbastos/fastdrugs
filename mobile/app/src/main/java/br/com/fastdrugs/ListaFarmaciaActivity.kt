package br.com.fastdrugs

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentTransaction
import androidx.recyclerview.widget.LinearLayoutManager
import br.com.fastdrugs.adapter.FarmaciaRecyclerAdapter
import br.com.fastdrugs.fragments.CestaFragment
import br.com.fastdrugs.fragments.ContaFragment
import br.com.fastdrugs.fragments.InicioFragment
import br.com.fastdrugs.fragments.PedidosFragment
import br.com.fastdrugs.http.HttpHelper
import br.com.fastdrugs.models.Cliente
import br.com.fastdrugs.models.Farmacia
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.gson.Gson
import kotlinx.android.synthetic.main.activity_lista_farmacia.*
import org.jetbrains.anko.doAsync
import org.jetbrains.anko.uiThread

class ListaFarmaciaActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_lista_farmacia)

        val bottomNavigation: BottomNavigationView =
            findViewById(R.id.bottom_navigation_view_lista_farmacia)

        val token = intent.getStringExtra("token")
        val id_cliente = intent.getIntExtra("id_cliente", 0)

        var startFragment = Fragment()

        if (intent.getBooleanExtra("CESTA", false)) {
            startFragment = CestaFragment(token!!, id_cliente)
            bottomNavigation.selectedItemId = R.id.cesta
        }  else if (intent.getBooleanExtra("PEDIDOS", false)) {
            startFragment = PedidosFragment(token!!, id_cliente)
            bottomNavigation.selectedItemId = R.id.pedidos
        }  else {
            startFragment = InicioFragment(token!!, id_cliente)
            bottomNavigation.selectedItemId = R.id.inicio
        }

        supportFragmentManager
            .beginTransaction()
            .replace(R.id.frame_layout_lista_farmacia, startFragment)
            .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
            .commit()

        bottomNavigation.setOnNavigationItemReselectedListener {  }
        bottomNavigation.setOnNavigationItemSelectedListener { item ->
            var fragment = Fragment()

            when (item.itemId) {
                R.id.inicio -> {
                    fragment = InicioFragment(token, id_cliente)
                }

                R.id.cesta -> {
                    fragment = CestaFragment(token, id_cliente)
                }

                R.id.conta -> {
                    fragment = ContaFragment()
                }

                R.id.pedidos -> {
                    fragment = PedidosFragment(token, id_cliente)
                }
            }

            supportFragmentManager
                .beginTransaction()
                .replace(R.id.frame_layout_lista_farmacia, fragment)
                .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_OPEN)
                .commit()

            true
        }
    }
}
