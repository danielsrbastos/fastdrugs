package br.com.fastdrugs

import androidx.annotation.DrawableRes

data class Tip(
    @DrawableRes val logo: Int,
    @DrawableRes val image: Int,
    @DrawableRes val background: Int,
    @DrawableRes val textTip: Int,
    val textTipInstrutacao: String
)