import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Spinner, Modal } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'
import socketio from 'socket.io-client'
import md5 from 'md5'

import api from '../../services/api'
import { getToken, signOut, checkSession, getIdEndereco, setTokenAsDefaultHeader, getId } from '../../services/authService'
import cestaDeCompras from '../../services/cestaService'

import Header from './header'
import Slider from './slider'
import ModalProduto from './modalProduto'

import './styles.css'

import star from '../../assets/star.png'

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
    })
}

function Farmacia({ id_farmacia }) {
    const [farmacia, setFarmacia] = useState({})
    const [produtos, setProdutos] = useState([])
    const [categorias, setCategorias] = useState([])

    const [cliente, setCliente] = useState({})

    const [showProductModal, setShowProductModal] = useState(false)
    const [productForModal, setProductForModal] = useState({})

    const [showModalRecipe, setShowModalRecipe] = useState(false)
    const [modalRecipeMessage, setModalRecipeMessage] = useState('')

    const [token] = useState(getToken('cliente'))
    const [displayContent, setDisplayContent] = useState(false)

    const [expiredSession, setExpiredSession] = useState(false)

    useEffect(() => {
        (async () => {
            if (!checkSession(token))
                return setExpiredSession(true)

            setTokenAsDefaultHeader()

            try {
                const responseCliente = await api.get(`/clientes/${getId('cliente')}`)
                setCliente(responseCliente.data)

                const responseFarmacia = await api.get(`/farmacias/${id_farmacia}/delivery/${getIdEndereco()}`)
                setFarmacia(responseFarmacia.data)

                const responseProdutos = await api.get(`/farmacias/${id_farmacia}/produtos`)
                setProdutos(responseProdutos.data)

                const responseCategorias = await api.get(`/farmacias/${id_farmacia}/categorias`)
                setCategorias(responseCategorias.data)

                setDisplayContent(true)
            } catch (e) {
                if (e.response && e.response.data.error === 'token_invalid')
                    return setExpiredSession(true)

                return console.log(e)
            }
        })()
    }, [])

    const handleRecipe = async (file) => {
        const socket = socketio('http://localhost:3000/receitas')
        const base64 = (await getBase64(file)).replace(/data:.+?,/g, '')

        socket.emit('setClient', {
            name: cliente.nome,
            email: cliente.email,
            pharmacyId: id_farmacia,
            clientId: cliente.id_cliente
        })

        socket.emit('sendRecipe', {
            filename: md5(Date.now() + file.name) + '.' + file.name.split('.').pop(),
            base64
        })

        socket.on('productRecipe', (data) => {
            if (data.error === 'recipe rejected') {
                setModalRecipeMessage('Sua receita foi rejeitada :(')
                setShowModalRecipe(true)
            } else if (data.products) {
                cestaDeCompras.setCesta(data.products)
                setModalRecipeMessage('Sua receita foi aceita. Os produtos foram para sua cesta de compras :)')
                setShowModalRecipe(true)
            }
        })
    }

    return (
        <div>
            <ModalProduto show={showProductModal} handleCloseModal={() => setShowProductModal(false)} product={productForModal} />
            <Modal
                show={showModalRecipe}
                onHide={() => setShowModalRecipe(false)}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <h4>{modalRecipeMessage === 'Sua receita foi rejeitada :(' ? 'Oops...' : 'Yay!'}</h4>
                </Modal.Header>

                <Modal.Body>
                    <p style={{ textAlign: 'center', fontSize: 16 }}>
                        {modalRecipeMessage}
                    </p>
                </Modal.Body>
            </Modal>

            {expiredSession ? (() => {
                signOut('cliente')
                return (<Redirect to={{ pathname: '/entrar/cliente', state: { expiredSession: true } }}></Redirect>)
            })() : ''}

            {farmacia.distancia ? (farmacia.distancia > farmacia.distancia_maxima_entrega ? <Redirect to={{ pathname: '/lista-farmacias' }}></Redirect> : '') : ''}

            <Header />

            <Row className="mt-4">
                <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Spinner animation="border" role="status" style={{ marginTop: 400, display: displayContent ? 'none' : 'block' }}>
                        <span className="sr-only">Loading...</span>
                    </Spinner>

                    <Row style={{ display: displayContent ? 'flex' : 'none', width: '100%' }}>
                        <Col md={9} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Row>
                                <h1 className="mt-4" style={{ fontWeight: 'bold', color: '#363636', marginLeft: 15 }}>
                                    {farmacia.nome}
                                </h1>
                            </Row>
                            <Row>
                                <div style={{ width: 400, display: 'flex' }}>
                                    <div style={{ display: 'flex', width: '50%' }}>
                                        <img src={star} alt="Estrela" style={{ height: 37, marginTop: -1, marginLeft: 15 }} />
                                        <p className="avaliacao textoDelivery" style={{ fontSize: 25 }}>5.0</p>
                                    </div>

                                    <div style={{ width: '50%', display: 'flex', justifyContent: 'flex-end' }}>
                                        <p className="textoDelivery">
                                            {farmacia.distancia ? farmacia.distancia.toFixed(1).toString().replace('.', ',') : 0} km
                                        </p>
                                    </div>
                                </div>
                            </Row>
                            <Row>
                                <div style={{ width: 400, display: 'flex' }}>
                                    <div style={{ display: 'flex', width: '70%' }}>
                                        <p className="textoDelivery" style={{ marginLeft: 15 }}>{farmacia.tempo}</p>
                                    </div>

                                    <div style={{ width: '30%', display: 'flex', justifyContent: 'flex-end' }}>
                                        <p className="textoDelivery">{farmacia.frete ? (farmacia.frete === 0 ? 'Grátis' : `R$ ${farmacia.frete.toFixed(2).toString().replace('.', ',')}`) : "Grátis"}</p>
                                    </div>
                                </div>
                            </Row>
                        </Col>
                        <Col md={3}>
                            <img width="100%" src={farmacia.url_imagem} alt="Farmácia Imagem" />
                        </Col>
                    </Row>
                </Container>
            </Row>

            <Container style={{ display: displayContent ? 'block' : 'none' }}><div style={{ width: '100%', height: 1, border: 'solid 0.1px #ccc', marginTop: 30, marginBottom: 20 }}></div></Container>

            <Container style={{ display: displayContent ? 'block' : 'none' }}>
                <Button style={{ width: '100%', padding: 0, cursor: 'pointer' }} variant="dark">
                    <label style={{ width: '100%', height: '100%', marginBottom: 0, padding: 6, cursor: 'pointer' }}>
                        Enviar receita médica para análise
                        <input style={{ width: '100%', height: '100%', display: 'none' }} type="file" onChange={e => handleRecipe(e.target.files[0])} />
                    </label>
                </Button>
            </Container>

            <Container style={{ display: displayContent ? 'block' : 'none' }}><div style={{ width: '100%', height: 1, border: 'solid 0.1px #ccc', marginTop: 20 }}></div></Container>

            <Row className="mt-5">
                <Container style={{ visibility: displayContent ? 'visible' : 'hidden' }}>
                    {categorias.map(categoria => {
                        return (
                            <div key={categoria.id_categoria}>
                                <h3 style={{ fontWeight: 'bold', color: '#323232', marginBottom: 20 }}>{categoria.nome}</h3>

                                <Slider
                                    options={{
                                        adaptiveHeight: true,
                                        pageDots: false,
                                        prevNextButtons: false,
                                        freeScroll: true,
                                        cellAlign: 'left'
                                    }}>
                                    {produtos.filter(produto => produto.id_categoria === categoria.id_categoria).map(produto => {
                                        return (
                                            <div style={{ minHeight: 390, height: 'auto', paddingBottom: 4 }} key={produto.id_produto}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="list_produto">

                                                    <img
                                                        src={produto.ImagemProduto[0] ? produto.ImagemProduto[0].url_imagem : "https://storage.googleapis.com/fastdrugs-4cdfa.appspot.com/ProdutoDefault.png"}
                                                        alt="Imagem do Produto"
                                                        style={{ height: 200, marginTop: 10 }}
                                                    />

                                                    <p className="textoDelivery"
                                                        style={{ textAlign: 'center', fontSize: 20, marginBottom: 5 }}>
                                                        {produto.nome}
                                                    </p>

                                                    <p className="textoDelivery descricao"
                                                        style={{ width: 170, textAlign: 'center', fontSize: 16, color: '#898686', fontWeight: 0 }}>
                                                        {produto.descricao}
                                                    </p>

                                                    <p className="textoDelivery mt-3 text-center"
                                                        style={{ color: '#30BE69' }}>
                                                        R$ {produto.preco.toFixed(2).toString().replace('.', ',')}
                                                    </p>

                                                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row-reverse' }}>
                                                        <Button variant="light" style={{ width: '20%', marginBottom: 10, marginRight: 10, border: 'solid 0.5px #ccc', color: '#b0b0b0' }} onClick={() => {
                                                            setProductForModal(produto)
                                                            setShowProductModal(true)
                                                        }}>...</Button>
                                                    </div>

                                                </div>
                                            </div>
                                        )
                                    })}
                                </Slider>

                                <div className="text-center">
                                    <p className="opcional mt-2" style={{ color: '#8c8c8c' }}>arraste para mais produtos</p>
                                </div>

                                <div style={{ width: '100%', height: 1, border: 'solid 0.1px #ccc', marginTop: 30, marginBottom: 30 }}></div>
                            </div>
                        )
                    })}
                </Container>
            </Row>
        </div >
    )
}

export default Farmacia