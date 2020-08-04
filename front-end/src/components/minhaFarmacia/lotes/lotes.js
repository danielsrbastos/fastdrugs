import React, { useState, useEffect } from 'react'
import { Container, Button, Row, Col, Spinner } from 'react-bootstrap'
import Select from 'react-select'

import { selectTheme } from '../../themes'
import '../styles.css'

import { TiDelete } from 'react-icons/ti'

import api from '../../../services/api'

import { getToken } from '../../../services/authService'
import { dataMask } from '../../../utils/fieldsMask'

function Lotes({ farmacia }) {

    const [produto, setProduto] = useState('')
    const [numeroLote, setNumeroLote] = useState('')
    const [dataFab, setDataFab] = useState('')
    const [dataVal, setDataVal] = useState('')
    const [quantidade, setQuantidade] = useState('')

    const [lotes, setLotes] = useState([])
    const [lotesList, setLotesList] = useState([])
    const [loteBuscar, setLoteBuscar] = useState('')

    const [produtos, setProdutos] = useState([])

    const [token] = useState(getToken('farmacia'))
    const [refreshLotes, setRefreshLotes] = useState(true)
    const [disabledButton, setDisabledButton] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        setDisabledButton(true)

        try {
            const loteBody = { id_produto: produto.value, quantidade, numero_lote: numeroLote, data_val: dataVal, data_fab: dataFab }

            await api.post(`/farmacias/${farmacia.id_farmacia}/lotes`, loteBody)

            setRefreshLotes(true)
            setDisabledButton(false)
        } catch (e) {
            return console.log(e.response.data)
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get(`/farmacias/${farmacia.id_farmacia}/produtos`)

                const produtosConverted = JSON.parse(JSON.stringify(data).split('"id_produto":').join('"value":').split('"nome":').join('"label":'))

                setProdutos(produtosConverted)
            } catch (e) {
                return console.log(e.response.data)
            }
        })()
    }, [farmacia.id_farmacia, token])

    useEffect(() => {
        if (refreshLotes) {
            (async () => {
                try {
                    const responseLotes = await api.get(`/farmacias/${farmacia.id_farmacia}/lotes`)

                    setLotes(responseLotes.data)
                    setLotesList(responseLotes.data)
                    setRefreshLotes(false)
                } catch (e) {
                    return console.log(e.response)
                }
            })()
        }
    }, [farmacia.id_farmacia, refreshLotes])

    useEffect(() => {
        if (loteBuscar !== null) {
            if (loteBuscar.value)
                setLotesList(lotes.filter((lote, i) => lote.id_produto === loteBuscar.value))
            else if (loteBuscar.length === 0)
                setLotesList(lotes)
        } else
            setLotesList(lotes)
    }, [loteBuscar, lotes])

    return (
        <div id="boxInputs" style={{ paddingBottom: '300px' }}>
            <form onSubmit={handleSubmit}>
                <Container>
                    <label className="inputText">Produto</label>

                    <Select
                        classNamePrefix="select"
                        options={produtos}
                        placeholder="Ex: Dipirona"
                        value={produto}
                        onChange={value => setProduto(value)}
                        theme={theme => selectTheme(theme)}
                    />
                </Container>

                <Container className="boxInputFlex">
                    <div className="inputFlex" style={{ width: '60%' }}>
                        <label className="inputText">Número do lote</label>

                        <input
                            type="text"
                            placeholder="0000000"
                            value={numeroLote}
                            onChange={e => setNumeroLote(e.target.value)}
                        />
                    </div>

                    <div className="inputFlex" style={{ width: '39%', marginLeft: '1%' }}>
                        <label className="inputText">Quantidade de produtos</label>

                        <input
                            type="text"
                            placeholder="0"
                            value={quantidade}
                            onChange={e => setQuantidade(e.target.value)}
                        />
                    </div>
                </Container>

                <Container className="boxInputFlex">
                    <div className="inputFlex" style={{ width: '50%' }}>
                        <label className="inputText">Data de fabricação</label>

                        <input
                            type="text"
                            placeholder="00/00/0000"
                            value={dataFab}
                            onChange={e => setDataFab(dataMask(e.target.value))}
                        />
                    </div>

                    <div className="inputFlex" style={{ width: '49%', marginLeft: '1%' }}>
                        <label className="inputText">Data de validade</label>

                        <input
                            type="text"
                            placeholder="00/00/0000"
                            value={dataVal}
                            onChange={e => setDataVal(dataMask(e.target.value))}
                        />
                    </div>
                </Container>

                <Container>
                    <Button style={{ fontSize: 18, marginTop: 10 }} id="btnEntrar" className="transition" type="submit" disabled={disabledButton ? 'disabled' : ''}>
                        Cadastrar Lote
                    </Button>
                </Container>
            </form>

            <Container><div style={{ width: '100%', height: 1, border: 'solid 0.1px #ccc', marginTop: 30 }}></div></Container>

            <Container>
                <label className="inputText">Buscar</label>

                <Select
                    classNamePrefix="select"
                    options={produtos}
                    placeholder="Ex: Dipirona"
                    value={loteBuscar}
                    onChange={value => setLoteBuscar(value)}
                    isClearable={true}
                    theme={theme => selectTheme(theme)}
                />
            </Container>

            <Container id="listaCategorias" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Spinner animation="border" role="status" style={{ marginTop: 100, display: refreshLotes ? 'block' : 'none' }}>
                    <span className="sr-only">Loading...</span>
                </Spinner>

                {lotesList.map(lote => {
                    return (
                        <div className="categoria" key={lote.id_lote} style={{ width: '100%', display: refreshLotes ? 'none' : 'block' }}>
                            <Row>
                                <Col md={10} style={{ padding: 10, paddingLeft: 30 }}>
                                    <p className="defaultText" style={{ float: 'left', marginRight: 10, color: '#000' }} >{lote.lotesProdutos.nome}</p>
                                    <p className="defaultText" style={{ float: 'left', marginRight: 10, color: '#000' }}>></p>
                                    <p className="defaultText" style={{ float: 'left', marginRight: 10, color: '#9e9e9e' }}>Lote {lote.numero_lote}</p>
                                    <p className="defaultText" style={{ float: 'left', marginRight: 10, color: '#9e9e9e' }} >-</p>
                                    <p className="defaultText" style={{ float: 'left', marginRight: 10, color: '#9e9e9e' }} >{lote.quantidade} caixas</p>
                                </Col>
                                <Col md={2} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <div style={{ color: '#303030', height: '100%' }}>
                                        <Button title="Remover" variant="light" style={{ height: '100%', borderRadius: 0, borderRight: 0 }}
                                            onClick={async () => {
                                                await api.delete(`/farmacias/${farmacia.id_farmacia}/lotes/${lote.id_lote}`)
                                                setRefreshLotes(true)
                                            }}
                                        >
                                            <TiDelete size={24} style={{ cursor: 'pointer' }} />
                                        </Button>
                                    </div>

                                    <Button variant="light" title="Detalhes" style={{ height: '100%', borderRadius: 0 }}>
                                        Detalhes
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    )
                })}
            </Container>
        </div>
    )
}

export default Lotes