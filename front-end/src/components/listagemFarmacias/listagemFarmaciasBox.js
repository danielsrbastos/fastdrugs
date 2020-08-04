import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'

import md5 from 'md5'
import api from '../../services/api'
import { getId, getToken, signOut, checkSession, setIdEndereco, getIdEndereco, setTokenAsDefaultHeader } from '../../services/authService'

import Header from './header'

import './styles.css'

import remedios from '../../assets/remedios.png'
import drugstore from '../../assets/farmateste.png'
import star from '../../assets/star.png'

function ListagemFarmaciasBox() {

    const [listaFarmacias, setListaFarmacias] = useState([]);

    const [expiredSession, setExpiredSession] = useState(false)

    const idCliente = getId('cliente');
    const tokenCliente = getToken('cliente');

    useEffect(() => {
        (async () => {
            if (!checkSession(tokenCliente))
                return setExpiredSession(true)

            setTokenAsDefaultHeader()

            try {
                // Pegando o id de endereço do cliente
                const data = await api.get(`/clientes/${idCliente}`)
                const idEndereco = data.data.clienteEnderecos[0].id_endereco

                setIdEndereco(idEndereco)

                // Pegando os dados da farmácia
                const res = await api.get(`/farmacias/regiao/${getIdEndereco()}`)
                const infoFarmacias = res.data

                setListaFarmacias(infoFarmacias)
            } catch (e) {
                if (e.response && e.response.data.error === 'token_invalid')
                    return setExpiredSession(true)

                else if (e === [])
                    return console.log('Nenhuma farmácia na região')

                return e
            }
        })()

    }, [idCliente, tokenCliente])

    return (
        <div>
            {expiredSession ? (() => {
                signOut('cliente')
                return (<Redirect to={{ pathname: '/entrar/cliente', state: { expiredSession: true } }}></Redirect>)
            })() : ''}

            <Header />

            {/* Imagem e textos iniciais*/}

            <Row style={{ marginTop: 20 }}>
                <Container className="container-img">
                    <Col md={6}>
                        <img src={remedios} alt="remedios" />
                    </Col>
                    <Col md={7}>
                        <Container>
                            <div className="firstText">
                                PEÇA MEDICAMENTOS
                            </div>
                            <div className="secondText">
                                DE ONDE ESTIVER
                            </div>
                        </Container>
                    </Col>
                </Container>
            </Row>

            {/* Barra de pesquisa e botao */}

            <Row className="mt-2">
                <form id="boxInputs">
                    <Container>
                        <Row>
                            <Col md={9}>
                                <input
                                    type="text"
                                    placeholder="Nome do medicamento"
                                    // onChange={e => setPrecoPorKm(reaisMask(e.target.value))}
                                    // value={precoPorKm}
                                    style={{ margin: 0 }}
                                />
                            </Col>
                            <Col md={3}>
                                <Button style={{ fontSize: 18, marginTop: 1 }} id="btnEntrar" className="transition" type="submit">
                                    BUSCAR
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </form>
            </Row>

            <Container className="mt-4" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                <Spinner animation="border" role="status" style={{ marginTop: 100, display: listaFarmacias.length > 0 ? 'none' : 'block' }}>
                    <span className="sr-only">Loading...</span>
                </Spinner>

                <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
                    {/* Item da lista */}
                    {listaFarmacias.map(dadosFarma => {

                        if (!dadosFarma.status)
                            return <></>

                        let logo

                        if (dadosFarma.url_imagem === null) {
                            logo = drugstore
                        } else {
                            logo = dadosFarma.url_imagem
                        }

                        return (
                            <Link to={{ pathname: `/delivery/${dadosFarma.nome.replace(/\s/g, '-').toLowerCase()}/${md5(dadosFarma.id_farmacia)}`, state: { distancia: dadosFarma.distancia, frete: dadosFarma.frete } }} key={dadosFarma.id_farmacia} style={{ textDecoration: 'none' }}>
                                <Row style={{ margin: 10 }}>
                                    <Container className="list_medicine text-center mb-2">
                                        <Col md={4} className="img-farmacia pt-4">
                                            <img src={logo} alt="teste" width="130" height="130" />
                                        </Col>

                                        <Col md={8} className="desc-farmacia pt-4">
                                            <div className="card" style={{ border: 'none', borderLeft: 'solid 0.3px #cccccc', background: '#fff' }}>
                                                <div className="card-body" style={{ paddingRight: 0 }}>
                                                    <h5 className="card-title">{dadosFarma.nome}</h5>
                                                    <Container className="desc">
                                                        <Col md={6} className="mr-2" style={{ display: 'flex' }}>
                                                            <img src={star} alt="Estrela" style={{ height: 25, marginTop: -1.5 }} />
                                                            <p className="avaliacao">5.0</p>
                                                        </Col>
                                                        <Col md={6}>
                                                            <p>{dadosFarma.distancia.toFixed(1).toString().replace('.', ',')} km</p>
                                                        </Col>
                                                    </Container>
                                                    <Container className="desc mt-2">
                                                        <Col md={6} className="mr-2">
                                                            <p>{dadosFarma.tempo}</p>
                                                        </Col>
                                                        <Col md={6}>
                                                            <p>{dadosFarma.frete === 0 ? 'Grátis' : `R$ ${dadosFarma.frete.toFixed(2).toString().replace('.', ',')}`}</p>
                                                        </Col>
                                                    </Container>
                                                </div>
                                            </div>
                                        </Col>
                                    </Container>
                                </Row>
                            </Link>
                        )
                    })}
                </Row>
            </Container>
        </div>
    )
}

export default ListagemFarmaciasBox