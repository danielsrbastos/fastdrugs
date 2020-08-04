import React, { useState, useEffect } from 'react'
import { Spinner, Container, Col, Row, Link, Button } from 'react-bootstrap'
import socketio from 'socket.io-client'
import PubSub from 'pubsub-js'

import '../styles.css'

import ModalReceita from './modalReceita'

function getDistinctArray(arr) {
    var dups = {};
    return arr.filter(function (el) {
        var hash = el.valueOf();
        var isDup = dups[hash];
        dups[hash] = true;
        return !isDup;
    });
}

function ReceitaMedica({ farmacia, socket, receivedRecipes }) {

    const [recipes, setRecipes] = useState([])

    const [showModal, setShowModal] = useState(false)
    const [modalData, setModalData] = useState(false)

    const [recipesRefreshed, setRecipesRefreshed] = useState(true)

    useEffect(() => {
        if (recipesRefreshed) {
            setRecipes([...recipes, ...getDistinctArray(receivedRecipes)])
            setRecipesRefreshed(false)
        }
    }, [])

    socket.on('received', recipe => {
        setRecipes(getDistinctArray([...recipes, recipe]))
    })

    PubSub.subscribe('refreshRecipes', (msg, recipe) => {
        setRecipes(recipes.filter(r => r.filename !== recipe.filename))
    })

    return (
        <div id="boxInputs" style={{ paddingBottom: '300px' }}>
            <ModalReceita show={showModal} handleCloseModal={() => setShowModal(false)} recipe={modalData} socket={socket} id_farmacia={farmacia.id_farmacia} />

            <h3 style={{ fontSize: 30, fontWeight: 'bold', color: '#323232', marginBottom: 30, marginTop: 30 }}>Receitas Médicas</h3>

            <div style={{ width: '100%', height: 1, border: 'solid 0.1px #ccc', marginBottom: 30 }}></div>

            {recipes.length === 0 ? <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <p style={{ marginBottom: 5, fontSize: 20, fontWeight: '700' }}>Você não tem nenhuma receita médica para analisar<span style={{ fontWeight: 'normal', fontStyle: 'italic', marginLeft: 10 }}>:(</span></p>

                <div style={{ width: '100%', height: 1, border: 'solid 0.1px #ccc', marginTop: 23 }}></div>
            </div> : ''}

            <Container id="listaCategorias" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 0 }}>
                {recipes.map(recipe => {
                    return (
                        <div className="categoria" key={recipe.filename} style={{ width: '100%', padding: 5 }}>
                            <Row>
                                <Col md={6} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <img style={{ width: 'auto', height: 40 }} src={recipe.urlImage} alt={recipe.filename} />
                                    <p className="defaultText" style={{ float: 'left', color: '#171717', marginRight: 10, marginLeft: 15 }}>Horário:</p>
                                    <p className="defaultText" style={{ float: 'left', color: '#171717' }}> {(() => {
                                        const date = new Date(recipe.date)
                                        const dateSplitted = date.toString().split(' ')

                                        return `${date.getDate()}/${date.getMonth().toString().length === 1 ? '0' + (date.getMonth() + 1) : date.getMonth()}/${date.getFullYear()} às ${dateSplitted[4].substring(0, 5)}`
                                    })()}</p>
                                </Col>
                                <Col md={6} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <Button variant="light" onClick={() => {
                                        setModalData(recipe)
                                        setShowModal(true)
                                    }}>
                                        Analisar
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

export default ReceitaMedica