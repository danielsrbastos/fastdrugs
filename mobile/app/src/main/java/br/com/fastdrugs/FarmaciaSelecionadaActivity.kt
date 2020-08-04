package br.com.fastdrugs

import android.annotation.SuppressLint
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Base64
import android.view.MenuItem
import android.view.View
import androidx.recyclerview.widget.LinearLayoutManager
import br.com.fastdrugs.adapter.GroupProdutoAdapter
import br.com.fastdrugs.http.HttpHelper
import br.com.fastdrugs.models.*
import br.com.fastdrugs.models.socket.ImageRecipe
import br.com.fastdrugs.models.socket.RecipeData
import br.com.fastdrugs.services.CestaSharedPreferences
import com.bumptech.glide.Glide
import com.bumptech.glide.request.RequestOptions
import com.github.nkzawa.socketio.client.IO
import com.google.gson.Gson
import kotlinx.android.synthetic.main.activity_farmacia_selecionada.*
import org.jetbrains.anko.doAsync
import org.jetbrains.anko.uiThread
import java.io.ByteArrayOutputStream
import java.text.DecimalFormat
import java.util.*
import kotlin.collections.ArrayList

class FarmaciaSelecionadaActivity : AppCompatActivity() {

    private lateinit var notificationManager: NotificationManager
    private lateinit var notificationChannel: NotificationChannel
    private lateinit var builder: Notification.Builder
    private val channelId = " br.com.fastdrugs.adapter"

    private lateinit var token: String
    private lateinit var farmacia: Farmacia
    private var id_cliente = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_farmacia_selecionada)

        setSupportActionBar(toolbar_farmacia_selecionada)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        val gson = Gson()
        val http = HttpHelper()

        farmacia = gson.fromJson(intent.getStringExtra("FARMACIA"), Farmacia::class.java)
        token = intent.getStringExtra("TOKEN")!!
        id_cliente = intent.getIntExtra("ID_CLIENTE", 0)

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

        selecionarImagemButton.setOnClickListener {
            val intent = Intent(Intent.ACTION_GET_CONTENT)
            intent.type = "image/*"
            startActivityForResult(Intent.createChooser(intent, "Selecionar Imagem"), 1000)
        }

        doAsync {
            val responseCategorias =
                http.get("/farmacias/${farmacia.id_farmacia}/categorias", token)
            val responseProdutos = http.get("/farmacias/${farmacia.id_farmacia}/produtos", token)

            val categorias =
                gson.fromJson(responseCategorias, Array<Categoria>::class.java).toList()
            val produtos = gson.fromJson(responseProdutos, Array<Produto>::class.java).toList()

            for (categoria in categorias) {

                val produtosCategoria = ArrayList<Produto>()

                for (produto in produtos) {
                    if (produto.id_categoria == categoria.id_categoria) {
                        produtosCategoria.add(produto)
                    }
                }

                categoria.listItem = produtosCategoria

            }

            uiThread {
                recycler_view_categorias.layoutManager =
                    LinearLayoutManager(this@FarmaciaSelecionadaActivity)
                val groupProdutoAdapter = GroupProdutoAdapter(
                    this@FarmaciaSelecionadaActivity,
                    categorias,
                    intent.getStringExtra("FARMACIA")!!,
                    token!!,
                    id_cliente
                )
                recycler_view_categorias.adapter = groupProdutoAdapter

                loading_panel.visibility = View.GONE
            }
        }
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            android.R.id.home -> {
                val intent = Intent(this, ListaFarmaciaActivity::class.java)

                intent.putExtra("token", token)
                intent.putExtra("id_cliente", id_cliente)

                startActivity(intent)
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == 1000 && resultCode == -1 && data != null) {
            doAsync {
                val imageStream = contentResolver.openInputStream(data.data!!)
                val selectedImage = BitmapFactory.decodeStream(imageStream)

                val baos = ByteArrayOutputStream()
                selectedImage.compress(Bitmap.CompressFormat.JPEG, 100, baos);
                val byteArray = baos.toByteArray()
                val base64 = Base64.encodeToString(byteArray, Base64.NO_WRAP)

                val imageRecipe = ImageRecipe()
                imageRecipe.base64 = base64
                imageRecipe.filename = Date().toString().replace(" ", "").replace(".", "").replace(":", "") + ".png"

                val cliente = Gson().fromJson(
                    HttpHelper().get("/clientes/$id_cliente", token),
                    Cliente::class.java
                )

                val client = RecipeData()
                client.name = cliente.nome
                client.email = cliente.email
                client.pharmacyId = farmacia.id_farmacia
                client.clientId = id_cliente

                val http = HttpHelper()
                val socket = IO.socket(http.URL + "/receitas")
                notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

                socket.emit("setClient", Gson().toJson(client))
                socket.emit("sendRecipe", Gson().toJson(imageRecipe))

                socket.on("productRecipe") { parameters ->
                    val recipeData = Gson().fromJson(parameters[0].toString(), RecipeData::class.java)
                    uiThread {
                        if (recipeData.error == "recipe rejected") {
                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                                notificationChannel = NotificationChannel(channelId, "Sua receita enviada à ${farmacia.nome} foi rejeitada :(", NotificationManager.IMPORTANCE_HIGH)
                                notificationManager.createNotificationChannel(notificationChannel)

                                builder = Notification.Builder(this@FarmaciaSelecionadaActivity, channelId)
                                    .setContentTitle("Fast Drugs")
                                    .setContentText("Sua receita enviada à ${farmacia.nome} foi rejeitada :(")
                                    .setSmallIcon(R.drawable.fastdrugs_splash)
                            } else {
                                builder = Notification.Builder(this@FarmaciaSelecionadaActivity)
                                    .setContentTitle("Fast Drugs")
                                    .setContentText("Sua receita enviada à ${farmacia.nome} foi rejeitada :(")
                                    .setSmallIcon(R.drawable.fastdrugs_splash)
                            }
                            notificationManager.notify(1234, builder.build())

                            text_view_rejeitado.visibility = View.VISIBLE
                            text_view_aceito.visibility = View.GONE
                        } else if (recipeData.products.size > 0) {
                            val cestaSharedPreferences = CestaSharedPreferences(this@FarmaciaSelecionadaActivity)

                            cestaSharedPreferences.setProducts(recipeData.products)

                            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                                notificationChannel = NotificationChannel(channelId, "Sua receita enviada à ${farmacia.nome} foi aceita :D", NotificationManager.IMPORTANCE_HIGH)
                                notificationManager.createNotificationChannel(notificationChannel)

                                builder = Notification.Builder(this@FarmaciaSelecionadaActivity, channelId)
                                    .setContentTitle("Fast Drugs")
                                    .setContentText("Sua receita enviada à ${farmacia.nome} foi aceita :D")
                                    .setSmallIcon(R.drawable.fastdrugs_splash)
                            } else {
                                builder = Notification.Builder(this@FarmaciaSelecionadaActivity)
                                    .setContentTitle("Fast Drugs")
                                    .setContentText("Sua receita enviada à ${farmacia.nome} foi aceita :D")
                                    .setSmallIcon(R.drawable.fastdrugs_splash)
                            }
                            notificationManager.notify(1234, builder.build())

                            text_view_rejeitado.visibility = View.GONE
                            text_view_aceito.visibility = View.VISIBLE
                        }
                    }
                }

                socket.connect()
            }
        }

        super.onActivityResult(requestCode, resultCode, data)
    }
}

