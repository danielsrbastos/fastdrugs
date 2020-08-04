import React, { useState } from 'react'
import { Row, Container, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import './styles.css'

import fastDrugs from '../../assets/fastdrugs-white.png'

import CadastroModal from '../cadastro/cadastroModal'
import LoginModal from '../login/loginModal'

function NotFoundBox({ history }) {

    const [showCadastro, setShowCadastro] = useState(false)
    const [showLogin, setShowLogin] = useState(false)

    return (
        <div id="main">
            <CadastroModal show={showCadastro} handleClose={() => setShowCadastro(false)} history={history} />
            <LoginModal show={showLogin} handleClose={() => setShowLogin(false)} history={history} />

            <Row id="header">
                <Container>
                    <Col md={8}>
                        <Link to="/">
                            <img src={fastDrugs} alt="Fast Drugs" id="fastDrugs" />
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

            <div id="boxNotFound">
                <h1>404</h1>
                <p>Ooops! Parece que você virou errado em algum lugar.</p>
            </div>
        </div>
    )
}

export default NotFoundBox