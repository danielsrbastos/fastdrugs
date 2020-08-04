import React, { useState, useEffect } from 'react'
import { Button, Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import fastDrugs from '../../assets/fastdrugs-white.png'

import './styles.css'

function Rodape() {
    return (
        <div>
            <Row style={{backgroundColor: '#002060', height: 130, marginTop: 70}}>
                <Container className="rodape">
                    <div className="text-center" style={{width: 200, height: 130}}><img height="130" width="150" src={fastDrugs} alt="Fast Drugs" id="fastDrugs" /></div>
                    <div className="rodape_text"> 
                        <p className="p-rodape">2020 Copyright - FastDrugs - Plataforma de serviços FastDrugs Ltda.</p>
                        <p className="p-rodape">Rua Elton Silva, 905 - Centro, Jandira/SP - CEP 06600-025</p>
                    </div>
                </Container>
            </Row>
        </div>
    );
}

export default Rodape