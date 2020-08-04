import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Button, Container, Col, Modal } from 'react-bootstrap'
import emailValidator from 'email-validator'

import './styles.css'

import fastDrugs from '../../../assets/fastdrugs-white-horizontal.png'
import estoque from '../../../assets/estoque.png'

import { signIn } from '../../../services/authService'

function LoginFarmaciaBox({ history, location }) {

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

        const res = await signIn({ email, senha }, 'farmacia')

        if (res)
            return setRedirect(true)

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
            {redirect ? <Redirect to={{ pathname: '/minha-farmacia' }} /> : ''}

            <Modal show={expiredSession} onHide={() => setExpiredSession(false)} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Body>
                    <h6 className="text-center">Sua sessão expirou, efetue o login novamente.</h6>
                </Modal.Body>

                <Button variant="dark" onClick={() => setExpiredSession(false)} style={{ borderRadius: 0 }} >Ok</Button>
            </Modal>

            <Col md={4} id="boxLeft">
                <div>
                    <div id="title" className="text-center">Bem-vindo(a) de volta!</div>
                    <div id="subtitle" className="text-center">Gerencie seu estabelecimento aqui!</div>
                </div>

                <form id="boxInputs" onSubmit={handleSubmit}>
                    <Container>
                        <label className="inputText">E-mail</label>
                        <input
                            type="text"
                            placeholder="fast@drugs.com.br"
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
                        <Button variant="light" id="btnEntrar" className="transition" type="submit" disabled={disabledButton ? 'disabled' : ''}>ENTRAR</Button>
                    </Container>

                    <Container id="boxNotRegistered" className="text-center">
                        <span>Não tem uma conta? </span>
                        <Link to="/cadastrar/farmacia" className="link">Cadastre-se</Link>
                        <div>
                            <Link to="/cadastrar/farmacia" className="link">Esqueceu sua senha?</Link>
                        </div>
                    </Container>
                </form>
            </Col>
            <Col md={8} id="boxRight">
                <Link to="/">
                    <img src={fastDrugs} alt='FastDrugs' />
                </Link>

                <div id="boxSlider">
                    <img src={estoque} alt='Estoque' />
                    <div id="sliderText">Gerencie o estoque de sua farmácia</div>

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

export default LoginFarmaciaBox