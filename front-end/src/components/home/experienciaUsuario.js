import React, { useState, useEffect } from 'react'
import { Button, Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import './styles.css'

import { isSignedIn } from '../../services/authService'

import fastDrugs from '../../assets/fastdrugs-white.png'
import drugstore from '../../assets/farmacias.png'
import user from '../../assets/user-home.png'

import { AiFillHome } from 'react-icons/ai'

import CadastroModal from '../cadastro/cadastroModal'
import LoginModal from '../login/loginModal'

import HeaderCliente from '../listagemFarmacias/header'
import HeaderFarmacia from '../minhaFarmacia/header'
import Rodape from './rodape'

function ExperienciaUsuario ({history}){

    const [barraTecladoStyle, setbarraTecladoStyle] = useState({ visibility: 'hidden' })
    const [showCadastro, setShowCadastro] = useState(false)
    const [showLogin, setShowLogin] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            if (barraTecladoStyle.visibility === 'hidden')
                setbarraTecladoStyle({ visibility: 'visible' })
            else
                setbarraTecladoStyle({ visibility: 'hidden' })
        }, 500)
    }, [barraTecladoStyle])

    return(
        <div>
             <CadastroModal show={showCadastro} handleClose={() => setShowCadastro(false)} history={history} />
            <LoginModal show={showLogin} handleClose={() => setShowLogin(false)} history={history} />

            {isSignedIn('cliente') ? (
                <HeaderCliente />
            ) : (isSignedIn('farmacia') ? (
                <HeaderFarmacia />
            ) : (
                    <Row id="header">
                        <Container>
                            <Col md={8}>
                                <Link to="/" style={{ width: 120 }}>
                                    <img src={fastDrugs} alt="Fast Drugs" id="fastDrugs" />
                                </Link>

                                <Link className="headerLink" to="/" style={{ width: 140, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }} >
                                    <div style={{ marginRight: 10, width: 18 }}>
                                        <AiFillHome />
                                    </div>
                                    Página Inicial
                                </Link>

                                
                            </Col>
                            <Col md={2}>
                                <Button variant="outline-light" onClick={() => setShowCadastro(true)}>
                                    Cadastre-se
                                </Button>
                            </Col>
                            <Col md={2}>
                                <Button variant="light" onClick={() => setShowLogin(true)}>
                                    Entrar
                                </Button>
                            </Col>
                        </Container>
                    </Row>
                ))}

                <Row>
                    <Container className="mt-5">
                        <h5 style={{fontSize: 40, fontFamily: 'Roboto', fontWeight: 'bold', color: 'black'}}>Tipos de experiência de usuário</h5>
                    </Container>
                    <Container className="mt-2 pl-5">
                        <p style={{fontSize: 20, fontFamily: 'Roboto', textAlign: 'justify'}}>
                            A FastDrugs oferece dois tipos de experiências para nossos usuários de acordo com o tipo de conta. Em nossa plataforma temos dois tipos de conta: <b>Conta Cliente</b> e <b>Conta Farmácia</b>. Cada conta oferece um tipo de experiência.</p>
                    </Container>
                </Row>

                <Row className="mt-5">
                    <Container style={{backgroundColor: '#002060', height: 240, borderRadius: 10}}>
                        <Container className="mt-4">
                            <h5 style={{fontSize: 30, fontFamily: 'Roboto', fontWeight: 'bold', color: 'white'}}>Conta Cliente</h5>
                        </Container>
                        <Container className="mt-3" style={{display: 'flex'}}>
                            <Col md={3}> <div className="text-center mt-4"><img src={user} alt="cliente" /></div></Col>
                            <Col md={9} style={{fontSize: 20, fontFamily: 'Roboto', color: 'white'}}>A Conta Cliente oferece uma experiência gratuita em que qualquer usuário pode se cadastrar com este tipo de conta. Esta permite o usuário buscar e comprar seus produtos e medicamentos nas farmácias mais próximas a seu endereço facilitando e agilizando seu momento de compra.</Col>
                        </Container>
                    </Container>
                </Row>
                
                <Row className="mt-5">
                <Container>
                <div style={{ marginLeft: -15, width: '100%', height: 1, border: 'solid 0.1px #ccc' }}></div>
                </Container>
                </Row>

                <Row className="mt-5">
                    <Container style={{backgroundColor: '#002060', height: 270, borderRadius: 10}}>
                        <Container className="mt-4">
                            <h5 style={{fontSize: 30, fontFamily: 'Roboto', fontWeight: 'bold', color: 'white'}}>Conta Farmácia</h5>
                        </Container>
                        <Container className="mt-3" style={{display: 'flex'}}>
                            <Col md={3}> <div className="text-center mt-4"><img src={drugstore} alt="farmacia" /></div></Col>
                            <Col md={9} style={{fontSize: 20, fontFamily: 'Roboto', color: 'white'}}>A Conta Farmácia oferece uma experiência para donos de farmácias que estão buscando aumentar suas vendas e seus clientes. Diferentemente esse tipo de experiência apresenta uma taxação para a farmácia em que é cobrado 7% do valor total de algum pedido feito pela nossa plataforma e uma mensalidade de R$ 70,00 se o estabelecimento faturar R$ 1000,00 pela plataforma.</Col>
                        </Container>
                    </Container>
                </Row>

                <Rodape />
        </div>
    )
}

export default ExperienciaUsuario