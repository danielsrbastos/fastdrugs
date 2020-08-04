import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Spinner, FormControl } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'
import Select from 'react-select'
import md5 from 'md5'
import { v4 as uuidv4 } from 'uuid'
import socketio from 'socket.io-client'

import { selectTheme } from '../../themes'
import './styles.css'

import { getToken, signOut, checkSession, getIdEndereco, getId, setTokenAsDefaultHeader } from '../../../services/authService'
import api from '../../../services/api'

import CestaDeCompras from '../../../services/cestaService'

import Header from '../header'

import fastDrugs from '../../../assets/fastdrugs-white-horizontal.png'
import cesta from '../../../assets/cesta.png'
import cestaService from '../../../services/cestaService'

function Cesta({ history }) {

    const idCliente = getId('cliente')

    const [products, setProducts] = useState(CestaDeCompras.getProducts)
    const [infoFarma, setInfoFarma] = useState([])
    const [clients, setClients] = useState([])
    const [precoTotal, setPrecoTotal] = useState('')
    const [formaPagamento, setFormaPagamento] = useState('')

    const [formasPagamento, setFormasPagamento] = useState([])

    const [redirectPedidos, setRedirectPedidos] = useState(false)
    const [redirectFarma, setRedirectFarma] = useState(false)
    const [disabledButton, setDisabledButton] = useState(false)
    const [expiredSession, setExpiredSession] = useState(false)

    let idFarma = products.length > 0 ? products[0].id_farmacia : null

    useEffect(() => {
        let preco = products.reduce((before, novo) => before + novo.preco * novo.quantidade, 0)
        setPrecoTotal(preco)
    }, [products])

    useEffect(() => {
        (async () => {
            setTokenAsDefaultHeader()

            try {
                if (idFarma != null) {
                    //Informações farmacia
                    const data = await api.get(`/farmacias/${idFarma}/delivery/${getIdEndereco()}`)
                    let dadosFarma = data.data
                    setInfoFarma(dadosFarma)

                    //Informações cliente
                    const res = await api.get(`/clientes/${idCliente}`)
                    setClients(res.data.clienteEnderecos[0])

                    const formasPagamento = await api.get(`/farmacias/${dadosFarma.id_farmacia}/formasDePagamento`)

                    const formasPagamentoConverted = JSON.parse(JSON.stringify(formasPagamento.data).split('"id_forma_pagamento":').join('"value":').split('"tipo":').join('"label":'))

                    setFormasPagamento(formasPagamentoConverted)
                } else {
                    setClients({ client: 'client' })
                }
            } catch (e) {
                console.log(e)
            }
        })()
    }, [])

    useEffect(() => {
        (async () => {
            if (!checkSession(getToken('cliente')))
                return setExpiredSession(true)
        })()
    }, [])

    const handleSubmit = async () => {
        setDisabledButton(true)

        const requestBody = {
            forma_pagamento: formaPagamento.label,
            frete: infoFarma.frete,
            numero: uuidv4().substr(0, 35),
            valor: precoTotal + infoFarma.frete,
            produtos: products
        }

        try {
            await api.post(`/pedidos/clientes/${idCliente}/farmacias/${idFarma}`, requestBody)

            const socket = socketio('http://localhost:3000/pedidos')
            socket.emit('newPedido', idFarma)

            cestaService.clearCesta()
            setRedirectPedidos(true)
        } catch (e) {
            return console.log(e.response)
        }
    }

    return (
        <div>
            {expiredSession ? (() => {
                signOut('cliente')
                return (<Redirect to={{ pathname: '/entrar/cliente', state: { expiredSession: true } }}></Redirect>)
            })() : ''}

            {redirectFarma ? <Redirect to={`/delivery/${infoFarma.nome.replace(/\s/g, '-').toLowerCase()}/${md5(infoFarma.id_farmacia)}`} /> : <></>}

            {redirectPedidos ? <Redirect to={{ pathname: '/meus-pedidos', state: { orderRealized: true, farmacia: infoFarma } }}></Redirect> : ''}

            <Header />

            <div style={{ display: clients.length === 0 ? 'flex' : 'none', justifyContent: 'center', marginTop: 400 }}>
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div>

            <Container style={{ display: clients.length === 0 ? 'none' : 'block' }}>
                <h3 style={{ fontSize: 30, fontWeight: 'bold', color: '#323232', marginBottom: 30, marginTop: 30 }}>Minha Cesta</h3>

                <div style={{ display: products.length === 0 ? 'none' : 'block' }}>
                    <div className="farmacia">
                        <Row style={{ color: '#202020' }}><p style={{ margin: 0, fontSize: 16, display: products.length === 0 ? 'none' : 'block' }}>Seu pedido em:</p></Row>
                        <Row style={{ fontSize: 22, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => {
                            setRedirectFarma(true)
                        }}>{infoFarma.nome}</Row>
                    </div>
                </div>

                <div style={{ marginLeft: -15, width: '100%', height: 1, border: 'solid 0.1px #ccc', marginTop: products.length !== 0 ? 30 : 0 }}></div>

                {products.length === 0 ? <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <p style={{ marginTop: 20, marginBottom: 5, fontSize: 20, fontWeight: 'bold' }}>Sua cesta está vazia <span style={{ fontWeight: 'normal', fontStyle: 'italic' }}>:(</span></p>

                    <Link to="/lista-farmacias" style={{ marginTop: 0, color: "#a3a3a3" }}>Clique aqui para descobrir as farmácias na sua região</Link>

                    <div style={{ marginLeft: -27.5, width: '100%', height: 1, border: 'solid 0.1px #ccc', marginTop: 23 }}></div>
                </div> : ''}

                {products.map(product => {
                    // CestaDeCompras.clearCesta()
                    return (
                        <div key={product.id_produto}>
                            <div className="" style={{ height: 'auto', paddingTop: 15, paddingBottom: 15 }} key={product.id_produto}>
                                <Row style={{ width: '100%' }}>
                                    <Col md={4} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Row>
                                            <h6 style={{ fontSize: 20, fontWeight: 700, color: '#323232', textAlign: 'left', marginBottom: 0 }}>{product.nome}</h6>
                                        </Row>
                                        <Row className="mt-2">
                                            <h6 style={{ color: '#323232', textAlign: 'left', marginBottom: 0 }}>{product.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} a unidade</h6>
                                        </Row>
                                    </Col>

                                    <Col md={2} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        {product.ImagemProduto.map((imagem, i) => {

                                            if (i > 3)
                                                return <></>

                                            return <img key={imagem.id_imagem} style={{ height: 40 }} src={imagem.url_imagem} alt={product.nome} />
                                        })}
                                    </Col>

                                    <Col md={1}>

                                    </Col>

                                    <Col md={3} style={{ display: 'flex', flexDirection: 'row', alignContent: 'center', paddingRight: 0, justifyContent: 'center', alignItems: 'center' }}>
                                        <h6 className="mr-2" style={{ margin: 0 }}> Quant: </h6>
                                        <FormControl
                                            style={{ height: 30, width: 60, fontSize: 14 }}
                                            placeholder="Quantidade"
                                            aria-label="Quantidade"
                                            aria-describedby="basic-addon2"
                                            type="number"
                                            value={product.quantidade}
                                            onChange={e => {
                                                if (e.target.value <= 0)
                                                    return product.quantidade = 1

                                                const produtos = products.map(produto => {
                                                    if (produto.id_produto === product.id_produto) {
                                                        produto.quantidade = e.target.value
                                                    }

                                                    return produto
                                                })

                                                setProducts(produtos)
                                                CestaDeCompras.setCesta(produtos)
                                            }}
                                        />
                                    </Col>
                                    <Col md={2}>
                                        <Row style={{ fontSize: 20, fontWeight: 'bold', display: 'flex', justifyContent: 'flex-end' }}>
                                            <p style={{ margin: 0, fontSize: 18 }}>Total: {(product.quantidade * product.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                        </Row>
                                        <Row style={{ color: '#a3a3a3', display: 'flex', justifyContent: 'flex-end' }}>
                                            <p style={{ fontFamily: 'Roboto', margin: 0, fontSize: 16, cursor: 'pointer' }} onClick={e => {
                                                const produtos = products.filter(produto => produto.id_produto !== product.id_produto)

                                                setProducts(produtos)
                                                CestaDeCompras.setCesta(produtos)
                                            }}>Remover</p>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>
                            <div style={{ marginLeft: -15, width: '100%', height: 1, border: 'solid 0.1px #ccc' }}></div>
                        </div>
                    )
                })}
                <Row style={{ width: '100%', marginTop: 20, display: products.length === 0 ? 'none' : 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Col md={9}>
                        <Row style={{ fontSize: 30, fontWeight: 'bold', paddingLeft: 15, color: '#323232' }}>
                            Dados de entrega
                        </Row>
                        <Row className="mt-2" style={{ fontFamily: 'Roboto', fontSize: 18, color: '#202020' }}>{clients.logradouro}, {clients.numero} - {clients.bairro}</Row>
                        <Row className="" style={{ fontFamily: 'Roboto', fontSize: 18, color: '#202020' }}>{clients.cidade} - {clients.estado}</Row>
                    </Col>
                    <Col md={3}>
                        <Row className="mt-1" style={{ fontFamily: 'Roboto', color: '#202020', display: 'flex', justifyContent: 'flex-end' }}>
                            <p style={{ fontSize: 18, margin: 0 }}>Subtotal: {precoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        </Row>
                        <Row className="mt-1" style={{ fontFamily: 'Roboto', color: '#202020', display: 'flex', justifyContent: 'flex-end' }}>
                            <p style={{ fontSize: 18, margin: 0 }}>Taxa de entrega: {infoFarma.frete === 0 ? 'Grátis' : (() => {
                                if (typeof infoFarma.frete !== 'undefined') {
                                    return infoFarma.frete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                }
                            })()}</p>
                        </Row>
                        <Row className="mt-1" style={{ fontFamily: 'Roboto', fontWeight: 'bold', color: '#202020', display: 'flex', justifyContent: 'flex-end' }}>
                            <p style={{ fontSize: 20, margin: 0 }}>Total: {(precoTotal + infoFarma.frete).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        </Row>
                    </Col>
                </Row>
                <div style={{ marginLeft: -15, width: '100%', height: 1, border: 'solid 0.1px #ccc', marginTop: 23, marginBottom: 20, display: products.length === 0 ? 'none' : 'block' }}></div>

                <Row style={{ width: '100%', display: products.length === 0 ? 'none' : 'block' }}>
                    <Row style={{ fontSize: 30, fontWeight: 'bold', paddingLeft: 30, marginBottom: 10, color: '#323232' }}>
                        Formas de pagamento
                    </Row>

                    <Select
                        classNamePrefix="select"
                        options={formasPagamento}
                        placeholder="Ex: Dinheiro"
                        value={formaPagamento}
                        onChange={value => setFormaPagamento(value)}
                        theme={theme => selectTheme(theme)}
                    />

                    <Button style={{ fontSize: 18, marginTop: 20, height: 50 }} id="btnEntrar" className="transition" onClick={handleSubmit} disabled={disabledButton ? 'disabled' : ''}>
                        FINALIZAR COMPRA
                    </Button>
                </Row>
            </Container>
        </div>
    )
}

export default Cesta