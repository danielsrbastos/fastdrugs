import React, { useState, useEffect } from 'react'
import { Col, Container, Button } from 'react-bootstrap'
import { cnpj as cnpjValidator } from 'cpf-cnpj-validator'
import emailValidator from 'email-validator'

import api from '../../../services/api'

import { cnpjMask } from '../../../utils/fieldsMask'

function CadastroFarmaciaFirstStep({ boxRightSize, handleSubmit }) {

    const [responsavel, setResponsavel] = useState('')
    const [email, setEmail] = useState('')
    const [cnpj, setCnpj] = useState('')

    const [invalidResponsavel, setInvalidResponsavel] = useState(false)
    const [invalidEmail, setInvalidEmail] = useState(false)
    const [invalidCnpj, setInvalidCnpj] = useState(false)
    const [emailInUse, setEmailInUse] = useState(false)
    const [cnpjInUse, setCnpjInUse] = useState(false)

    const [disabledButton, setDisabledButton] = useState(false)

    const handleSubmitMiddleware = async e => {
        e.preventDefault()

        setDisabledButton(true)
        let invalidFields = false

        if (responsavel === '') {
            setInvalidResponsavel(true)
            invalidFields = true
        }

        if (email === '') {
            setInvalidEmail(true)
            invalidFields = true
        }

        if (cnpj === '') {
            setInvalidCnpj(true)
            invalidFields = true
        }

        if (invalidResponsavel || invalidEmail || invalidCnpj || invalidFields) {
            setDisabledButton(false)
            return false
        }

        try {
            await api.post('/farmacias/validate', { email, cnpj })

            handleSubmit({
                responsavel,
                email,
                cnpj
            }, {
                step: 2,
                boxLeftSize: 4,
                boxRightSize: 8
            })
        } catch (error) {
            if (typeof error.response !== 'undefined') {
                const { errors } = error.response.data

                errors.forEach(error => {
                    if (error.param === 'email')
                        setEmailInUse(true)

                    if (error.param === 'cnpj')
                        setCnpjInUse(true)
                })
            }
        }

        setDisabledButton(false)
    }

    /* Validações */
    useEffect(() => {
        /* Responsável */
        if (responsavel !== '' && responsavel.length <= 2)
            setInvalidResponsavel(true)
        else if (responsavel !== '')
            setInvalidResponsavel(false)

        /* E-mail */
        setEmailInUse(false)

        if (email !== '' && !emailValidator.validate(email))
            setInvalidEmail(true)
        else if (email !== '')
            setInvalidEmail(false)

        /* CNPJ */
        if (cnpj !== '' && !cnpjValidator.isValid(cnpj)) {
            setCnpjInUse(false)
            setInvalidCnpj(true)
        } else if (cnpj !== '')
            setInvalidCnpj(false)
    }, [cnpj, email, responsavel])

    const setResponsavelMiddleware = value => {
        setResponsavel(value
            .replace(/\d/g, ''))
    }

    const setCnpjMiddleware = value => {
        setCnpj(cnpjMask(value))
    }

    return (
        <Col id="boxLeft" md={boxRightSize}>
            <div>
                <div id="title" className="text-center">Cadastre sua farmácia</div>
                <div id="subtitle" className="text-center">Impulsione suas vendas!</div>
            </div>

            <div id="boxInputs">
                <form onSubmit={e => handleSubmitMiddleware(e)}>
                    <Container>
                        <label className="inputText">Nome completo do responsável</label>
                        <input
                            type="text"
                            placeholder="Nome completo"
                            onChange={e => setResponsavelMiddleware(e.target.value)}
                            value={responsavel}
                            style={invalidResponsavel ? { border: '1px solid #dc3545' } : { border: 'solid 1px #ccc' }}
                        />
                        {invalidResponsavel ? <div className="invalid-feedback">Informe um nome válido.</div> : ''}
                    </Container>

                    <Container>
                        <label className="inputText">E-mail</label>
                        <input
                            type="text"
                            placeholder="fast@drugs.com.br"
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                            style={invalidEmail || emailInUse ? { border: '1px solid #dc3545' } : { border: 'solid 1px #ccc' }}
                        />
                        {invalidEmail ? <div className="invalid-feedback">Informe um e-mail válido.</div> : ''}
                        {emailInUse ? <div className="invalid-feedback">E-mail já cadastrado.</div> : ''}
                    </Container>

                    <Container>
                        <label className="inputText">CNPJ</label>
                        <input
                            type="text"
                            placeholder="00.000.000/0000-00"
                            onChange={e => setCnpjMiddleware(e.target.value)}
                            value={cnpj}
                            style={invalidCnpj || cnpjInUse ? { border: '1px solid #dc3545' } : { border: 'solid 1px #ccc' }}
                        />
                        {invalidCnpj ? <div className="invalid-feedback">Informe um CNPJ válido.</div> : ''}
                        {cnpjInUse ? <div className="invalid-feedback">CNPJ já cadastrado.</div> : ''}
                    </Container>

                    <Container>
                        <Button variant="light" id="btnEntrar" className="transition" type="submit" disabled={disabledButton ? 'disabled' : ''}>PRÓXIMA ETAPA</Button>
                    </Container>
                </form>
            </div>
        </Col>
    )
}

export default CadastroFarmaciaFirstStep