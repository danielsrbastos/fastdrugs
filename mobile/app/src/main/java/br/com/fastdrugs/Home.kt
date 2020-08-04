package br.com.fastdrugs

import android.Manifest
import android.annotation.SuppressLint
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.annotation.RequiresApi
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.view.setPadding
import androidx.viewpager.widget.PagerAdapter
import androidx.viewpager.widget.ViewPager
import kotlinx.android.synthetic.main.activity_home.*
import kotlinx.android.synthetic.main.tip_content.view.*

class Home : AppCompatActivity() {

    @SuppressLint("ResourceType")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        //Esconde  statusBar
        window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_FULLSCREEN

        // Botão entrar - Ir para a tela de Login
        button_entrar_home.setOnClickListener {
            abrirLoginActivity()
        }

        // Botão cadastrar - Ir para a primeira tela de cadastro(cadastro da data de nascimento)
        button_cadastrar_home.setOnClickListener {
            abrirCadastroDataNascimentoActivity()
        }

        // Slides - Passo 08 - Criar a lista e passar como parâmetro
        val tips: Array<Tip> = arrayOf(
            Tip(
                R.drawable.logo,
                R.drawable.farmacia,
                R.color.colorAzulTema,
                R.string.slider_01_home,
                "arraste para conhecer"
            ),
            Tip(
                R.drawable.logo,
                R.drawable.farmacia,
                R.color.colorAzulTema,
                R.string.slider_02_home,
                ""
            ),
            Tip(
                R.drawable.logo,
                R.drawable.farmacia,
                R.color.colorAzulTema,
                R.string.slider_03_home,
                ""
            ),
            Tip(
                R.drawable.logo,
                R.drawable.farmacia,
                R.color.colorAzulTema,
                R.string.slider_04_home,
                ""
            )
        )

        // Slides - Passo 10 -
        addDots(tips.size)

        // Slides - Passo 06 - Adicionar o adapter ao view_pager obs(passar a lista)
        view_pager.adapter = onBoardingAdapter(tips)

        // Slides - Passo 12 - Escutar os eventos para mudar a cor das bolinhas
        view_pager.addOnPageChangeListener(object : ViewPager.OnPageChangeListener {
            override fun onPageScrollStateChanged(state: Int) {
            }

            override fun onPageScrolled(
                position: Int,
                positionOffset: Float,
                positionOffsetPixels: Int
            ) {
            }

            override fun onPageSelected(position: Int) {
                addDots(tips.size, position)
            }
        })
    }

    // Função para abrir a tela de cadastro data de nascimento
    private fun abrirCadastroDataNascimentoActivity() {
        val intent = Intent(this, CadastroNascimentoActivity::class.java)
        startActivity(intent)
    }

    // Função para abrir a tela de Login
    private fun abrirLoginActivity() {
        val intent = Intent(this, LoginActivity::class.java)
        startActivity(intent)
    }

    // Slides - Passo 10 (continuação)
    private fun addDots(size: Int, position: Int = 0) {
        // Slides - Passo 12(continuação)
        dots.removeAllViews()
        Array(size) {
            val textView = TextView(baseContext).apply {
                text = getText(R.string.dotted)
                textSize = 35f
                setPadding(16)
                setTextColor(
                    if (position == it) ContextCompat.getColor(baseContext, android.R.color.white)
                    else ContextCompat.getColor(baseContext, android.R.color.darker_gray)
                )
            }
            dots.addView(textView)
        }
    }

    //    Slides - Passo 02 Adapter(Gerenciar as páginas dinâmicas da view_pager) obs: Esperar uma lista do adapter(Criar o modelo de dados Tip)
    private inner class onBoardingAdapter(val tips: Array<Tip>) : PagerAdapter() {

        // PagerAdapter - Instanciar um layout novo (obs criar o tip_content)
        @SuppressLint("ResourceType")
        @RequiresApi(Build.VERSION_CODES.JELLY_BEAN)
        override fun instantiateItem(container: ViewGroup, position: Int): Any {

            // Slides - Passo 03 instanciar o layout (tip_content)
            val view = layoutInflater.inflate(R.layout.tip_content, container, false)

            with(tips[position]) {
                view.tip_logo.setImageResource(logo)
                view.tip_image.setImageResource(image)
                view.tip_text.setText(textTip)
                view.background = ContextCompat.getDrawable(this@Home, background)
                view.tip_instrucao.text = textTipInstrutacao
            }
            // Slides - Passo 07 - Adicionar ao container
            container.addView(view)
            return view
        }

        // Slides - Passo 04 - destroi view para ser instaciada depois
        override fun destroyItem(container: ViewGroup, position: Int, `object`: Any) {
            container.removeView(`object` as View)
        }

        // Slides - Passo 05 - garantir que a view instanciada é a mesma que está chegando
        override fun isViewFromObject(view: View, `object`: Any): Boolean {
            return view == `object`
        }

        // PagerAdapter - Mostra a quantidade de páginas dinâmicas que vai ser construída (tips.size - para ter páginas dinâmicas)
        override fun getCount(): Int = tips.size
    }
}
