import React, { useState, useEffect } from 'react'
import { Col, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'

import '../../login/farmacia/styles.css'

import fastDrugs from '../../../assets/fastdrugs-white-horizontal.png'
import farmacia from '../../../assets/farmacia.png'
import loadingGif from '../../../assets/loading.gif'
import successGif from '../../../assets/success.gif'

import CadastroClienteFirstStep from './firstStep'
import CadastroClienteSecondStep from './secondStep'

import api from '../../../services/api'

function CadastroClienteBox() {

    const [boxLeftSize, setBoxLeftSize] = useState(7)
    const [boxRightSize, setBoxRightSize] = useState(5)
    const [step, setStep] = useState(1)

    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [cpf, setCpf] = useState('')
    const [dataNasc, setDataNasc] = useState('')
    const [celular, setCelular] = useState('')
    const [cep, setCep] = useState('')
    const [logradouro, setLogradouro] = useState('')
    const [bairro, setBairro] = useState('')
    const [numero, setNumero] = useState('')
    const [complemento, setComplemento] = useState('')
    const [cidade, setCidade] = useState('')
    const [estado, setEstado] = useState('')
    const [senha, setSenha] = useState('')

    const handleSubmit = (state, options) => {

        if (state.nome) setNome(state.nome)
        if (state.email) setEmail(state.email)
        if (state.cpf) setCpf(state.cpf)
        if (state.dataNasc) setDataNasc(state.dataNasc)
        if (state.celular) setCelular(state.celular)
        if (state.cep) setCep(state.cep)
        if (state.logradouro) setLogradouro(state.logradouro)
        if (state.bairro) setBairro(state.bairro)
        if (state.numero) setNumero(state.numero)
        if (state.complemento) setComplemento(state.complemento)
        if (state.cidade) setCidade(state.cidade)
        if (state.estado) setEstado(state.estado)
        if (state.senha) setSenha(state.senha)

        setBoxLeftSize(options.boxLeftSize)
        setBoxRightSize(options.boxRightSize)
        setStep(options.step)
    }

    useEffect(() => {
        if (step === 3) {
            (async () => {
                const dataPostCliente = { nome, email, senha, celular, data_nascimento: dataNasc, cpf }

                const dataPostEndereco = { enderecos: [{ cep, logradouro, numero, cidade, estado, complemento, bairro }] }

                const { data } = await api.post('/clientes', dataPostCliente)
                await api.post(`/clientes/${data.id_cliente}/enderecos`, dataPostEndereco)

                setBoxLeftSize(6)
                setBoxRightSize(6)
                setStep(4)
            })()
        }
    }, [bairro, celular, cep, cidade, complemento, cpf, dataNasc, email, estado, logradouro, nome, numero, senha, step])

    const handleSteps = step => {
        if (step === 1)
            return <CadastroClienteFirstStep boxRightSize={boxRightSize} handleSubmit={handleSubmit} />
        else if (step === 2)
            return <CadastroClienteSecondStep boxRightSize={boxRightSize} handleSubmit={handleSubmit} />
        else if (step === 3)
            return (
                <Col id="boxLeft" md={boxRightSize}>
                    <img src={loadingGif} alt="Loading gif" />
                </Col>
            )
        else if (step === 4)
            return (
                <Col id="boxLeft" md={boxRightSize}>
                    <img src={successGif} alt="Success gif" style={{ width: '70%', marginTop: '-70px' }} />
                    <div id="title" className="text-center mb-4" style={{ width: '60%', marginTop: '-70px' }}>Cadastro realizado com sucesso!</div>

                    <Container className="text-center">
                        <Link to="/entrar/cliente">
                            <Button variant="light" id="btnEntrar" type="submit" style={{ width: '70%' }}>ENTRAR</Button>
                        </Link>
                    </Container>
                </Col>
            )
    }

    return (
        <div id="box">
            <Col id="boxRight" md={boxLeftSize} className="transition">
                <Link to="/">
                    <img src={fastDrugs} alt='FastDrugs' />
                </Link>

                <div id="boxSlider">
                    <img src={farmacia} alt='Estoque' />
                    <div id="sliderText"><span>Fast Drugs</span>, a plataforma das farmácias delivery</div>

                    <div id="slider">
                        <div className="slider" id="sliderButton1"></div>
                        <div className="slider" id="sliderButton2"></div>
                        <div className="slider" id="sliderButton3"></div>
                        <div className="slider" id="sliderButton4"></div>
                    </div>
                </div>
            </Col>

            {handleSteps(step)}
        </div>
    );
}

export default CadastroClienteBox