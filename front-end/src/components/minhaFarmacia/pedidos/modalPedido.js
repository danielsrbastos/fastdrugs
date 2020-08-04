import React, { useState, useEffect } from 'react'
import { Modal, Container, Row, Col, Button } from 'react-bootstrap'
import PubSub from 'pubsub-js'
import socketio from 'socket.io-client'

import api from '../../../services/api'

function ModalPedido({ pedido, show, handleCloseModal, statusColor }) {

    const [confirmarDisabled, setConfirmarDisabled] = useState(true)
    const [transporteDisabled, setTransporteDisabled] = useState(true)
    const [finalizarDisabled, setFinalizarDisabled] = useState(true)
    const [cancelarDisabled, setCancelarDisabled] = useState(true)

    const socket = socketio('http://localhost:3000/pedidos')

    useEffect(() => {
        setConfirmarDisabled(pedido.status === 'analise' ? false : true)
        setTransporteDisabled(pedido.status === 'confirmado' ? false : true)
        setFinalizarDisabled(pedido.status === 'caminho' ? false : true)
        setCancelarDisabled(pedido.status === 'cancelado' || pedido.status === 'finalizado' ? true : false)
    }, [pedido.status])

    return (
        <div>
            {typeof pedido.numero !== 'undefined' ?
                <Modal
                    show={show}
                    onHide={() => {
                        handleCloseModal()
                    }}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <h3 className="defaultText" style={{ color: '#4a4a4a', fontSize: 20, marginBottom: 0, float: 'right', marginRight: 10 }}>Número do pedido:</h3>
                        <h3 className="defaultText" style={{ color: '#7a7a7a', fontSize: 20, marginBottom: 0, float: 'right' }}>{pedido.numero}</h3>
                    </Modal.Header>

                    <Modal.Body style={{ display: 'flex', flexDirection: 'column' }}>
                        <p className="defaultText" style={{ float: 'left', color: '#4a4a4a', marginRight: 10 }}>Produtos:</p>
                        {pedido.produtosPedidos.map(produto => {
                            return (
                                <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 2, marginLeft: 15 }}>
                                    <p className="defaultText" style={{ color: '#8f8f8f' }}>{produto.PedidosProdutos.quantidade}x {produto.nome}</p>
                                </div>
                            )
                        })}

                        <div style={{ width: '100%', height: '0.05px', borderBottom: '1px solid #dee2e6', marginBottom: 15, marginTop: 13 }}></div>

                        <div>
                            <p className="defaultText" style={{ float: 'left', color: '#4a4a4a', marginRight: 10 }}>Valor:</p>
                            <p className="defaultText" style={{ float: 'left', color: '#171717' }}>{(() => {
                                return pedido.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
                            })()}</p>
                        </div>

                        <div>
                            <p className="defaultText" style={{ float: 'left', color: '#4a4a4a', marginRight: 10 }}>Forma de pagamento:</p>
                            <p className="defaultText" style={{ float: 'left', color: '#171717' }}>{pedido.forma_pagamento}</p>
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
                    </Modal.Body>

                    <Modal.Footer>
                        <Row style={{ width: '100%' }}>
                            <Col md={3}>
                                <Button variant="success" style={{ width: '100%' }} disabled={confirmarDisabled} onClick={async () => {
                                    setConfirmarDisabled(true)
                                    setTransporteDisabled(false)
                                    pedido.status = 'confirmado'

                                    await api.put(`/pedidos/${pedido.id_pedido}/updateStatus`, {
                                        status: 'confirmado'
                                    })

                                    socket.emit('pedidoStatus', pedido)
                                    PubSub.publish('pedido', pedido)
                                }}>
                                    Confirmar
                                </Button>
                            </Col>
                            <Col md={3}>
                                <Button variant="warning" style={{ width: '100%' }} disabled={transporteDisabled} onClick={async () => {
                                    setTransporteDisabled(true)
                                    setFinalizarDisabled(false)
                                    pedido.status = 'caminho'

                                    await api.put(`/pedidos/${pedido.id_pedido}/updateStatus`, {
                                        status: 'caminho'
                                    })

                                    socket.emit('pedidoStatus', pedido)
                                    PubSub.publish('pedido', pedido)
                                }}>
                                    Em transporte
                                </Button>
                            </Col>
                            <Col md={3}>
                                <Button variant="success" style={{ width: '100%' }} disabled={finalizarDisabled} onClick={async () => {
                                    setFinalizarDisabled(true)
                                    setCancelarDisabled(true)
                                    pedido.status = 'finalizado'

                                    await api.put(`/pedidos/${pedido.id_pedido}/updateStatus`, {
                                        status: 'finalizado'
                                    })

                                    socket.emit('pedidoStatus', pedido)
                                    PubSub.publish('pedido', pedido)
                                }}>
                                    Finalizar
                                </Button>
                            </Col>
                            <Col md={3}>
                                <Button variant="danger" style={{ width: '100%' }} disabled={cancelarDisabled} onClick={async () => {
                                    setCancelarDisabled(true)
                                    pedido.status = 'cancelado'

                                    await api.put(`/pedidos/${pedido.id_pedido}/updateStatus`, {
                                        status: 'cancelado'
                                    })

                                    socket.emit('pedidoStatus', pedido)
                                    PubSub.publish('pedido', pedido)
                                }}>
                                    Cancelar
                                </Button>
                            </Col>
                        </Row>
                    </Modal.Footer>
                </Modal> :
                <></>
            }
        </div>
    )
}

export default ModalPedido