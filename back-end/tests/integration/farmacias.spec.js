const request = require('supertest')
const server = require('../../src/server')
const connection = require('../../src/database')
const truncate = require('./truncate')

describe('FARMACIAS', () => {
    afterAll(async () => {
        await connection.close()
    })

    it('é possivel Cadastrar uma farmacia', async () => {
        const response = await request(server).post('/farmacias').send({
            "nome": "Farmácia FastDrugs",
            "email": "Fast@drugs.com",
            "senha": "12345678",
            "cnpj": "05.335.687/0001-30",
            "cep": "06600-010",
            "logradouro": "Avenida Carmine Gragnano",
            "numero": 17,
            "complemento": "",
            "bairro": "Centro",
            "cidade": "Jandira",
            "estado": "SP",
            "avaliacao": 0,
            "seg_sex": "00:00 - 23:59",
            "sab": "00:00 - 23:59",
            "dom_fer": "05:00 - 23:00",
            "responsavel": "Fast Drugs",
            "status": true,
            "distancia_maxima_entrega": 5,
            "preco_por_km": 25.50,
            "distancia_maxima_frete_gratis": 2
        })

        expect(response.ok).toBeTruthy()
        expect(response.body).toHaveProperty('id_farmacia')
        expect(response.status).toBe(201)
    })
})