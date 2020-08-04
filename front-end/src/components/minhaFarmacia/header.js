import React from 'react'
import { Row, Container, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import './styles.css'

import { AiFillHome } from 'react-icons/ai'
import { FaClinicMedical } from 'react-icons/fa'

import ButtonSair from '../buttons/buttonSair'

import fastDrugs from '../../assets/fastdrugs-white-horizontal.png'

function Header() {
    return (
        <Row id="header">
            <Container>
                <Col md={11}>
                    <Link to="/" style={{ width: 120 }}>
                        <img src={fastDrugs} alt="Fast Drugs" id="fastDrugs" />
                    </Link>
                    <Link className="headerLink" to="/" style={{ width: 140, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <div style={{ marginRight: 10, width: 18 }}>
                            <AiFillHome />
                        </div>
                        Página Inicial
                    </Link>
                    <Link className="headerLink" to="/minha-farmacia" style={{ marginLeft: 30, width: 160, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <div style={{ marginRight: 10, width: 18 }}>
                            <FaClinicMedical />
                        </div>
                        Minha Farmácia
                    </Link>
                </Col>
                <Col md={1}>
                    <ButtonSair type="farmacia" />
                </Col>
            </Container>
        </Row>
    )
}

export default Header