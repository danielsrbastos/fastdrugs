import React, { useState, useEffect } from 'react'
import { Modal, Container, Row, Col, Button } from 'react-bootstrap'
import PubSub from 'pubsub-js'

import Slider from '../../listagemFarmacias/slider'

import '../styles.css'

import { setTokenAsDefaultHeader } from '../../../services/authService'
import api from '../../../services/api'

function ModalReceita({ recipe, show, handleCloseModal, socket, id_farmacia }) {

    const [produtos, setProdutos] = useState([])
    const [produtosSelecionados, setProdutosSelecionados] = useState([])
    const [produtoBuscar, setProdutoBuscar] = useState('')

    useEffect(() => {
        (async () => {
            setTokenAsDefaultHeader()

            try {
                const { data } = await api.get(`/farmacias/${id_farmacia}/produtos`)
                setProdutos(data)
            } catch (e) {
                return console.log(e.response)
            }
        })()
    }, [])

    return (
        <div>
            <Modal
                show={show}
                onHide={() => {
                    setProdutosSelecionados([])
                    setProdutoBuscar('')
                    handleCloseModal()
                }}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <h3 className="defaultText" style={{ color: '#4a4a4a', fontSize: 20, marginBottom: 0, float: 'right', marginRight: 10 }}>Receita Médica</h3>
                </Modal.Header>

                <Modal.Body id="boxInputs" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <img style={{ width: 'auto', height: 150 }} src={recipe.urlImage} alt={recipe.filename} />
                        <a style={{ fontSize: 14, color: '#ccc' }} href={recipe.urlImage} target="_blank" rel="noopener noreferrer">Abrir numa nova guia</a>
                    </div>

                    <div style={{ width: '100%', height: '0.05px', borderBottom: '1px solid #dee2e6', marginBottom: 15, marginTop: 13 }}></div>

                    <div>
                        <Container style={{ padding: 0 }}>
                            <label className="inputText" style={{ width: '20%', alignSelf: 'flex-end' }}>Buscar</label>

                            <input
                                type="text"
                                placeholder="Ex: Amoxicilina"
                                value={produtoBuscar}
                                onChange={e => setProdutoBuscar(e.target.value)}
                            />
                        </Container>

                        <Slider
                            options={{
                                adaptiveHeight: true,
                                pageDots: false,
                                prevNextButtons: false,
                                freeScroll: true,
                                cellAlign: 'left'
                            }}>

                            {produtos.map(produto => {
                                produto.quantidade = 1

                                return (
                                    <div id={produto.id_produto} style={{ height: 'auto', padding: 10, border: '0.4px solid #CCCCCC', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 5, cursor: 'pointer', marginRight: 10 }} key={produto.id_produto}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <p className="textoDelivery"
                                                style={{ textAlign: 'center', fontSize: 20, marginBottom: 5 }}>
                                                {produto.nome}
                                            </p>

                                            <p className="textoDelivery descricao"
                                                style={{ width: 170, textAlign: 'center', fontSize: 16, color: '#898686', fontWeight: 0 }}>
                                                {produto.descricao}
                                            </p>

                                            <Button id={produto.id_produto + '_button'} variant="" className="" onClick={() => {
                                                const p = document.getElementById(produto.id_produto)
                                                const pb = document.getElementById(produto.id_produto + '_button')

                                                if (p.classList.contains('selectedProduct')) {
                                                    p.classList.remove('selectedProduct')
                                                    pb.classList.remove('btn-outline-danger')
                                                    pb.innerHTML = 'Adicionar'

                                                    const produtosF = produtosSelecionados.filter(({ id_produto }) => id_produto !== produto.id_produto)
                                                    setProdutosSelecionados([...produtosF])
                                                }
                                                else {
                                                    p.classList.add('selectedProduct')
                                                    pb.classList.add('btn-outline-danger')
                                                    pb.innerHTML = 'Remover'

                                                    setProdutosSelecionados([...produtosSelecionados, produto])
                                                }
                                            }}>
                                                Adicionar
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })}
                        </Slider>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Row style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                        <p>
                            Produtos Selecionados:
                        </p>
                        <Container style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            {produtosSelecionados.map((produto, i) => {
                                return (
                                    <p key={produto.id_produto} style={{ fontFamily: 'Roboto', fontWeight: 'bold' }}>
                                        {produto.nome} <span style={{ marginRight: 10, marginLeft: 10 }}>{i === (produtosSelecionados.length - 1) ? '' : '-'}</span>
                                    </p>
                                )
                            })}
                        </Container>
                    </Row>

                    <Row style={{ width: '100%' }}>
                        <Col md={6}>
                            <Button variant="success" style={{ width: '100%' }} onClick={() => {
                                socket.emit('returnProduct', {
                                    cliente: recipe.clientId,
                                    products: produtosSelecionados
                                })

                                socket.emit('deleteRecipe', {
                                    clientId: recipe.clientId,
                                    pharmacyId: recipe.pharmacyId,
                                })
                                
                                PubSub.publish('refreshRecipes', recipe)
                                setProdutosSelecionados([])
                                setProdutoBuscar('')
                                handleCloseModal()
                            }}>
                                Enviar
                            </Button>
                        </Col>
                        <Col md={6}>
                            <Button variant="danger" style={{ width: '100%' }} onClick={() => {
                                socket.emit('returnProduct', {
                                    cliente: recipe.clientId,
                                    error: 'recipe rejected',
                                    msg: 'Ilegível'
                                })

                                socket.emit('deleteRecipe', {
                                    clientId: recipe.clientId,
                                    pharmacyId: recipe.pharmacyId,
                                })

                                PubSub.publish('refreshRecipes', recipe)
                                setProdutosSelecionados([])
                                setProdutoBuscar('')
                                handleCloseModal()
                            }}>
                                Rejeitar
                            </Button>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ModalReceita


