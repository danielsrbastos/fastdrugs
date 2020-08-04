package br.com.fastdrugs

import br.com.fastdrugs.http.HttpHelper
import br.com.fastdrugs.models.Farmacia
import org.jetbrains.anko.doAsync

class DataSourceFarmacia{
    companion object{
        fun createDataset(idEndereco: Int, token: String):String?{

            var lista =ArrayList<Farmacia>()

            val http = HttpHelper()
            val response = http.get("/farmacias/regiao/${idEndereco}", token)

            return response
        }
    }
}