import React, { useState, useEffect } from 'react'
import { Col, Container, Button } from 'react-bootstrap'

import apiCep from '../../../services/apiCep'

import { telefoneMask, cepMask } from '../../../utils/fieldsMask'

function CadastroFarmaciaSecondStep({ boxRightSize, handleSubmit }) {

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
    const [senha2, setSenha2] = useState('')

    const [invalidFarmacia, setInvalidFarmacia] = useState(false)
    const [invalidTelefone, setInvalidTelefone] = useState(false)
    const [invalidCep, setInvalidCep] = useState(false)
    const [invalidNumero, setInvalidNumero] = useState(false)
    const [invalidSenha, setInvalidSenha] = useState(false)
    const [invalidSenhaEquals, setInvalidSenhaEquals] = useState(false)

    const handleSubmitCustom = e => {
        e.preventDefault()

        let invalidFields = false

        if (farmacia === '') {
            setInvalidFarmacia(true)
            invalidFields = true
        }

        if (telefone === '') {
            setInvalidTelefone(true)
            invalidFields = true
        }

        if (cep === '') {
            setInvalidCep(true)
            invalidFields = true
        }

        if (numero === '') {
            setInvalidNumero(true)
            invalidFields = true
        }

        if (senha === '' || senha2 === '') {
            setInvalidSenha(true)
            setInvalidSenhaEquals(false)
            invalidFields = true
        }

        if (invalidFarmacia || invalidTelefone || invalidCep || invalidNumero || invalidSenha || invalidSenhaEquals || invalidFields)
            return false

        handleSubmit({
            farmacia,
            telefone, 
            cep, 
            logradouro, 
            bairro,
            numero,
            complemento,
            cidade,
            estado,
            senha
        }, {
            step: 3,
            boxLeftSize: 6,
            boxRightSize: 6
        })
    }

    useEffect(() => {
        /* Cep */
        (async () => {
            if (cep.length === 9) {
                const { data } = await apiCep.get(`/${cep}/json`)

                if (data.erro) {
                    setInvalidCep(true)
                    setLogradouro('')
                    setEstado('')
                    setCidade('')
                    setBairro('')
                    return false
                }

                setInvalidCep(false)
                setLogradouro(data.logradouro)
                setEstado(data.uf)
                setCidade(data.localidade)
                setBairro(data.bairro)
            } else if (cep !== '' && cep.length !== 9)
                setInvalidCep(true)
            else if (cep.length === 9)
                setInvalidCep(false)
        })()

        /* Telefone */
        if (telefone !== '' && telefone.length !== 14)
            setInvalidTelefone(true)
        else if (telefone !== '')
            setInvalidTelefone(false)

        /* Número */
        if (numero.length >= 1)
            setInvalidNumero(false)

        /* Farmácia */
        if (farmacia.length >= 1)
            setInvalidFarmacia(false)

        /* Senha */
        if (senha !== '' && senha !== senha2) {
            setInvalidSenha(false)
            setInvalidSenhaEquals(true)
        } else if (senha !== '') {
            setInvalidSenhaEquals(false)
            setInvalidSenha(false)
        }
    }, [cep, telefone, numero, senha, senha2, farmacia])

    const setTelefoneMiddleware = value => {
        setTelefone(telefoneMask(value))
    }

    const setCepMiddleware = value => {
        setCep(cepMask(value))
    }

    const setNumeroMiddleware = value => {
        setNumero(value
            .replace(/\D/g, '')
            .replace(/(\d{4})\d+?$/, '$1'))
    }

    return (
        <Col id="boxLeft" md={boxRightSize}>
            <div id="boxInputs" className="overflow-auto">
                <form onSubmit={e => handleSubmitCustom(e)}>
                    <Container>
                        <label className="inputText">Nome da farmácia</label>
                        <input
                            type="text"
                            placeholder="Drogaria Fast Drugs"
                            onChange={e => setFarmacia(e.target.value)}
                            value={farmacia}
                            style={invalidFarmacia ? { border: '1px solid #dc3545' } : { border: 'solid 1px #ccc' }}
                        />
                        {invalidFarmacia ? <div className="invalid-feedback">Informe um nome válido.</div> : ''}
                    </Container>

                    <Container>
                        <label className="inputText">Telefone</label>
                        <input
                            type="text"
                            placeholder="(00) 0000-0000"
                            onChange={e => setTelefoneMiddleware(e.target.value)}
                            value={telefone}
                            style={invalidTelefone ? { border: '1px solid #dc3545' } : { border: 'solid 1px #ccc' }}
                        />
                        {invalidTelefone ? <div className="invalid-feedback">Informe um telefone válido.</div> : ''}
                    </Container>

                    <Container>
                        <div className="boxInputFlex">
                            <div className="inputFlex mr-4" style={{ width: '50%' }}>
                                <label className="inputText">CEP</label>
                                <input
                                    type="text"
                                    placeholder="00000-000"
                                    onChange={e => setCepMiddleware(e.target.value)}
                                    value={cep}
                                    style={invalidCep ? { border: '1px solid #dc3545' } : { border: 'solid 1px #ccc' }}
                                />
                                {invalidCep ? <div className="invalid-feedback">Informe um CEP válido.</div> : ''}
                            </div>

                            <fieldset disabled className="inputFlex" style={{ width: '50%' }}>
                                <label className="inputText">Logradouro</label>
                                <input
                                    type="text"
                                    placeholder="Rua 15 de Julho"
                                    onChange={e => setLogradouro(e.target.value)}
                                    value={logradouro}
                                    className="disabled"
                                />
                            </fieldset>
                        </div>
                    </Container>

                    <Container>
                        <div className="boxInputFlex">
                            <fieldset disabled className="inputFlex mr-4" style={{ width: '40%' }}>
                                <label className="inputText">Bairro</label>
                                <input
                                    type="text"
                                    placeholder="Jardim Carlos Alberto"
                                    onChange={e => setBairro(e.target.value)}
                                    value={bairro}
                                    className="disabled"
                                />
                            </fieldset>

                            <div className="inputFlex mr-4" style={{ width: '15%' }}>
                                <label className="inputText">Nº</label>
                                <input
                                    type="text"
                                    placeholder="1234"
                                    onChange={e => setNumeroMiddleware(e.target.value)}
                                    value={numero}
                                    style={invalidNumero ? { border: '1px solid #dc3545' } : { border: 'solid 1px #ccc' }}
                                />
                                {invalidNumero ? <div className="invalid-feedback">Informe um número válido.</div> : ''}
                            </div>

                            <div className="inputFlex" style={{ width: '45%' }}>
                                <label className="inputText">Complemento <span className="opcional">(opcional)</span></label>
                                <input
                                    type="text"
                                    placeholder="..."
                                    onChange={e => setComplemento(e.target.value)}
                                    value={complemento}
                                />
                            </div>
                        </div>
                    </Container>

                    <Container>
                        <div className="boxInputFlex">
                            <fieldset disabled className="inputFlex mr-4" style={{ width: '50%' }}>
                                <label className="inputText">Cidade</label>
                                <input
                                    type="text"
                                    placeholder="São Paulo"
                                    onChange={e => setCidade(e.target.value)}
                                    value={cidade}
                                    className="disabled"
                                />
                            </fieldset>

                            <fieldset disabled className="inputFlex" style={{ width: '50%' }}>
                                <label className="inputText">Estado</label>
                                <input
                                    type="text"
                                    placeholder="SP"
                                    onChange={e => setEstado(e.target.value)}
                                    value={estado}
                                    className="disabled"
                                />
                            </fieldset>
                        </div>
                    </Container>

                    <Container>
                        <div className="boxInputFlex">
                            <div className="inputFlex mr-4" style={{ width: '50%' }}>
                                <label className="inputText">Senha</label>
                                <input
                                    type="password"
                                    placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                                    onChange={e => setSenha(e.target.value)}
                                    value={senha}
                                    style={invalidSenha || invalidSenhaEquals ? { border: '1px solid #dc3545' } : { border: 'solid 1px #ccc' }}
                                />
                                {invalidSenha ? <div className="invalid-feedback">Informe uma senha válida.</div> : ''}
                                {invalidSenhaEquals ? <div className="invalid-feedback">As senhas inseridas não coincidem.</div> : ''}
                            </div>

                            <fieldset disabled={senha === '' ? 'disabled' : ''} className="inputFlex" style={{ width: '50%' }}>
                                <label className="inputText">Confirmar senha</label>
                                <input
                                    type="password"
                                    placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
                                    onChange={e => setSenha2(e.target.value)}
                                    value={senha2}
                                    style={invalidSenha || invalidSenhaEquals ? { border: '1px solid #dc3545' } : { border: 'solid 1px #ccc' }}
                                    className={senha === '' ? 'disabled' : ''}
                                />
                            </fieldset>
                        </div>
                    </Container>

                    <Container>
                        <Button variant="light" id="btnEntrar" type="submit">PRÓXIMA ETAPA</Button>
                    </Container>
                </form>
            </div>
        </Col>
    );
}

export default CadastroFarmaciaSecondStep