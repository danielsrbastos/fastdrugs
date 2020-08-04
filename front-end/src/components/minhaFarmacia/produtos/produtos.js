import React, { useState, useEffect } from 'react'
import { Container, Button, Row, Col, Spinner } from 'react-bootstrap'
import PubSub from 'pubsub-js'

import '../styles.css'

import ModalProduto from './modalProduto'
import ModalDetalhes from './modalDetalhes'

import { GoPlus } from 'react-icons/go'
import { TiDelete } from 'react-icons/ti'

import api from '../../../services/api'
import { getToken } from '../../../services/authService'

function Produtos({ farmacia }) {

    const [produtoBuscar, setProdutoBuscar] = useState('')
    const [produtos, setProdutos] = useState([])
    const [produtosList, setProdutosList] = useState([])

    const [showModal, setShowModal] = useState(false)
    const [refreshProdutos, setRefreshProdutos] = useState(true)
    const [token] = useState(getToken('farmacia'))
    const [categorias, setCategorias] = useState([])

    const [showModalDetalhes, setShowModalDetalhes] = useState(false)
    const [modalData, setModalData] = useState({})

    useEffect(() => {
        if (refreshProdutos) {
            (async () => {
                try {
                    const responseProdutos = await api.get(`/farmacias/${farmacia.id_farmacia}/produtos`)

                    setProdutos(responseProdutos.data)
                    setProdutosList(responseProdutos.data)
                    setRefreshProdutos(false)
                } catch (e) {
                    return console.log(e.response)
                }
            })()
        }
    }, [farmacia.id_farmacia, token, refreshProdutos])

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get(`/farmacias/${farmacia.id_farmacia}/categorias`)

                const categoriasConverted = JSON.parse(JSON.stringify(data).split('"id_categoria":').join('"value":').split('"nome":').join('"label":'))

                setCategorias(categoriasConverted)
            } catch (e) {
                return console.log(e.response)
            }
        })()
    }, [farmacia.id_farmacia, token])

    useEffect(() => {
        if (produtoBuscar)
            setProdutosList(produtos.filter((produto, i) => produto.nome.toLowerCase().includes(produtoBuscar.toLowerCase())))
        else if (produtoBuscar === '')
            setProdutosList(produtos)
    }, [produtoBuscar, produtos])

    PubSub.subscribe('refreshProdutos', () => {
        setRefreshProdutos(true)
    })

    return (
        <div id="boxInputs" style={{ paddingBottom: '300px' }}>
            <ModalProduto show={showModal} handleCloseModal={() => setShowModal(false)} farmacia={farmacia} categorias={categorias} />
            <ModalDetalhes show={showModalDetalhes} handleCloseModal={() => setShowModalDetalhes(false)} produto={modalData} />

            <h3 style={{ fontSize: 30, fontWeight: 'bold', color: '#323232', marginBottom: 30, marginTop: 30 }}>Produtos</h3>

            <div style={{ width: '100%', height: 1, border: 'solid 0.1px #ccc' }}></div>

            {produtos.length === 0 && !refreshProdutos ? <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                <p style={{ marginBottom: 5, fontSize: 20, fontWeight: 'bold' }}>Você não tem nenhum produto cadastrado<span style={{ fontWeight: 'normal', fontStyle: 'italic', marginLeft: 10 }}>:(</span></p>

                <p style={{ marginTop: 0, color: "#a3a3a3", fontSize: 18, fontFamily: 'Segoe UI', cursor: 'pointer' }} onClick={() => {
                    setShowModal(true)
                }}>Clique aqui para cadastrar um produto</p>

                <div style={{ width: '100%', height: 1, border: 'solid 0.1px #ccc', marginTop: 12 }}></div>
            </div> : ''}

            <Container style={{ marginTop: 20, display: produtos.length === 0 ? 'none' : 'block', padding: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                    <label className="inputText" style={{ width: '20%', alignSelf: 'flex-end' }}>Buscar</label>

                    <div style={{ width: '80%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', paddingBottom: 10 }}>
                        <Button variant="success" style={{ fontWeight: 500, alignSelf: 'flex-end' }} onClick={() => {
                            setShowModal(true)
                        }}><GoPlus style={{ marginRight: 10, marginTop: -2 }} />Novo Produto</Button>
                    </div>
                </div>

                <input
                    type="text"
                    placeholder="Ex: Amoxicilina"
                    value={produtoBuscar}
                    onChange={e => setProdutoBuscar(e.target.value)}
                />
            </Container>

            <Container id="listaCategorias" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 0 }}>
                <Spinner animation="border" role="status" style={{ marginTop: 100, display: refreshProdutos ? 'block' : 'none' }}>
                    <span className="sr-only">Loading...</span>
                </Spinner>

                {produtosList.map(produto => {
                    return (
                        <div className="categoria" key={produto.id_produto} style={{ width: '100%', display: refreshProdutos ? 'none' : 'block' }}>
                            <Row>
                                <Col md={10} style={{ padding: 10, paddingLeft: 30 }}>
                                    <p className="defaultText" style={{ float: 'left', marginRight: 10 }} >{produto.nome}</p>
                                    <p className="defaultText" style={{ color: '#9e9e9e' }}>R$ {produto.preco.toFixed(2)}</p>
                                </Col>
                                <Col md={2} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <div style={{ color: '#303030', height: '100%' }}>
                                        <Button title="Remover" variant="light" style={{ height: '100%', borderRadius: 0, borderRight: 0 }}
                                            onClick={async () => {
                                                await api.delete(`/farmacias/${farmacia.id_farmacia}/produtos/${produto.id_produto}`)
                                                setRefreshProdutos(true)
                                            }}
                                        >
                                            <TiDelete size={24} style={{ cursor: 'pointer' }} />
                                        </Button>
                                    </div>
                                    <Button variant="light" onClick={() => {
                                        setModalData(produto)
                                        setShowModalDetalhes(true)
                                    }}>
                                        Detalhes
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    )
                })}
            </Container>
        </div>
    )
}

export default Produtos