//Subir servidor
const request = require('supertest')
const server = require('../../src/server')
const connection = require('../../src/database')
const truncate = require('./truncate')

describe("CLIENTES", () => {

    afterAll(async () => {
        server.close()
        await connection.close()
    })

    let idEndereco, token, idCliente

    it('Numero celular,E-mail,CPF não esta em uso', async () => {
        const response = await request(server).post('/clientes/validate').send({
            celular: "(11) 91234-9999",
            cpf: "401.030.950-47",
            email: "Vinicius@teste.com"
        })

        expect(response.ok).toBeTruthy()
        expect(response.body).toHaveProperty('success')
        expect(response.status).toBe(200)
    })

    it('é possivel cadastrar um novo cliente', async () => {
        const response = await request(server).post('/clientes').send({
            nome: "Vinicius Alexandrino",
            email: "Vinicius@teste.com",
            senha: "12345678",
            celular: "(11) 91234-9999",
            data_nascimento: "03/07/2000",
            cpf: "401.030.950-47"
        })

        expect(response.ok).toBeTruthy()
        expect(response.body).toHaveProperty('id_cliente')
        expect(response.status).toBe(201)

        idCliente = response.body.id_cliente
    })

    it('Cadastrar Endereço do cliente', async () => {
        const response = await request(server).post(`/clientes/${idCliente}/enderecos`).send({
            "enderecos" : [
                {
                    "cep": "06600-025",
                    "logradouro" : "Rua Elton Silva",
                    "numero" : "20",
                    "complemento" : "",
                    "bairro" : "Centro",
                    "cidade" : "Jandira",
                    "estado" : "sp"
                }
            ]
        })

        expect(response.status).toBe(201)
        response.body.forEach(value => {
            expect(value).toHaveProperty('id_endereco')
        })
    })

    it('é possivel realizar o Login de Cliente', async() => {
        const response = await request(server).post('/clientes/auth').send({
            email: "Vinicius@teste.com",
            senha: "12345678"
        })

        expect(response.ok).toBeTruthy()
        expect(response.body.client).toHaveProperty('id')
        expect(response.body).toHaveProperty('token')
        expect(response.status).toBe(200)

        token = response.body.token
        idCliente = response.body.client.id

    })

    it('filtrar enderecos de cliente logado', async() =>{
        const response = await request(server)
            .get(`/clientes/${idCliente}`)
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.ok).toBeTruthy()
        expect(response.body).toHaveProperty('id_cliente')
        expect(response.body).toHaveProperty('clienteEnderecos')
        expect(response.status).toBe(200)

        idEndereco = response.body.clienteEnderecos[0].id_endereco
    })
    
    it('Existem farmacias que entregam na região do cliente', async() => {
        const response = await request(server)
            .get('/farmacias/regiao/' + idEndereco)
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.ok).toBeTruthy()
        response.body.forEach(value => {
            expect(value).toHaveProperty('id_farmacia')
        })
        expect(response.status).toBe(200)
    })

})
