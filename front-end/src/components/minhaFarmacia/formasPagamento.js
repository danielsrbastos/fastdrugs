import React, { useState, useEffect } from 'react'
import { Container, Button, Row, Col, Spinner } from 'react-bootstrap'
import Select from 'react-select'

import { selectTheme } from '../themes'
import './styles.css'

import { TiDelete } from 'react-icons/ti'

import api from '../../services/api'

function FormasPagamento({ farmacia }) {

    const [formaPagamento, setFormaPagamento] = useState([])
    const [formasPagamentoSelect, setFormasPagamentoSelect] = useState([])
    const [formasPagamento, setFormasPagamento] = useState([])

    const [refreshFormasPagamento, setRefreshFormasPagamento] = useState(true)
    const [disabledButton, setDisabledButton] = useState(false)

    useEffect(() => {
        if (refreshFormasPagamento) {
            (async () => {
                try {
                    const { data } = await api.get(`/farmacias/${farmacia.id_farmacia}/formasDePagamento`)

                    setFormasPagamento(data)
                    setSelectPaymentMethods(data)
                    setRefreshFormasPagamento(false)
                } catch (e) {
                    if (e.response.status === 404) {
                        setFormasPagamento([])
                        setSelectPaymentMethods([])
                        setRefreshFormasPagamento(false)
                    }
                }
            })()
        }
    }, [farmacia.id_farmacia, refreshFormasPagamento])

    const setSelectPaymentMethods = async (paymentMethodsAlreadyRegistered) => {
        const fpSelect = await api.get(`/formasDePagamento`)
        const formasPagamentoSelectFiltered = fpSelect.data.filter(({ tipo }) => {
            let paymentMethodAlreadyRegistered = false

            paymentMethodsAlreadyRegistered.forEach(fp => {
                if (fp.tipo === tipo)
                    paymentMethodAlreadyRegistered = true
            })

            if (paymentMethodAlreadyRegistered)
                return false

            return true
        })

        const formasPagamentoSelectConverted = JSON.parse(JSON.stringify(formasPagamentoSelectFiltered).split('"id_forma_pagamento":').join('"value":').split('"tipo":').join('"label":'))

        setFormasPagamentoSelect(formasPagamentoSelectConverted)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setDisabledButton(true)

        try {
            const formas_pagamentos = []

            formaPagamento.forEach(fp => {
                formas_pagamentos.push({
                    id_forma_pagamento: fp.value,
                    tipo: fp.label
                })
            })

            const requestBody = { formas_pagamentos }

            await api.post(`/farmacias/${farmacia.id_farmacia}/formasDePagamento`, requestBody)

            setRefreshFormasPagamento(true)
            setDisabledButton(false)
            setFormaPagamento([])
        } catch (e) {
            return e.response
        }
    }

    return (
        <div id="boxInputs" style={{ paddingBottom: '300px' }}>
            <form onSubmit={handleSubmit}>
                <Container>
                    <label className="inputText">Forma de pagamento</label>

                    <Select
                        classNamePrefix="select"
                        options={formasPagamentoSelect}
                        placeholder="Ex: Crédito Mastercard"
                        value={formaPagamento}
                        onChange={value => setFormaPagamento(value)}
                        isMulti={true}
                        theme={theme => selectTheme(theme)}
                    />
                </Container>

                <Container>
                    <Button style={{ fontSize: 18, marginTop: 10 }} id="btnEntrar" className="transition" type="submit" disabled={disabledButton ? 'disabled' : ''}>
                        Cadastrar Formas de Pagamento
                    </Button>
                </Container>
            </form>

            <Container><div style={{ width: '100%', height: 1, border: 'solid 0.1px #ccc', marginTop: 30 }}></div></Container>

            <Container id="listaCategorias" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Spinner animation="border" role="status" style={{ marginTop: 100, display: refreshFormasPagamento ? 'block' : 'none' }}>
                    <span className="sr-only">Loading...</span>
                </Spinner>

                {formasPagamento.map(formaPagamento => {
                    return (
                        <div className="categoria" key={formaPagamento.id_forma_pagamento} style={{ width: '100%', display: refreshFormasPagamento ? 'none' : 'block' }}>
                            <Row>
                                <Col md={10} style={{ padding: 10, paddingLeft: 30 }}>
                                    <p className="defaultText">{formaPagamento.tipo}</p>
                                </Col>
                                <Col md={2} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <div style={{ color: '#303030', height: '100%' }}>
                                        <Button title="Remover" variant="light" style={{ height: '100%', borderRadius: 0, borderRight: 0 }}
                                            onClick={async () => {
                                                await api.delete(`/farmacias/${farmacia.id_farmacia}/formasDePagamento/${formaPagamento.id_forma_pagamento}`)
                                                setRefreshFormasPagamento(true)
                                            }}
                                        >
                                            <TiDelete size={24} style={{ cursor: 'pointer' }} />
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    )
                })}
            </Container>
        </div>
    )
}

export default FormasPagamento