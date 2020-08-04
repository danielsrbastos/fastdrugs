import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Button, Container, Col, Modal } from 'react-bootstrap'
import emailValidator from 'email-validator'

import '../farmacia/styles.css'
import './styles.css'

import facebookLogo from '../../../assets/facebook.png'
import googleLogo from '../../../assets/google.png'
import fastDrugs from '../../../assets/fastdrugs-white-horizontal.png'
import farmacia from '../../../assets/farmacia.png'

import { signIn } from '../../../services/authService'
import CestaDeCompras from '../../../services/cestaService'

function LoginClienteBox({ history, location }) {

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [invalidEmail, setInvalidEmail] = useState(false)
    const [invalidSenha, setInvalidSenha] = useState(false)
    const [error, setError] = useState(false)

    const [disabledButton, setDisabledButton] = useState(false)

    const [redirect, setRedirect] = useState(false)
    const [expiredSession, setExpiredSession] = useState(location.state ? (location.state.expiredSession ? true : false) : false)

    const handleSubmit = async e => {
        e.preventDefault()
    
        setDisabledButton(true)
        let invalidFields = false
        
        if (email === '') {
            setInvalidEmail(true)
            invalidFields = true
        }

        if (senha === '') {
            setInvalidSenha(true)
            invalidFields = true
        }

        if (invalidEmail || invalidSenha || invalidFields) {
            setDisabledButton(false)
            return false
        }

        const res = await signIn({ email, senha }, 'cliente')

        if (res) {
            CestaDeCompras.init()
            return setRedirect(true)
        }
        
        setError(true)
        setDisabledButton(false)
    }

    useEffect(() => {
        setError(false)
        
        /* Email */
        if (email !== '' && !emailValidator.validate(email))
            setInvalidEmail(true)
        else if (email !== '')
            setInvalidEmail(false)

        /* Senha */
        if (senha !== '')
            setInvalidSenha(false)
    }, [email, senha])

    return (
        <div id="box">
            {redirect ? <Redirect to={{ pathname: '/lista-farmacias' }} /> : ''}

            <Modal show={expiredSession} onHide={() => setExpiredSession(false)} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Body>
                    <h6 className="text-center">Sua sessão expirou, efetue o login novamente.</h6>
                </Modal.Body>

                <Button variant="dark" onClick={() => setExpiredSession(false)} style={{ borderRadius: 0 }} >Ok</Button>
            </Modal>

            <Col id="boxLeft" md={4}>
                <div>
                    <div id="title" className="text-center">Bem-vindo(a) de volta!</div>
                    <div id="subtitle" className="text-center">Faça suas compras aqui!</div>
                </div>

                <form id="boxInputs" onSubmit={handleSubmit}>
                    <Container>
                        <label className="inputText">E-mail</label>
                        <input
                            type="text" 
                            placeholder="cliente@fastdrugs.com.br" 
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                            style={invalidEmail || error ? { border: '1px solid #dc3545' } : { border: 'solid 1px #ccc' }}
                        />
                        {invalidEmail ? <div className="invalid-feedback">Digite um e-mail válido.</div> : ''}
                    </Container>

                    <Container>
                        <label className="inputText">Senha</label>
                        <input
                            type="password"
                            placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                            onChange={e => setSenha(e.target.value)}
                            value={senha}
                            style={invalidSenha || error ? { border: '1px solid #dc3545' } : { border: 'solid 1px #ccc' }}
                        />
                        {error ? <div className="invalid-feedback text-center mt-3">E-mail e/ou senha inválidos.</div> : ''}
                        {invalidSenha ? <div className="invalid-feedback">Digite uma senha.</div> : ''}
                    </Container>

                    <Container>
                        <Button variant="primary" id="btnEntrar" className="transition" type="submit" disabled={disabledButton ? 'disabled' : ''}>ENTRAR</Button>
                    </Container>

                    <Container id="boxOr" className="mb-4">
                        <div id="boxTextOr">OU</div>
                    </Container>

                    <Container>
                        <Button id="loginFacebook">
                            <Col md={2} id="logoFacebook">
                                <img src={facebookLogo} alt="Facebook logo" />
                            </Col>
                            <Col md={10} id="textFacebook">
                                ENTRAR COM O FACEBOOK
                            </Col>
                        </Button>
                    </Container>

                    <Container>
                        <Button id="loginGoogle">
                            <Col md={2} id="logoGoogle">
                                <img src={googleLogo} alt="Google logo" />
                            </Col>
                            <Col md={10} id="textGoogle" >
                                ENTRAR COM O GOOGLE
                            </Col>
                        </Button>
                    </Container>

                    <Container id="boxNotRegistered" className="text-center">
                        <span>Não tem uma conta? </span>
                        <Link to="/cadastrar/cliente" className="link">Cadastre-se</Link>
                        <div>
                            <Link to="/cadastrar/cliente" className="link">Esqueceu sua senha?</Link>
                        </div>
                    </Container>
                </form>
            </Col>

            <Col id="boxRight" md={8}>
                <Link to="/">
                    <img src={fastDrugs} alt='FastDrugs' />
                </Link>

                <div id="boxSlider">
                    <img src={farmacia} alt='Farmácia' />
                    <div id="sliderText">
                        <span>Fast Drugs</span>, a plataforma das farmácias delivery
                    </div>

                    <div id="slider">
                        <div className="slider" id="sliderButton1"></div>
                        <div className="slider" id="sliderButton2"></div>
                        <div className="slider" id="sliderButton3"></div>
                        <div className="slider" id="sliderButton4"></div>
                    </div>
                </div>
            </Col>
        </div>
    );
}

export default LoginClienteBox