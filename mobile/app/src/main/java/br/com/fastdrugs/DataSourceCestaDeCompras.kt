package br.com.fastdrugs

import br.com.fastdrugs.models.PedidoProduto
import java.util.ArrayList

class DataSourceCestaDeCompras{
    companion object{
        fun createDataset():ArrayList<PedidoProduto>{
            var lista = ArrayList<PedidoProduto>()

            lista.add(PedidoProduto(1, "Dipirona Sódica", 20.30, 1, 20.30 ))
            lista.add(PedidoProduto(1, "Dipirona Sódica", 20.30, 1, 20.30 ))
            lista.add(PedidoProduto(1, "Dipirona Sódica", 20.30, 1, 20.30 ))
            lista.add(PedidoProduto(1, "Dipirona Sódica", 20.30, 1, 20.30 ))

            lista.add(PedidoProduto(1, "Dipirona Sódica", 20.30, 1, 20.30 ))

            lista.add(PedidoProduto(1, "Dipirona Sódica", 20.30, 1, 20.30 ))

            lista.add(PedidoProduto(1, "Dipirona Sódica", 20.30, 1, 20.30 ))

            lista.add(PedidoProduto(1, "Dipirona Sódica", 20.30, 1, 20.30 ))

            lista.add(PedidoProduto(1, "Dipirona Sódica", 20.30, 1, 20.30 ))

            lista.add(PedidoProduto(1, "Dipirona Sódica", 20.30, 1, 20.30 ))


            return lista
        }
    }
}