package br.com.fastdrugs.fragments

import android.content.Intent
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import br.com.fastdrugs.PedidoFinalizadoActivity

import br.com.fastdrugs.R
import kotlinx.android.synthetic.main.fragment_conta.view.*

/**
 * A simple [Fragment] subclass.
 */
class ContaFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        var view = View(context)

        if (activity != null && isAdded) {
            view = inflater.inflate(R.layout.fragment_conta, container, false)

        }

        return view
    }
}
