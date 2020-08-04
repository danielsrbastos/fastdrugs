import React, { useState, useEffect } from 'react'
import { Button, Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import './styles.css'

import { isSignedIn } from '../../services/authService'

import fastDrugs from '../../assets/fastdrugs-white.png'
import search from '../../assets/search.png'
import time from '../../assets/time.png'
import money from '../../assets/money.png'
import paper from '../../assets/paper.png'
import drugstore from '../../assets/farmacias.png'
import user from '../../assets/user-home.png'

import { AiFillHome } from 'react-icons/ai'

import CadastroModal from '../cadastro/cadastroModal'
import LoginModal from '../login/loginModal'

import HeaderCliente from '../listagemFarmacias/header'
import HeaderFarmacia from '../minhaFarmacia/header'
import Rodape from './rodape'

function Home({ history }) {
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

    return (
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

            <Row id="banner">
                <div id="bannerOverlay">
                    <Container fluid={true}>
                        <Row className="justify-content-center">
                            <h2 className="mb-5 text-center">
                                A plataforma das farmácias delivery!
                            </h2>
                        </Row>
                        <Row className="justify-content-center">
                            <Link to="/cadastrar/cliente">
                                <Button variant="light" id="button-farmacias" size="lg">
                                    <span id="button-texto">Farmácias na minha região</span>
                                    <span id="barra-teclado" style={barraTecladoStyle}>l</span>
                                    <img src={search} alt="Buscar" id="search" />
                                </Button>
                            </Link>
                        </Row>
                    </Container>
                </div>
            </Row>
            <Row style={{ backgroundColor: 'white', height: 600 }}>
                <Container className="mt-5 text-center" style={{ height: 100 }}>
                    <h3 className="title" style={{ color: '#202020' }}>
                        A forma mais rápida e prática de comprar medicamentos!
                    </h3>
                    <div style={{ color: '#404040', fontFamily: 'Roboto', fontWeight: 'bold', marginLeft: 10, marginRight: 10, height: 30, marginTop: 20, fontSize: 20 }}>
                        A FastDrugs te ajudará a encontrar os produtos mais perto de você e com o preço em conta!</div>
                </Container>
                <Container style={{ height: 300, display: 'flex', justifyContent: 'center', marginTop: -90 }}>
                    <div class="card p-3" style={{ width: 300, height: 370 }}>
                        <div className="img_card text-center">
                            <img src={time} alt="tempo" />
                        </div>
                        <div class="card-body">
                            <h5 class="card-title text-center" style={{ fontFamily: 'Roboto', color: 'white' }}>Seu tempo é precioso!</h5>
                            <p class="card-text text-center mb-1" style={{ fontFamily: 'Roboto', color: 'white' }}>Sem tempo para ir em farmácias?</p>
                            <p class="card-text text-center" style={{ fontFamily: 'Roboto', color: '#ccc' }}>
                                A FastDrugs oferece uma lista das farmácias próximas a você.
                            </p>
                        </div>
                    </div>
                    <div class="card p-3" style={{ width: 300, marginLeft: 30, marginRight: 30, height: 370 }}>
                        <div className="img_card text-center">
                            <img src={money} alt="tempo" />
                        </div>
                        <div class="card-body">
                            <h5 class="card-title text-center" style={{ fontFamily: 'Roboto', color: 'white' }}>As vendas estão baixas?</h5>
                            <p class="card-text text-center mb-1" style={{ fontFamily: 'Roboto', color: 'white' }}>Querendo aumentar as vendas?</p>
                            <p class="card-text text-center" style={{ fontFamily: 'Roboto', color: '#ccc' }}>
                                A FastDrugs oferece uma simples e prática plataforma para donos de farmácias venderem seus produtos.
                            </p>
                        </div>
                    </div>
                    <div class="card p-3" style={{ width: 300, height: 370 }}>
                        <div className="img_card text-center">
                            <img src={paper} alt="tempo" />
                        </div>
                        <div class="card-body">
                            <h5 class="card-title text-center" style={{ fontFamily: 'Roboto', color: 'white' }}>Receita médica</h5>
                            <p class="card-text text-center mb-1" style={{ fontFamily: 'Roboto', color: 'white' }}>Tem alguma receita médica?</p>
                            <p class="card-text text-center" style={{ fontFamily: 'Roboto', color: '#ccc' }}>A FastDrugs oferece uma maneira simples de enviar sua receita médica a alguma farmácia, agilizando muito sua compra.</p>
                        </div>
                    </div>
                </Container>
            </Row>
            <Row className="img_background">
                <div className="img_mask">
                    <Container style={{ backgroundColor: '#fff', height: '65%', display: 'flex', borderRadius: 10, marginTop: 120 }}>
                        <Col className="img_logo_empresa" md={6}>
                        </Col>
                        <Col md={6}>
                            <h3 className="title text-center" style={{ fontStyle: 'italic', color: '#000', marginTop: 120, marginBottom: 30 }}>
                                Fast Drugs
                            </h3>
                            <div style={{ width: 500, height: 300, marginRight: 'auto', marginLeft: 'auto' }}>
                                <p style={{ fontFamily: 'Roboto', color: '#303030', fontSize: 20, textAlign: 'center' }}>A FastDrugs é uma plataforma desenvolvida para ajudar o mercado farmacêutico. A plataforma tem por objetivo auxiliar pequenas farmácias a aumentarem suas vendas em que utilizariam nossa plataforma para vender seus produtos.</p>
                            </div>
                        </Col>
                    </Container>
                </div>
            </Row>
            <Row className="mb-5" style={{ height: 500, backgroundColor: 'white' }}>
                <Container className="text-center">
                    <h3 className="title mt-5" style={{ color: '#202020' }}>
                        Experiências na plataforma
                    </h3>
                    <div style={{ color: '#404040', fontFamily: 'Roboto', fontWeight: 'bold', marginLeft: 10, marginRight: 10, height: 30, marginTop: 20, fontSize: 20 }}>
                        Nossa plataforma oferece dois tipos de experiências de acordo com o tipo de usuário.</div>
                </Container>
                <Container style={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                    <div class="card" style={{ width: 300 }}>
                        <div className="img_card text-center">
                            <img src={user} alt="tempo" />
                        </div>
                        <div class="card-body">
                            <h5 class="card-title text-center" style={{ fontFamily: 'Roboto', color: 'white' }}>Experiência - Cliente</h5>
                            <p class="card-text text-center" style={{ fontFamily: 'Roboto', color: 'white' }}>Para usuários que estão querendo comprar seus produtos o mais perto de casa.</p>
                            <Link to="/experiencia-usuario">
                                <div style={{ marginTop: 10, width: '100%', textAlign: "right", textDecoration: 'none', color: '#ccc' }}>+ Detalhes</div>
                            </Link>
                        </div>
                    </div>
                    <div class="card" style={{ width: 300, marginLeft: 20 }}>
                        <div className="img_card text-center">
                            <img src={drugstore} alt="tempo" />
                        </div>
                        <div class="card-body">
                            <h5 class="card-title text-center" style={{ fontFamily: 'Roboto', color: 'white' }}>Experiência - Farmácia</h5>
                            <p class="card-text text-center" style={{ fontFamily: 'Roboto', color: 'white' }}>Para usuários que estão procurando aumentar as vendas e clientes de sua farmácia.</p>
                            <Link to="/experiencia-usuario">
                                <div style={{ marginTop: 10, width: '100%', textAlign: "right", textDecoration: 'none', color: '#ccc', marginBottom: 'auto' }}> + Detalhes</div>
                            </Link>
                        </div>
                    </div>
                </Container>
            </Row>

            <Container>
                <div style={{ marginLeft: 25, width: '100%', height: 1, border: 'solid 0.1px #ccc', marginTop: 23, marginBottom: 20 }}></div>
            </Container>

            <Row style={{ height: 100, backgroundColor: 'white', color: '#002060' }}>
                <Container>
                    <h3 className="title mt-5" style={{ color: '#202020' }}>
                        Baixe nosso aplicativo!
                    </h3>
                </Container>
            </Row>
            <Row style={{ height: 850, backgroundColor: 'white', color: '#002060' }}>
                <Container>
                    <div className="smartphone mt-5">
                        <div className="smartphone-top">
                            <div className="smartphone-top-camera"></div>
                            <div className="smartphone-top-mic"></div>
                        </div>
                        <div className="smartphone-tela">
                            <div className="slide"></div>
                        </div>
                        <div className="smartphone-bottom">
                            <div className="smartphone-bottom-button"></div>
                        </div>
                    </div>
                </Container>
            </Row>
            <Row style={{ height: 100 }}>
                <Container className="text-center">
                    <div style={{ color: '#303030', fontFamily: 'Roboto', fontWeight: 'bold', marginLeft: 'auto', marginRight: 'auto', height: 30, width: 700, marginTop: 20, fontSize: 20 }}>
                        Você pode baixar nosso aplicativo <b style={{ cursor: 'pointer', textDecoration: 'underline' }}>clicando aqui</b>. Nosso aplicativo é completamente voltado aos usuários com a <b style={{ fontStyle: 'italic' }}>Conta Cliente</b>.</div>
                </Container>
            </Row>
            <Rodape />
        </div>
    );
}

export default Home