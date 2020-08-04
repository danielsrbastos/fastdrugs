package br.com.fastdrugs.http

import okhttp3.MediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody

class HttpHelper {

    var URL = "http://192.168.0.108:3000"
    private val client = OkHttpClient()

    fun post(endpoint: String, json: String): String? {
        val headerHttp = MediaType.parse("application/json; charset=utf-8")
        val body = RequestBody.create(headerHttp, json)

        val request = Request.Builder().url("${URL}${endpoint}").post(body).build()
        val response = client.newCall(request).execute()

        return response.body()?.string()
    }

    fun postPrivate(endpoint: String, json: String, token: String): String? {
        val headerHttp = MediaType.parse("application/json; charset=utf-8")
        val body = RequestBody.create(headerHttp, json)

        val request = Request.Builder().header("Authorization", "Bearer " + token)
            .url("${URL}${endpoint}").post(body).build()
        val response = client.newCall(request).execute()

        return response.body()?.string()
    }

    fun get(endpoint: String, token: String): String? {
        val request = Request.Builder().header("Authorization", "Bearer " + token)
            .url(URL + endpoint).get().build()
        val response = client.newCall(request).execute()

        return response.body()?.string()
    }

    fun getExternal(url: String): String? {
        val request = Request.Builder().url(url).get().build()
        val response = client.newCall(request).execute()

        return response.body()?.string()
    }
}