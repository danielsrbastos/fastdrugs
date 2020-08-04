import React, { useState, useEffect } from 'react'
import { Container, Button, Row, Col, Spinner } from 'react-bootstrap'
import Select from 'react-select'
import PubSub from 'pubsub-js'

import ModalPedido from './modalPedido'

import { selectTheme } from '../../themes'
import '../styles.css'

import api from '../../../services/api'

import { getToken } from '../../../services/authService'
import { dataMask } from '../../../utils/fieldsMask'

function Pedidos({ farmacia }) {

    const [pedidos, setPedidos] = useState([])

    const [modalData, setModalData] = useState({})
    const [showModal, setShowModal] = useState(false)

    const [token] = useState(getToken('farmacia'))
    const [refreshPedidos, setRefreshPedidos] = useState(true)
    const [disabledButton, setDisabledButton] = useState(false)

    const statusColor = status => {
        if (status === "analise") {
            return '#cc3535'
        } else if (status === "confirmado") {
            return '#28a745'
        } else if (status === "caminho") {
            return '#ffc107'
        } else if (status === "finalizado") {
            return '#05b52e'
        } else if (status === "cancelado") {
            return '#7a7a7a'
        }

        return '#7a7a7a'
    }

    useEffect(() => {
        if (refreshPedidos) {
            (async () => {
                try {
                    const responsePedidos = await api.get(`/pedidos/farmacias/${farmacia.id_farmacia}`)

                    setPedidos(responsePedidos.data)
                    setRefreshPedidos(false)
                } catch (e) {
                    if (e.response.status === 404) {
                        setPedidos([])
                        setRefreshPedidos(false)
                    }

                    return console.log(e.response)
                }
            })()
        }
    }, [farmacia.id_farmacia, refreshPedidos])

    PubSub.subscribe("pedido", (msg, pedidoFromModal) => {
        setRefreshPedidos(true)
    })

    PubSub.subscribe("newOrder", () => {
        setRefreshPedidos(true)
    })

    return (
        <div id="boxInputs" style={{ paddingBottom: '300px' }}>
            <ModalPedido show={showModal} handleCloseModal={() => setShowModal(false)} pedido={modalData} statusColor={statusColor} />

            {/* <Container><div style={{ width: '100%', height: 1, border: 'solid 0.1px #ccc', marginTop: 30 }}></div></Container> */}

            <h3 style={{ fontSize: 30, fontWeight: 'bold', color: '#323232', marginBottom: 30, marginTop: 30 }}>Pedidos</h3>

            <div style={{ width: '100%', height: 1, border: 'solid 0.1px #ccc', marginBottom: 30 }}></div>

            {pedidos.length === 0 && !refreshPedidos ? <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <p style={{ marginBottom: 5, fontSize: 20, fontWeight: '700' }}>Você não tem nenhum pedido<span style={{ fontWeight: 'normal', fontStyle: 'italic', marginLeft: 10 }}>:(</span></p>

                <div style={{ width: '100%', height: 1, border: 'solid 0.1px #ccc', marginTop: 23 }}></div>
            </div> : ''}

            <Container id="listaCategorias" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 0 }}>
                <Spinner animation="border" role="status" style={{ marginTop: 300, display: refreshPedidos ? 'block' : 'none' }}>
                    <span className="sr-only">Loading...</span>
                </Spinner>

                {pedidos.map(pedido => {
                    return (
                        <div className="categoria" key={pedido.id_pedido} style={{ width: '100%', display: refreshPedidos ? 'none' : 'block' }}>
                            <Row>
                                <Col md={10} style={{ padding: 10, paddingLeft: 30, display: 'flex', flexDirection: 'column' }}>
                                    <div>
                                        <p className="defaultText" style={{ float: 'left', color: '#4a4a4a', marginRight: 10 }}>Número do pedido:</p>
                                        <p className="defaultText" style={{ float: 'left', color: '#7a7a7a' }}>{pedido.numero}</p>
                                    </div>

                                    <div>
                                        <p className="defaultText" style={{ float: 'left', color: '#4a4a4a', marginRight: 10 }}>Status:</p>
                                        <p className="defaultText" style={{ float: 'left', color: statusColor(pedido.status) }}>{(() => {
                                            if (pedido.status === "analise") {
                                                return "Aguardando confirmação"
                                            } else if (pedido.status === "confirmado") {
                                                return "Separando os produtos"
                                            } else if (pedido.status === "caminho") {
                                                return "Em transporte"
                                            } else if (pedido.status === "finalizado") {
                                                return "Finalizado"
                                            } else if (pedido.status === "cancelado") {
                                                return "Cancelado"
                                            }
                                        })()}</p>
                                    </div>

                                    <div>
                                        <p className="defaultText" style={{ float: 'left', color: '#171717', marginRight: 10 }}>Data:</p>
                                        <p className="defaultText" style={{ float: 'left', color: '#171717' }}>{(() => {
                                            const date = new Date(pedido.createdAt)
                                            const dateSplitted = date.toString().split(' ')

                                            return `${date.getDate()}/${date.getMonth().toString().length === 1 ? '0' + (date.getMonth() + 1) : date.getMonth()}/${date.getFullYear()} às ${dateSplitted[4].substring(0, 5)}`
                                        })()}</p>
                                    </div>
                                </Col>
                                <Col md={2} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <div style={{ color: '#303030', height: '100%' }}>

                                    </div>

                                    <Button variant="light" title="Detalhes" style={{ height: '100%', borderRadius: 0 }}
                                        onClick={() => {
                                            pedido.nomeFarmacia = farmacia.nome
                                            setModalData(pedido)
                                            setShowModal(true)
                                        }}
                                    >
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

export default Pedidos