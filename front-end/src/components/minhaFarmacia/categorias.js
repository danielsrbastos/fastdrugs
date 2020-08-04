import React, { useState, useEffect } from 'react'
import { Container, Button, Row, Col, Spinner } from 'react-bootstrap'

import './styles.css'
import '../login/farmacia/styles.css'

import { TiDelete } from 'react-icons/ti'

import api from '../../services/api'
import { getToken } from '../../services/authService'

function Categorias({ farmacia }) {

    const [categoriaBuscar, setCategoriaBuscar] = useState('')
    const [categoria, setCategoria] = useState('')
    const [categorias, setCategorias] = useState([])
    const [categoriasList, setCategoriasList] = useState([])

    const [token] = useState(getToken('farmacia'))
    const [refreshCategorias, setRefreshCategorias] = useState(true)
    const [disabledButton, setDisabledButton] = useState(false)

    useEffect(() => {
        if (refreshCategorias) {
            (async () => {
                try {
                    const { data } = await api.get(`/farmacias/${farmacia.id_farmacia}/categorias`)

                    setCategorias(data)
                    setCategoriasList(data)
                    setRefreshCategorias(false)
                } catch (e) {
                    return e.response.data
                }
            })()
        }
    }, [farmacia.id_farmacia, token, refreshCategorias])

    const handleSubmit = async (e) => {
        e.preventDefault()

        setDisabledButton(true)

        try {
            await api.post(`/farmacias/${farmacia.id_farmacia}/categorias`, { nome: categoria })
            setRefreshCategorias(true)
            setDisabledButton(false)
        } catch (e) {
            return e.response.data
        }
    }

    useEffect(() => {
        if (categoriaBuscar)
            setCategoriasList(categorias.filter((categoria, i) => categoria.nome.toLowerCase().includes(categoriaBuscar.toLowerCase())))
        else if (categoriaBuscar === '')
            setCategoriasList(categorias)
    }, [categoriaBuscar, categorias])

    return (
        <div id="boxInputs" style={{ paddingBottom: '300px' }}>
            <form onSubmit={handleSubmit}>
                <Container>
                    <label className="inputText">Nome da categoria</label>

                    <input
                        type="text"
                        placeholder="Genéricos"
                        value={categoria}
                        onChange={e => setCategoria(e.target.value)}
                    />
                </Container>

                <Container>
                    <Button style={{ fontSize: 18, marginTop: -3 }} id="btnEntrar" className="transition" type="submit" disabled={disabledButton ? 'disabled' : ''}>
                        Cadastrar Categoria
                    </Button>
                </Container>
            </form>

            <Container><div style={{ width: '100%', height: 1, border: 'solid 0.1px #ccc', marginTop: 30 }}></div></Container>

            <Container>
                <label className="inputText">Buscar</label>

                <input
                    type="text"
                    placeholder="Ex: Dor de cabeça"
                    value={categoriaBuscar}
                    onChange={e => setCategoriaBuscar(e.target.value)}
                />
            </Container>

            <Container id="listaCategorias" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Spinner animation="border" role="status" style={{ marginTop: 100, display: refreshCategorias ? 'block' : 'none' }}>
                    <span className="sr-only">Loading...</span>
                </Spinner>

                {categoriasList.map(categoria => {
                    return (
                        <div className="categoria" key={categoria.id_categoria} style={{ width: '100%' }}>
                            <Row>
                                <Col md={10} style={{ padding: 10, paddingLeft: 30 }}>
                                    <p className="defaultText">{categoria.nome}</p>
                                </Col>
                                <Col md={2} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <div style={{ color: '#303030', height: '100%' }}>
                                        <Button title="Remover" variant="light" style={{ height: '100%', borderRadius: 0, borderRight: 0 }}
                                            onClick={async () => {
                                                await api.delete(`/farmacias/${farmacia.id_farmacia}/categorias/${categoria.id_categoria}`)
                                                setRefreshCategorias(true)
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

export default Categorias