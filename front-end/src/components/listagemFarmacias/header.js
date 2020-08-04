import React from 'react'
import { Row, Container, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import './styles.css'

import { IoIosBasket } from 'react-icons/io'
import { AiFillHome } from 'react-icons/ai'
import { FaListUl } from 'react-icons/fa'
import { MdEventNote } from 'react-icons/md'

import ButtonSair from '../buttons/buttonSair'

import fastDrugs from '../../assets/fastdrugs-white-horizontal.png'

function Header() {
    return (
        <Row id="header">
            <Container>
                <Col md={9}>
                    <Link to="/" style={{ width: 120 }}>
                        <img src={fastDrugs} alt="Fast Drugs" id="fastDrugs" />
                    </Link>
                    <Link className="headerLink" to="/" style={{ width: 140, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }} >
                        <div style={{ marginRight: 10, width: 18 }}>
                            <AiFillHome />
                        </div>
                        Página Inicial
                    </Link>
                    <Link className="headerLink" to="/lista-farmacias" style={{ marginLeft: 30, width: 180, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <div style={{ marginRight: 10, width: 18 }}>
                            <FaListUl />
                        </div>
                        Lista de Farmácias
                    </Link>
                    <Link className="headerLink" to="/meus-pedidos" style={{ marginLeft: 25, width: 150, display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <div style={{ marginRight: 10, width: 18 }}>
                            <MdEventNote />
                        </div>
                        Meus Pedidos
                    </Link>
                </Col>
                <Col md={1}>
                    
                </Col>
                <Col md={1}>
                    <Link className="headerLink" to="/cesta" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <div style={{ marginRight: 10 }}>
                            <IoIosBasket />
                        </div>
                        Cesta
                </Link>
                </Col>
                <Col md={1}>
                    <ButtonSair type="cliente" />
                </Col>
            </Container>
        </Row>
    )
}

export default Header