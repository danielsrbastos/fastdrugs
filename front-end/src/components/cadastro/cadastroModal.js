import React from 'react'
import { Modal, Button, Row, Col } from 'react-bootstrap'

import './styles.css'

import clientes from '../../assets/clientes.png'
import farmacia from '../../assets/farmacia.png'

function CadastroModal({ show, handleClose, history }) {

    return (
        <div>
            <Modal
                show={show}
                onHide={handleClose}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton />

                <Modal.Body id="modal-body">
                    <Row>
                        <Col md={6}>
                            <Button variant="light" id="button-cliente" onClick={() => history.push('/cadastrar/cliente')}>
                                <span>Cadastrar como cliente</span>
                                <img src={clientes} alt="Cliente" />
                            </Button>
                        </Col>

                        <Col md={6}>
                            <Button variant="primary" id="button-farmacia" onClick={() => history.push('/cadastrar/farmacia')}>
                                <span>Cadastrar como farmácia</span>
                                <img src={farmacia} alt="Farmácia" />
                            </Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default CadastroModal