import React, { useState, useMemo, useEffect } from 'react'
import { Col, Row, Container, Button, OverlayTrigger, Tooltip } from 'react-bootstrap'

import camera from '../../../assets/camera.svg'

import './styles.css'

import { kmMask, reaisMask, horaMask } from '../../../utils/fieldsMask'

function CadastroFarmaciaThirdStep({ boxRightSize, handleSubmit }) {

    const [imagem, setImagem] = useState('')
    const [segSexAbre, setSegSexAbre] = useState('')
    const [segSexFecha, setSegSexFecha] = useState('')
    const [sabAbre, setSabAbre] = useState('')
    const [sabFecha, setSabFecha] = useState('')
    const [domFerAbre, setDomFerAbre] = useState('')
    const [domFerFecha, setDomFerFecha] = useState('')
    const [distanciaMaximaEntrega, setDistanciaMaximaEntrega] = useState('')
    const [precoPorKm, setPrecoPorKm] = useState('')
    const [distanciaMaximaFreteGratis, setDistanciaMaximaFreteGratis] = useState('')

    const [invalidSegSexAbre, setInvalidSegSexAbre] = useState('')
    const [invalidSegSexFecha, setInvalidSegSexFecha] = useState('')
    const [invalidSabAbre, setInvalidSabAbre] = useState('')
    const [invalidSabFecha, setInvalidSabFecha] = useState('')
    const [invalidDomFerAbre, setInvalidDomFerAbre] = useState('')
    const [invalidDomFerFecha, setInvalidDomFerFecha] = useState('')
    const [invalidDistanciaMaximaEntrega, setInvalidDistanciaMaximaEntrega] = useState('')
    const [invalidPrecoPorKm, setInvalidPrecoPorKm] = useState('')

    const [distanciaMaximaFreteGratisVisibility, setDistanciaMaximaFreteGratisVisibility] = useState(false)

    const [disabledButton, setDisabledButton] = useState(false)

    const handleSubmitMiddleware = async e => {
        e.preventDefault()

        setDisabledButton(true)
        let invalidFields = false

        if (invalidDistanciaMaximaEntrega === '') {
            setInvalidDistanciaMaximaEntrega(true)
            invalidFields = true
        }

        if (invalidPrecoPorKm === '') {
            setInvalidPrecoPorKm(true)
            invalidFields = true
        }

        if (invalidSegSexAbre === '') {
            setInvalidSegSexAbre(true)
            invalidFields = true
        }

        if (invalidSegSexFecha === '') {
            setInvalidSegSexFecha(true)
            invalidFields = true
        }

        if (invalidSabAbre === '') {
            setInvalidSabAbre(true)
            invalidFields = true
        }

        if (invalidSabFecha === '') {
            setInvalidSabFecha(true)
            invalidFields = true
        }

        if (invalidDomFerAbre === '') {
            setInvalidDomFerAbre(true)
            invalidFields = true
        }

        if (invalidDomFerFecha === '') {
            setInvalidDomFerFecha(true)
            invalidFields = true
        }

        if (invalidDistanciaMaximaEntrega || invalidPrecoPorKm || invalidSegSexAbre || invalidSegSexFecha || invalidSabAbre || invalidSabFecha || invalidDomFerAbre || invalidDomFerFecha || invalidFields) {
            setDisabledButton(false)
            return false
        }

        handleSubmit({
            imagem,
            segSex: segSexAbre + ' - ' + segSexFecha,
            sab: sabAbre + ' - ' + sabFecha,
            domFer: domFerAbre + ' - ' + domFerFecha,
            distanciaMaximaEntrega: distanciaMaximaEntrega.replace(/\D/g, ''),
            precoPorKm: precoPorKm.replace('R$', '').replace(',', '.'),
            distanciaMaximaFreteGratis: distanciaMaximaFreteGratis.replace(/\D/g, '')
        }, {
            step: 4,
            boxLeftSize: 8,
            boxRightSize: 4
        })

        setDisabledButton(false)
    }

    /* Validações */
    useEffect(() => {
        /* segSexAbre */
        if (segSexAbre !== '' && segSexAbre.length < 4)
            setInvalidSegSexAbre(true)
        else if (segSexAbre !== '')
            setInvalidSegSexAbre(false)

        /* segSexFecha */
        if (segSexFecha !== '' && segSexFecha.length < 4)
            setInvalidSegSexFecha(true)
        else if (segSexFecha !== '')
            setInvalidSegSexFecha(false)

        /* sabAbre */
        if (sabAbre !== '' && sabAbre.length < 4)
            setInvalidSabAbre(true)
        else if (sabAbre !== '')
            setInvalidSabAbre(false)

        /* sabFecha */
        if (sabFecha !== '' && sabFecha.length < 4)
            setInvalidSabFecha(true)
        else if (sabFecha !== '')
            setInvalidSabFecha(false)

        /* domFerAbre */
        if (domFerAbre !== '' && domFerAbre.length < 4)
            setInvalidDomFerAbre(true)
        else if (domFerAbre !== '')
            setInvalidDomFerAbre(false)

        /* domFerFecha */
        if (domFerFecha !== '' && domFerFecha.length < 4)
            setInvalidDomFerFecha(true)
        else if (domFerFecha !== '')
            setInvalidDomFerFecha(false)

        /* distanciaMaximaEntrega */
        if (distanciaMaximaEntrega !== '')
            setInvalidDistanciaMaximaEntrega(false)

        /* precoPorKm */
        if (precoPorKm !== '' && precoPorKm.length < 1)
            setInvalidPrecoPorKm(true)
        if (precoPorKm !== '')
            setInvalidPrecoPorKm(false)
    }, [segSexAbre, segSexFecha, sabAbre, sabFecha, domFerAbre, domFerFecha, distanciaMaximaEntrega, precoPorKm])

    const setHorario = (value, periodo) => {
        const periodos = {
            setSegSexAbre: setSegSexAbre,
            setSegSexFecha: setSegSexFecha,
            setSabAbre: setSabAbre,
            setSabFecha: setSabFecha,
            setDomFerAbre: setDomFerAbre,
            setDomFerFecha: setDomFerFecha
        }

        periodos[periodo](horaMask(value))
    }

    const preview = useMemo(() => {
        return imagem ? URL.createObjectURL(imagem) : null
    }, [imagem])


    const setDistanciaMaximaEntregaMiddlware = value => {
        setDistanciaMaximaEntrega(kmMask(value))
    }

    const setPrecoPorKmMiddleware = value => {
        setPrecoPorKm(reaisMask(value))
    }

    const setDistanciaMaximaFreteGratisMiddleware = value => {
        setDistanciaMaximaFreteGratis(kmMask(value))
    }

    return (
        <Col id="boxLeft" md={boxRightSize}>
            <div id="boxInputs">
                <form onSubmit={e => handleSubmitMiddleware(e)}>
                    <Container>
                        <Row>
                            <Col md={5} id="imagemInput">
                                <div className="text-center">
                                    <label className="inputText" style={{ paddingLeft: 0 }}>Logo da farmácia</label>
                                </div>
                                <label
                                    id="thumbnail"
                                    style={{ backgroundImage: `url(${preview})` }}
                                    className={imagem ? 'has-thumbnail' : ''}
                                >
                                    <input type="file" onChange={event => setImagem(event.target.files[0])} />
                                    <img src={camera} alt="Ícone seleção" />
                                </label>
                            </Col>

                            <Col md={7}>
                                <div className="mb-4">
                                    <label className="inputText">Segunda à sexta</label>
                                    <div className="boxInputFlex">
                                        <div className="inputFlex" style={{ width: '50%' }}>
                                            <input
                                                type="text"
                                                placeholder="10:00h"
                                                onChange={e => setHorario(e.target.value, 'setSegSexAbre')}
                                                value={segSexAbre}
                                                style={invalidSegSexAbre ? { border: '1px solid #dc3545' } : { border: 'solid 1px #ccc' }}
                                            />
                                            {invalidSegSexAbre ? <div className="invalid-feedback">Informe um horário válido.</div> : ''}
                                        </div>

                                        <div className="inputText ml-4 mr-4" style={{ paddingLeft: 0, marginTop: '12px' }}>
                                            às
                                        </div>

                                        <div className="inputFlex" style={{ width: '50%' }}>
                                            <input
                                                type="text"
                                                placeholder="20:00h"
                                                onChange={e => setHorario(e.target.value, 'setSegSexFecha')}
                                                value={segSexFecha}
                                                style={invalidSegSexFecha ? { border: '1px solid #dc3545' } : { border: 'solid 1px #ccc' }}
                                            />
                                            {invalidSegSexFecha ? <div className="invalid-feedback">Informe um horário válido.</div> : ''}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="inputText">Sábados</label>
                                    <div className="boxInputFlex">
                                        <div className="inputFlex" style={{ width: '50%' }}>
                                            <input
                                                type="text"
                                                placeholder="08:00h"
                                                onChange={e => setHorario(e.target.value, 'setSabAbre')}
                                                value={sabAbre}
                                                style={invalidSabAbre ? { border: '1px solid #dc3545' } : { border: 'solid 1px #ccc' }}
                                            />
                                            {invalidSabAbre ? <div className="invalid-feedback">Informe um horário válido.</div> : ''}
                                        </div>

                                        <div className="inputText ml-4 mr-4" style={{ paddingLeft: 0, marginTop: '12px' }}>
                                            às
                                        </div>

                                        <div className="inputFlex" style={{ width: '50%' }}>
                                            <input
                                                type="text"
                                                placeholder="18:00h"
                                                onChange={e => setHorario(e.target.value, 'setSabFecha')}
                                                value={sabFecha}
                                                style={invalidSabFecha ? { border: '1px solid #dc3545' } : { border: 'solid 1px #ccc' }}
                                            />
                                            {invalidSabFecha ? <div className="invalid-feedback">Informe um horário válido.</div> : ''}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="inputText">Domingos e feriados</label>
                                    <div className="boxInputFlex">
                                        <div className="inputFlex" style={{ width: '50%' }}>
                                            <input
                                                type="text"
                                                placeholder="08:00h"
                                                onChange={e => setHorario(e.target.value, 'setDomFerAbre')}
                                                value={domFerAbre}
                                                style={invalidDomFerAbre ? { border: '1px solid #dc3545' } : { border: 'solid 1px #ccc' }}
                                            />
                                            {invalidDomFerAbre ? <div className="invalid-feedback">Informe um horário válido.</div> : ''}
                                        </div>

                                        <div className="inputText ml-4 mr-4" style={{ paddingLeft: 0, marginTop: '12px' }}>
                                            às
                                        </div>

                                        <div className="inputFlex" style={{ width: '50%' }}>
                                            <input
                                                type="text"
                                                placeholder="14:00h"
                                                onChange={e => setHorario(e.target.value, 'setDomFerFecha')}
                                                value={domFerFecha}
                                                style={invalidDomFerFecha ? { border: '1px solid #dc3545' } : { border: 'solid 1px #ccc' }}
                                            />
                                            {invalidDomFerFecha ? <div className="invalid-feedback">Informe um horário válido.</div> : ''}
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>

                    <Container>
                        <label className="inputText">Distância máxima de entrega (km)</label>

                        <OverlayTrigger
                            placement="top"
                            delay={{ show: 150, hide: 400 }}
                            overlay={<Tooltip>Distância (em quilômetros) máxima em que sua farmácia irá entregar.</Tooltip>}
                        >
                            <label className="inputText tooltipTrigger">?</label>
                        </OverlayTrigger>

                        <input
                            type="text"
                            placeholder="0 km"
                            onChange={e => setDistanciaMaximaEntregaMiddlware(e.target.value)}
                            value={distanciaMaximaEntrega}
                            style={invalidDistanciaMaximaEntrega ? { border: '1px solid #dc3545' } : { border: 'solid 1px #ccc' }}
                        />
                        {invalidDistanciaMaximaEntrega ? <div className="invalid-feedback">Informe uma distância válida.</div> : ''}
                    </Container>

                    <Container>
                        <label className="inputText">Valor cobrado por km</label>

                        <OverlayTrigger
                            placement="top"
                            delay={{ show: 150, hide: 400 }}
                            overlay={<Tooltip>Valor cobrado de acordo com a distância (por quilômetro)</Tooltip>}
                        >
                            <label className="inputText tooltipTrigger">?</label>
                        </OverlayTrigger>

                        <input
                            type="text"
                            placeholder="R$ 0,00"
                            onChange={e => setPrecoPorKmMiddleware(e.target.value)}
                            value={precoPorKm}
                            style={invalidPrecoPorKm ? { border: '1px solid #dc3545' } : { border: 'solid 1px #ccc' }}
                        />
                        {invalidPrecoPorKm ? <div className="invalid-feedback">Informe um preço válido.</div> : ''}
                    </Container>

                    <Container className="text-center containerCheckbox">
                        <input className="inputCheckbox"
                            type="checkbox"
                            id="checkboxFreteGratis"
                            onChange={e => setDistanciaMaximaFreteGratisVisibility(e.target.checked)}
                            checked={distanciaMaximaFreteGratisVisibility}
                        />
                        <label className="inputText" htmlFor="checkboxFreteGratis">Oferecer frete grátis</label>
                    </Container>

                    <Container style={{ display: !distanciaMaximaFreteGratisVisibility ? 'none' : 'block' }}>
                        <label className="inputText">Distância máxima para frete grátis (km)</label>

                        <OverlayTrigger
                            placement="top"
                            delay={{ show: 150, hide: 400 }}
                            overlay={<Tooltip>Distância (em quilômetros) máxima em que sua farmácia irá oferecer frete grátis.</Tooltip>}
                        >
                            <label className="inputText tooltipTrigger">?</label>
                        </OverlayTrigger>

                        <input
                            type="text"
                            placeholder="0 km"
                            onChange={e => setDistanciaMaximaFreteGratisMiddleware(e.target.value)}
                            value={distanciaMaximaFreteGratis}
                        />
                    </Container>

                    <Container>
                        <Button variant="light" id="btnEntrar" type="submit" disabled={disabledButton ? 'disabled' : ''}>FINALIZAR CADASTRO</Button>
                    </Container>
                </form>
            </div>
        </Col>
    )
}

export default CadastroFarmaciaThirdStep