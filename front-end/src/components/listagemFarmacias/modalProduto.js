import React, { useState } from 'react'
import { Modal, Button, InputGroup, FormControl, Alert } from 'react-bootstrap'

import Slider from './slider'

import CestaDeCompras from '../../services/cestaService'

function ModalProduto({ show, handleCloseModal, product }) {

    const [quantidade, setQuantidade] = useState(1)
    const [displayAlert, setDisplayAlert] = useState(false)
    const [displayErrorAlert, setDisplayErrorAlert] = useState(false)

    const adicionarCesta = product => {
        if (!CestaDeCompras.addProduct(product))
            setDisplayErrorAlert(true)
        else 
            setDisplayAlert(true)
    }

    const clearBasketAndAddProduct = product => {
        CestaDeCompras.clearCesta()
        CestaDeCompras.addProduct(product)
        setDisplayErrorAlert(false)
        setDisplayAlert(true)
    }

    return (
        <div>
            {typeof product.nome !== 'undefined' ?
                <Modal
                    show={show}
                    onHide={() => {
                        setQuantidade(1)
                        setDisplayAlert(false)
                        setDisplayErrorAlert(false)
                        handleCloseModal()
                    }}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <h1>{product.nome}</h1>
                    </Modal.Header>

                    <Modal.Body>
                        <Slider
                            options={{
                                adaptiveHeight: true,
                                pageDots: false,
                                prevNextButtons: false,
                                freeScroll: true,
                                cellAlign: 'left'
                            }}>

                            {product.ImagemProduto.map(imagem => {
                                return (
                                    <div style={{ height: 250, marginRight: 10 }} key={imagem.id_imagem}>
                                        <img src={imagem.url_imagem} alt={`Imagem ${product.nome}`} style={{ height: 250 }} />
                                    </div>
                                )
                            })}
                        </Slider>

                        <p style={{ fontSize: 16, marginTop: 15 }}>{product.descricao}</p>
                    </Modal.Body>

                    <Modal.Footer>
                        {displayAlert ? <>
                            <Alert variant="success" style={{ width: '100%', marginBottom: 15 }}>
                                {"Foi adicionado " + quantidade + " unidade(s) de " + product.nome + " à cesta de compras."}
                                {() => setQuantidade(1)}
                            </Alert>
                        </> : <></>}

                        {displayErrorAlert ? <>
                            <Alert variant="danger" style={{ width: '100%', marginBottom: 15 }}>
                                Não é possível adicionar produtos de farmácias diferentes na cesta, gostaria de limpá-lo e adicionar o seguinte produto?
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button variant="success" style={{ marginTop: 5, marginLeft: 10 }} onClick={() => clearBasketAndAddProduct({ ...product, quantidade: parseInt(quantidade) })}>Sim</Button>
                                    <Button variant="danger" style={{ marginTop: 5, marginLeft: 10 }} onClick={() => setDisplayErrorAlert(false)}>Não</Button>
                                </div>
                            </Alert>
                        </> : <></>}

                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="Quantidade"
                                aria-label="Quantidade"
                                aria-describedby="basic-addon2"
                                type="number"
                                value={quantidade}
                                onChange={e => setQuantidade(e.target.value)}
                            />
                            <InputGroup.Append>
                                <Button variant="outline-dark" onClick={() => adicionarCesta({ ...product, quantidade: parseInt(quantidade) })}>Adicionar à Cesta</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Modal.Footer>
                </Modal> :
                <></>
            }
        </div>
    )
}

export default ModalProduto
