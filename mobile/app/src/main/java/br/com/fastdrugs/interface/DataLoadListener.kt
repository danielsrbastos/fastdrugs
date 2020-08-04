package br.com.fastdrugs.`interface`

import br.com.fastdrugs.models.Produto

interface DataLoadListener {

    fun onDataLoadSucess(itemGroupList: List<Produto>)
    fun onDataLoadFailed(message: String)
}