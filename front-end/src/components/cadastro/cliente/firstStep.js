import React, { useState, useEffect } from 'react'
import { Col, Container, Button } from 'react-bootstrap'
import { cpf as cpfValidator } from 'cpf-cnpj-validator'
import emailValidator from 'email-validator'

import api from '../../../services/api'

import { cpfMask, dataMask } from '../../../utils/fieldsMask'

function CadastroClienteFirstStep({ boxRightSize, handleSubmit }) {

    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [cpf, setCpf] = useState('')
    const [dataNasc, setDataNasc] = useState('')

    const [invalidNome, setInvalidNome] = useState(false)
    const [invalidEmail, setInvalidEmail] = useState(false)
    const [invalidCpf, setInvalidCpf] = useState(false)
    const [invalidDataNasc, setInvalidDataNasc] = useState(false)
    const [emailInUse, setEmailInUse] = useState(false)
    const [cpfInUse, setCpfInUse] = useState(false)
    const [menorDeIdade, setMenorDeIdade] = useState(false)

    const [disabledButton, setDisabledButton] = useState(false)

    const handleSubmitMiddleware = async e => {
        e.preventDefault()

        setDisabledButton(true)
        let invalidFields = false

        if (nome === '') {
            setInvalidNome(true)
            invalidFields = true
        }

        if (email === '') {
            setInvalidEmail(true)
            invalidFields = true
        }

        if (cpf === '') {
            setInvalidCpf(true)
            invalidFields = true
        }

        if (dataNasc === '') {
            setInvalidDataNasc(true)
            invalidFields = true
        }

        if (invalidNome || invalidEmail || invalidCpf || invalidDataNasc || menorDeIdade || invalidFields) {
            setDisabledButton(false)
            return false
        }

        try {
            await api.post('/clientes/validate', { email, cpf, celular: '' })
           
            handleSubmit({
                nome,
                email,
                cpf,
                dataNasc
            }, {
                step: 2,
                boxLeftSize: 4,
                boxRightSize: 8
            })
        } catch (error) {
            const { errors } = error.response.data

            errors.forEach(error => {
                if (error.param === 'email') 
                    setEmailInUse(true)

                if (error.param === 'cpf') 
                    setCpfInUse(true)
            })
        }

        setDisabledButton(false)
    }

    useEffect(() => {
        /* Nome */
        if (nome !== '' && nome.length <= 2)
            setInvalidNome(true)
        else if (nome !== '')
            setInvalidNome(false)

        /* E-mail */
        setEmailInUse(false)

        if (email !== '' && !emailValidator.validate(email)) 
            setInvalidEmail(true)
        else if (email !== '')
            setInvalidEmail(false)

        /* CPF */
        setCpfInUse(false)

        if (cpf !== '' && !cpfValidator.isValid(cpf))
            setInvalidCpf(true)
        else if (cpf !== '')
            setInvalidCpf(false)

        /* Data de nascimento */
        if (dataNasc.length === 10) {    
            let dataNascInverted = dataNasc.split('/')
            dataNascInverted = `${dataNascInverted[2]}/${dataNascInverted[1]}/${dataNascInverted[0]}`

            const today = new Date()
            const birthDate = new Date(dataNascInverted)

            if(isNaN(birthDate.getTime())) {
                setInvalidDataNasc(true)
                return 
            }

            let age = today.getFullYear() - birthDate.getFullYear();
            const month = today.getMonth() - birthDate.getMonth();

            if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }    

            if (age < 18) {
                setMenorDeIdade(true)
            }

            setInvalidDataNasc(false)
        } else if (dataNasc !== '' && dataNasc.length < 10) {
            setMenorDeIdade(false)
            setInvalidDataNasc(true)
        } else if (dataNasc !== '')
            setInvalidDataNasc(false)
    }, [cpf, dataNasc, email, menorDeIdade, nome])

    const setNomeMiddleware = value => {
        setNome(value
            .replace(/\d/g, ''))
    }

    const setCpfMiddleware = value => {
        setCpf(cpfMask(value))
    }

    const setDataNascMiddleware = value => {
        setDataNasc(dataMask(value))
    }

    return (
        <Col id="boxLeft" md={boxRightSize}>
            <div>
                <div id="title" className="text-center">Cadastre-se para comprar</div>
                <div id="subtitle" className="text-center">Faça suas compras aqui!</div>
            </div>

            <div id="boxInputs">
                <form onSubmit={e => handleSubmitMiddleware(e)}>
                    <Container>
                        <label className="inputText">Nome completo</label>
                        <input
                            type="text"
                            placeholder="Nome completo"
                            onChange={e => setNomeMiddleware(e.target.value)}
                            value={nome}
                            style={invalidNome ? { border: '1px solid #dc3545' } : { border: 'solid 1px #ccc' }}
                        />
                        {invalidNome ? <div className="invalid-feedback">Informe um nome válido.</div> : ''}
                    </Container>

                    <Container>
                        <label className="inputText">E-mail</label>
                        <input
                            type="text"
                            placeholder="cliente@fastdrugs.com.br"
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                            style={invalidEmail || emailInUse ? { border: '1px solid #dc3545' } : { border: 'solid 1px #ccc' }}
                        />
                        {invalidEmail ? <div className="invalid-feedback">Informe um e-mail válido.</div> : ''}
                        {emailInUse ? <div className="invalid-feedback">E-mail já cadastrado.</div> : ''}
                    </Container>

                    <Container>
                        <label className="inputText">CPF</label>
                        <input
                            type="text"
                            placeholder="000.000.000-00"
                            onChange={e => setCpfMiddleware(e.target.value)}
                            value={cpf}
                            style={invalidCpf ? { border: '1px solid #dc3545' } : { border: 'solid 1px #ccc' }}
                        />
                        {invalidCpf ? <div className="invalid-feedback">Informe um CPF válido.</div> : ''}
                        {cpfInUse ? <div className="invalid-feedback">CPF já cadastrado.</div> : ''}
                    </Container>

                    <Container>
                        <label className="inputText">Data de nascimento</label>
                        <input
                            type="text"
                            placeholder="dd/mm/aaaa"
                            onChange={e => setDataNascMiddleware(e.target.value)}
                            value={dataNasc}
                            style={invalidDataNasc || menorDeIdade ? { border: '1px solid #dc3545' } : { border: 'solid 1px #ccc' }}
                        />
                        {invalidDataNasc ? <div className="invalid-feedback">Informe uma data válida.</div> : ''}
                        {menorDeIdade ? <div className="invalid-feedback">Você precisa ter no mínimo 18 anos.</div> : ''}
                    </Container>

                    <Container>
                        <Button variant="light" id="btnEntrar" className="transition" type="submit" disabled={disabledButton ? 'disabled' : ''}>PRÓXIMA ETAPA</Button>
                    </Container>
                </form>
            </div>
        </Col>
    )
}

export default CadastroClienteFirstStep