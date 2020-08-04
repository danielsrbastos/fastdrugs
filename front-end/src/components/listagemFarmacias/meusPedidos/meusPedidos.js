import React, { useState, useEffect } from 'react'
import { Container, Button, Modal, Row, Col } from 'react-bootstrap'
import { Redirect, Link } from 'react-router-dom'

import socketio from 'socket.io-client'

import Header from '../header'

import api from '../../../services/api'
import { getToken, signOut, checkSession, getIdEndereco, getId, setTokenAsDefaultHeader } from '../../../services/authService'

import gifOrderRealized from '../../../assets/gifOrderRealized.gif'

function MeusPedidos({ location }) {

    const [pedidos, setPedidos] = useState([])

    const [refreshPedidos, setRefreshPedidos] = useState(true)
    const [expiredSession, setExpiredSession] = useState(false)
    const [orderRealized, setOrderRealized] = useState(location.state ? (location.state.orderRealized ? true : false) : false)

    const [show, setShow] = useState(orderRealized)

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
        (async () => {
            if (!checkSession(getToken('cliente')))
                return setExpiredSession(true)

            setTokenAsDefaultHeader()

            if (refreshPedidos) {
                try {
                    const response = await api.get(`/pedidos/clientes/${getId('cliente')}`)

                    setPedidos(response.data)
                    setRefreshPedidos(false)
                } catch (e) {
                    return console.log(e.response)
                }
            }
        })()
    }, [refreshPedidos])

    return (
        <div>
            {expiredSession ? (() => {
                signOut('cliente')
                return (<Redirect to={{ pathname: '/entrar/cliente', state: { expiredSession: true } }}></Redirect>)
            })() : ''}

            <Modal
                show={show}
                onHide={() => setShow(false)}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>

                </Modal.Header>

                <Modal.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={gifOrderRealized} alt="Pedido realizado" style={{ width: 400, height: 'auto', marginBottom: 10 }} />
                    <h5 style={{ marginBottom: 50, width: 300, textAlign: 'center' }}>
                        Seu pedido na
                        <span style={{ fontWeight: 'bold' }}> {location.state ? location.state.farmacia.nome : ''} </span>
                        foi realizado :)
                    </h5>
                </Modal.Body>
            </Modal>

            <Header />

            <Container>
                <h3 style={{ fontSize: 30, fontWeight: 'bold', color: '#323232', marginBottom: 20, marginTop: 30 }}>Meus Pedidos</h3>

                <div style={{ width: '100%', height: 1, border: 'solid 0.1px #ccc', marginBottom: 20 }}></div>

                {pedidos.length === 0 ? <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <p style={{ marginBottom: 5, fontSize: 20, fontWeight: 'bold' }}>Você ainda não fez nenhum pedido<span style={{ fontWeight: 'normal', fontStyle: 'italic', marginLeft: 5 }}>:(</span></p>

                    <Link to="/lista-farmacias" style={{ marginTop: 0, color: "#a3a3a3" }}>Clique aqui para descobrir as farmácias na sua região</Link>

                    <div style={{ width: '100%', height: 1, border: 'solid 0.1px #ccc', marginTop: 23 }}></div>
                </div> : ''}

                <Container id="listaCategorias" style={{ display: pedidos.length === 0 ? 'none' : 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {pedidos.map(pedido => {
                        const socket = socketio('http://localhost:3000/pedidos')
                        socket.on(`pedidoStatus-${pedido.id_pedido}`, pedidoSocket => {
                            setPedidos([ ...pedidos.filter(p => p.id_pedido !== pedido.id_pedido), { ...pedido, status: pedidoSocket.status } ])
                        })

                        return (
                            <div className="categoria" key={pedido.id_pedido} style={{ width: '100%', display: refreshPedidos ? 'none' : 'block', padding: 15 }}>
                                <Row>
                                    <Col md={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <img style={{ width: '100%' }} src={pedido.produtosPedidos[0].produtosFarmacia.url_imagem} alt="Farmácia" />
                                    </Col>
                                    <Col md={10} style={{ padding: 10, display: 'flex', flexDirection: 'column' }}>
                                        <div>
                                            <p className="defaultText" style={{ float: 'left', color: '#4a4a4a', marginRight: 10 }}>Seu pedido em:</p>
                                            <p className="defaultText" style={{ float: 'left', color: '#7a7a7a' }}>{pedido.produtosPedidos[0].produtosFarmacia.nome}</p>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                                            <div style={{ alignSelf: 'flex-end', width: '100%', display: 'flex', flexDirection: 'column' }}>
                                                <div style={{ width: '100% ' }}>
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

                                                <div style={{ width: '100% ' }}>
                                                    <p className="defaultText" style={{ float: 'left', color: '#171717', marginRight: 10 }}>Data:</p>
                                                    <p className="defaultText" style={{ float: 'left', color: '#171717' }}>{(() => {
                                                        const date = new Date(pedido.createdAt)
                                                        const dateSplitted = date.toString().split(' ')

                                                        return `${date.getDate()}/${date.getMonth().toString().length === 1 ? '0' + (date.getMonth() + 1) : date.getMonth()}/${date.getFullYear()} às ${dateSplitted[4].substring(0, 5)}`
                                                    })()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        )
                    })}
                </Container>
            </Container>
        </div>
    )
}

export default MeusPedidos