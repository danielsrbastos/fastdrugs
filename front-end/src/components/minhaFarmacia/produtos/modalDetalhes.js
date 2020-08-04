import React from 'react'
import { Modal } from 'react-bootstrap'

import Slider from '../../listagemFarmacias/slider'

function ModalDetalhes({ show, produto, handleCloseModal }) {

    return (
        <div>
            {produto.id_produto ?
                <Modal
                    show={show}
                    onHide={() => handleCloseModal()}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <h3 className="defaultText" style={{ color: '#4a4a4a', fontSize: 20, marginBottom: 0, float: 'right', marginRight: 10 }}>{produto.nome}</h3>
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

                            {produto.ImagemProduto.map(imagem => {
                                console.log(imagem.url_imagem)
                                return (
                                    <div style={{ height: 250, minWidth: 250, width: 'auto', marginRight: 10 }} key={imagem.id_imagem}>
                                        <img src={imagem.url_imagem} alt={`Imagem ${produto.nome}`} style={{ height: 250 }} />
                                    </div>
                                )
                            })}
                        </Slider>

                        <p style={{ fontSize: 16, marginTop: 15 }}>{produto.descricao}</p>
                    </Modal.Body>

                    <Modal.Footer>

                    </Modal.Footer>
                </Modal> : null}
        </div>
    )
}

export default ModalDetalhes