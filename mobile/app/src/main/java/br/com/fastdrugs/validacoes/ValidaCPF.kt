package br.com.fastdrugs.validacoes

class ValidaCPF {
    companion object{
            fun validarCpf(cpf: String): Boolean{

                val cpfClean = cpf.replace(".", "").replace("-", "")

                //Verifica se o tamanho é 11
                if(cpfClean.length != 11)
                    return false

                //Verifica se é número
                try {
                    val number  = cpfClean.toLong()
                }catch (e : Exception){
                    return false
                }

                var dvCurrent10 = cpfClean.substring(9,10).toInt()
                var dvCurrent11= cpfClean.substring(10,11).toInt()

                // a soma dos nove primeiros dígitos determina o décimo dígito
                val cpfNineFirst = IntArray(9)
                var i = 9
                while (i > 0 ) {
                    cpfNineFirst[i-1] = cpfClean.substring(i-1, i).toInt()
                    i--
                }

                //multiplica os nove dígitos para seus pesos: 10,9..2
                var sumProductNine = IntArray(9)
                var weight = 10
                var position = 0
                while (weight >= 2){
                    sumProductNine[position] = weight * cpfNineFirst[position]
                    weight--
                    position++
                }

                //Verifica o nono dígito
                var dvForTenthDigit = sumProductNine.sum() % 11
                dvForTenthDigit = 11 - dvForTenthDigit //rule for tenth digit
                if(dvForTenthDigit > 9)
                    dvForTenthDigit = 0
                if (dvForTenthDigit != dvCurrent10)
                    return false

                //Verifica o décimo dígito
                var cpfTenFirst = cpfNineFirst.copyOf(10)
                cpfTenFirst[9] = dvCurrent10
                //multiple the nine digits for your weights: 10,9..2
                var sumProductTen = IntArray(10)
                var w = 11
                var p = 0
                while (w >= 2){
                    sumProductTen[p] = w * cpfTenFirst[p]
                    w--
                    p++
                }

                //Verifica o nono dígito
                var dvForeleventhDigit = sumProductTen.sum() % 11
                dvForeleventhDigit = 11 - dvForeleventhDigit //rule for tenth digit
                if(dvForeleventhDigit > 9)
                    dvForeleventhDigit = 0
                if (dvForeleventhDigit != dvCurrent11)
                    return false

                return true
            }
    }
}