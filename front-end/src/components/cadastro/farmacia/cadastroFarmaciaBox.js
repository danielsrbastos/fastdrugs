import React, { useState, useEffect } from 'react'
import { Col, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'

import '../../login/farmacia/styles.css'

import fastDrugs from '../../../assets/fastdrugs-white-horizontal.png'
import estoque from '../../../assets/estoque.png'
import loadingGif from '../../../assets/loading.gif'
import successGif from '../../../assets/success.gif'

import CadastroFarmaciaFirstStep from './firstStep'
import CadastroFarmaciaSecondStep from './secondStep'
import CadastroFarmaciaThirdStep from './thirdStep'

import api from '../../../services/api'

function CadastroFarmaciaBox() {

    const [boxLeftSize, setBoxLeftSize] = useState(7)
    const [boxRightSize, setBoxRightSize] = useState(5)
    const [step, setStep] = useState(1)

    const [responsavel, setResponsavel] = useState('')
    const [email, setEmail] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [farmacia, setFarmacia] = useState('')
    const [telefone, setTelefone] = useState('')
    const [cep, setCep] = useState('')
    const [logradouro, setLogradouro] = useState('')
    const [bairro, setBairro] = useState('')
    const [numero, setNumero] = useState('')
    const [complemento, setComplemento] = useState('')
    const [cidade, setCidade] = useState('')
    const [estado, setEstado] = useState('')
    const [senha, setSenha] = useState('')
    const [segSex, setSegSex] = useState('')
    const [sab, setSab] = useState('')
    const [domFer, setDomFer] = useState('')
    const [imagem, setImagem] = useState('')
    const [distanciaMaximaEntrega, setDistanciaMaximaEntrega] = useState('')
    const [precoPorKm, setPrecoPorKm] = useState('')
    const [distanciaMaximaFreteGratis, setDistanciaMaximaFreteGratis] = useState('')

    const handleSubmit = (state, options) => {
        if (state.responsavel) setResponsavel(state.responsavel)
        if (state.email) setEmail(state.email)
        if (state.cnpj) setCnpj(state.cnpj)
        if (state.farmacia) setFarmacia(state.farmacia)
        if (state.telefone) setTelefone(state.telefone)
        if (state.cep) setCep(state.cep)
        if (state.logradouro) setLogradouro(state.logradouro)
        if (state.bairro) setBairro(state.bairro)
        if (state.numero) setNumero(state.numero)
        if (state.complemento) setComplemento(state.complemento)
        if (state.cidade) setCidade(state.cidade)
        if (state.estado) setEstado(state.estado)
        if (state.senha) setSenha(state.senha)
        if (state.segSex) setSegSex(state.segSex)
        if (state.sab) setSab(state.sab)
        if (state.domFer) setDomFer(state.domFer)
        if (state.imagem) setImagem(state.imagem)
        if (state.distanciaMaximaEntrega) setDistanciaMaximaEntrega(state.distanciaMaximaEntrega)
        if (state.precoPorKm) setPrecoPorKm(state.precoPorKm)
        if (state.distanciaMaximaFreteGratis) setDistanciaMaximaFreteGratis(state.distanciaMaximaFreteGratis)

        setBoxLeftSize(options.boxLeftSize)
        setBoxRightSize(options.boxRightSize)
        setStep(options.step)
    }

    useEffect(() => {
        if (step === 4) {
            (async () => {
                const dataPostFarmacia = { responsavel, email, cnpj, nome: farmacia, cep, logradouro, bairro, numero, complemento, cidade, estado, senha, seg_sex: segSex, sab, dom_fer: domFer, status: false, distancia_maxima_entrega: distanciaMaximaEntrega, preco_por_km: precoPorKm, distancia_maxima_frete_gratis: distanciaMaximaFreteGratis }

                const dataPostTelefone = { telefones: [{ telefone }] }

                const { data } = await api.post('/farmacias', dataPostFarmacia)
                await api.post(`/farmacias/${data.id_farmacia}/telefones`, dataPostTelefone)

                if (imagem !== '') {
                    const dataPostImagem = new FormData()
                    dataPostImagem.append('farmacia', imagem)
                    
                    await api.post(`/farmacias/${data.id_farmacia}/imagem`, dataPostImagem)
                }

                setBoxLeftSize(6)
                setBoxRightSize(6)
                setStep(5)
            })()
        }
    }, [bairro, cep, cidade, cnpj, complemento, distanciaMaximaEntrega, distanciaMaximaFreteGratis, domFer, email, estado, farmacia, imagem, logradouro, numero, precoPorKm, responsavel, sab, segSex, senha, step, telefone])

    const handleSteps = step => {
        if (step === 1)
            return <CadastroFarmaciaFirstStep boxRightSize={boxRightSize} handleSubmit={handleSubmit} />
        else if (step === 2)
            return <CadastroFarmaciaSecondStep boxRightSize={boxRightSize} handleSubmit={handleSubmit} />
        else if (step === 3)
            return <CadastroFarmaciaThirdStep boxRightSize={boxRightSize} handleSubmit={handleSubmit} />
        else if (step === 4)
            return (
                <Col id="boxLeft" md={boxRightSize}>
                    <img src={loadingGif} alt="Loading gif" />
                </Col>
            )
        else if (step === 5)
            return (
                <Col id="boxLeft" md={boxRightSize}>
                    <img src={successGif} alt="Success gif" style={{ width: '70%', marginTop: '-70px' }} />
                    <div id="title" className="text-center mb-4" style={{ width: '60%', marginTop: '-70px' }}>Cadastro realizado com sucesso!</div>

                    <Container className="text-center">
                        <Link to="/entrar/farmacia">
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

            {handleSteps(step)}
        </div>
    );
}

export default CadastroFarmaciaBox