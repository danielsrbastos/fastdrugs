import React, { useState, useEffect } from 'react'
import { Row, Container, Button, Col, Alert } from 'react-bootstrap'
import { Redirect, Link } from 'react-router-dom'
import socketio from 'socket.io-client'
import Uifx from 'uifx'
import PubSub from 'pubsub-js'

import './styles.css'
import '../login/farmacia/styles.css'

import on from '../../assets/on.png'
import off from '../../assets/off.png'

import { AiFillHome } from 'react-icons/ai'
import { GiOverdose } from 'react-icons/gi'
import { FaBoxOpen, FaMoneyCheck, FaListUl } from 'react-icons/fa'
import { BsPersonFill } from 'react-icons/bs'
import { GoListUnordered } from 'react-icons/go'
import { RiFilePaper2Line } from 'react-icons/ri'

import notificationSound from '../../assets/notificationSound.mp3'

import api from '../../services/api'
import { signOut, getToken, getId, checkSession, setTokenAsDefaultHeader } from '../../services/authService'

import Produtos from './produtos/produtos'
import Lotes from './lotes/lotes'
import Categorias from './categorias'
import FarmaciaDados from './farmaciaDados'
import FormasPagamento from './formasPagamento'
import Pedidos from './pedidos/pedidos'
import ReceitaMedica from './receitaMedica/receitaMedica'

import ButtonSair from '../buttons/buttonSair'

function MinhaFarmaciaBox() {

    const [id] = useState(getId('farmacia'))
    const [token, setToken] = useState(getToken('farmacia'))
    const [farmacia, setFarmacia] = useState({})

    const [statusImg, setStatusImg] = useState(off)
    const [page, setPage] = useState('pedidos') // pedidos
    const [showMenuLateral, setShowMenuLateral] = useState(true)

    const [expiredSession, setExpiredSession] = useState(false)

    const [socketPedidos] = useState(socketio('http://localhost:3000/pedidos'))
    const [socketRecipes] = useState(socketio('http://localhost:3000/receitas'))
    const [showOrderAlert, setShowOrderAlert] = useState(false)
    const [showRecipeAlert, setShowRecipeAlert] = useState(false)
    const [receivedRecipes, setReceivedRecipes] = useState([])

    const notification = new Uifx(notificationSound, { volume: 0.05 })

    const [lengthNewMessages, setLengthNewMessages] = useState(0)

    useEffect(() => {
        (async () => {
            if (!checkSession(token))
                return setExpiredSession(true)

            setTokenAsDefaultHeader()

            try {
                const { data } = await api.get(`/farmacias/${id}`)
                setFarmacia(data)
                setStatusImg(data.status ? on : off)

                // Socket.io
                socketRecipes.emit('setPharmacy', {
                    name: data.nome,
                    email: data.email,
                    pharmacyId: data.id_farmacia
                })

                socketRecipes.on('received', recipe => {
                    notification.play()
                    setShowRecipeAlert(true)

                    setReceivedRecipes([...receivedRecipes, recipe])
                })
            } catch (e) {
                if (e.response && e.response.data.error === 'token_invalid')
                    return setExpiredSession(true)

                return console.log(e)
            }
        })()
    }, [])

    useEffect(() => {
        if (farmacia) {
            socketPedidos.on(`newPedido-${farmacia.id_farmacia}`, () => {
                notification.play()
                setShowOrderAlert(true)

                PubSub.publish("newOrder")
            })
        }
    }, [farmacia, notification, socketPedidos])

    return (
        <div>
            {expiredSession ? (() => {
                signOut('farmacia')
                return (<Redirect to={{ pathname: '/entrar/farmacia', state: { expiredSession: true } }}></Redirect>)
            })() : ''}

            <Alert show={showOrderAlert} variant="success" style={{ position: 'fixed', width: '150', right: 30, bottom: 5 }}>
                <Alert.Heading>Yay!</Alert.Heading>
                <p>
                    Um novo pedido foi efetuado :)
                </p>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={() => setShowOrderAlert(false)} variant="outline-success">
                        Ok
                    </Button>
                </div>
            </Alert>

            <Alert show={showRecipeAlert} variant="success" style={{ position: 'fixed', width: '150', right: 30, bottom: 5 }}>
                <Alert.Heading>Yay!</Alert.Heading>
                <p>
                    Uma nova receita foi enviada para analise :)
                </p>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={() => setShowRecipeAlert(false)} variant="outline-success">
                        Ok
                    </Button>
                </div>
            </Alert>

            <Row id="header" style={{ position: 'fixed', top: 0 }}>
                <Col md={9}>
                    <div id="menuIconBox" onClick={() => showMenuLateral ? setShowMenuLateral(false) : setShowMenuLateral(true)}>
                        <div className="menuIconItem" style={{ marginBottom: 3 }}></div>
                        <div className="menuIconItem" style={{ marginBottom: 3 }}></div>
                        <div className="menuIconItem"></div>
                    </div>

                    <h5 style={{ color: 'white', marginBottom: 0, fontWeight: '700', userSelect: 'none' }}>{farmacia.nome}</h5>

                    <Link className="headerLink" to="/" style={{ marginLeft: 30, width: 140, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <div style={{ marginRight: 10, width: 18 }}>
                            <AiFillHome />
                        </div>
                        Página Inicial
                    </Link>
                </Col>
                <Col md={2} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Button variant="outline-light" style={{ display: 'flex', justifyContent: 'center' }} onClick={async () => {
                        await api.put(`/farmacias/${id}`, { status: statusImg === on ? false : true })
                        statusImg === on ? setStatusImg(off) : setStatusImg(on)
                    }}>
                        Recebendo pedidos:
                        <span className="text-right"><img style={{ width: 'auto', height: 20, cursor: 'pointer', marginLeft: 10, marginTop: -3 }} src={statusImg} alt="Status" /></span>
                    </Button>
                </Col>
                <Col md={1}>
                    <ButtonSair type="farmacia" />
                </Col>
            </Row>

            <div id="menuLateral" style={{ width: showMenuLateral ? 220 : 0, transition: '0.4s', visibility: showMenuLateral ? 'visible' : 'hidden', textAlign: 'left' }}>
                <div className="menuItem" onClick={() => setPage('pedidos')} style={{ height: 70, background: page === 'pedidos' ? (showMenuLateral ? '#1f1e1e' : '') : '', display: 'flex', justifyContent: 'center', paddingLeft: 0 }}>
                    <div style={{ marginRight: 10 }}>
                        <GoListUnordered />
                    </div>
                    <span style={{ marginTop: 3 }}>Pedidos</span>
                </div>

                <div className="menuItem" onClick={() => setPage('produtos')} style={{ height: 70, background: page === 'produtos' ? (showMenuLateral ? '#1f1e1e' : '') : '', display: 'flex', justifyContent: 'center', paddingLeft: 0 }}>
                    <div style={{ marginRight: 10 }}>
                        <GiOverdose />
                    </div>
                    <span style={{ marginTop: 3 }}>Produtos</span>
                </div>

                {/* <div className="menuItem" onClick={() => setPage('lotes')} style={{ height: 70, background: page === 'lotes' ? (showMenuLateral ? '#1f1e1e' : '') : '', display: 'flex', justifyContent: 'center', paddingLeft: 0 }}>
                    <div style={{ marginRight: 10 }}>
                        <FaBoxOpen />
                    </div>
                    <span style={{ marginTop: 3 }}>Lotes</span>
                </div> */}

                <div className="menuItem" onClick={() => setPage('categorias')} style={{ height: 70, background: page === 'categorias' ? (showMenuLateral ? '#1f1e1e' : '') : '', display: 'flex', justifyContent: 'center', paddingLeft: 0 }}>
                    <div style={{ marginRight: 10 }}>
                        <FaListUl />
                    </div>
                    <span style={{ marginTop: 3 }}>Categorias</span>
                </div>

                <div className="menuItem" onClick={() => setPage('formasPagamento')} style={{ height: 70, background: page === 'formasPagamento' ? (showMenuLateral ? '#1f1e1e' : '') : '', display: 'flex', justifyContent: 'center', paddingLeft: 0 }}>
                    <div style={{ marginRight: 15 }}>
                        <FaMoneyCheck />
                    </div>
                    <span style={{ marginTop: 3, width: 100 }}>Formas de Pagamento</span>
                </div>

                <div className="menuItem" onClick={() => setPage('receitaMedica')} style={{ height: 70, background: page === 'receitaMedica' ? (showMenuLateral ? '#1f1e1e' : '') : '', display: 'flex', justifyContent: 'center', paddingLeft: 0 }}>
                    <div style={{ marginRight: 10 }}>
                        <RiFilePaper2Line />
                    </div>
                    <span style={{ marginTop: 3 }}>Receitas Médicas</span>
                </div>

                <div className="menuItem" onClick={() => setPage('farmaciaDados')} style={{ height: 70, background: page === 'farmaciaDados' ? (showMenuLateral ? '#1f1e1e' : '') : '', display: 'flex', justifyContent: 'center', paddingLeft: 0 }}>
                    <div style={{ marginRight: 10 }}>
                        <BsPersonFill />
                    </div>
                    <span style={{ marginTop: 3 }}>Meus Dados</span>
                </div>
            </div>

            <Container style={{ paddingTop: '6.5vh' }}>
                {(() => {
                    if (farmacia.id_farmacia) {
                        if (page === 'produtos')
                            return <Produtos farmacia={farmacia} />
                        else if (page === 'lotes')
                            return <Lotes farmacia={farmacia} />
                        else if (page === 'categorias')
                            return <Categorias farmacia={farmacia} />
                        else if (page === 'farmaciaDados')
                            return <FarmaciaDados farmacia={farmacia} />
                        else if (page === 'formasPagamento')
                            return <FormasPagamento farmacia={farmacia} />
                        else if (page === 'pedidos')
                            return <Pedidos farmacia={farmacia} />
                        else if (page === 'receitaMedica')
                            return <ReceitaMedica farmacia={farmacia} socket={socketRecipes} receivedRecipes={[...new Set(receivedRecipes)]} />
                    }
                })()}
            </Container>
        </div>
    )
}

export default MinhaFarmaciaBox