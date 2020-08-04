import React, { useState, useMemo, useEffect } from 'react'
import { Container, Button, Row, Col, OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap'

import camera from '../../assets/camera.svg'

import './styles.css'
import '../login/farmacia/styles.css'

import api from '../../services/api'

import { getToken, getId } from '../../services/authService'
import { telefoneMask, horaMask, kmMask, reaisMask } from '../../utils/fieldsMask'

function FarmaciaDados() {

    const [nome, setNome] = useState('')
    const [telefone, setTelefone] = useState('')
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

    const [token] = useState(getToken('farmacia'))
    const [id] = useState(getId('farmacia'))
    const [disabledButton, setDisabledButton] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        setDisabledButton(true)

        let deleteFieldFreteGratis = false

        const dataPostFarmacia = {
            nome,
            telefone,
            seg_sex: segSexAbre + ' - ' + segSexFecha,
            sab: sabAbre + ' - ' + sabFecha,
            dom_fer: domFerAbre + ' - ' + domFerFecha,
            distancia_maxima_entrega: distanciaMaximaEntrega.replace(/\D/g, ''),
            preco_por_km: precoPorKm.replace('R$', '').replace(',', '.').trim(),
            distancia_maxima_frete_gratis: distanciaMaximaFreteGratis ? distanciaMaximaFreteGratis.replace(/\D/g, '') : deleteFieldFreteGratis = true
        }

        if (deleteFieldFreteGratis) delete dataPostFarmacia.distanciaMaximaFreteGratis

        try {
            await api.put(`/farmacias/${id}`, dataPostFarmacia)

            if (typeof imagem === 'object') {
                const dataPostImagem = new FormData()
                dataPostImagem.append('farmacia', imagem)

                await api.post(`/farmacias/${id}/imagem`, dataPostImagem)
            }

            setDisabledButton(false)
        } catch (e) {
            return console.log(e.response)
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get(`/farmacias/${id}`)

                const farmacia = data

                setNome(farmacia.nome)
                setTelefone(farmacia.telefones[0].telefone)
                setSegSexAbre(farmacia.seg_sex.split('-')[0].trim())
                setSegSexFecha(farmacia.seg_sex.split('-')[1].trim())
                setSabAbre(farmacia.sab.split('-')[0].trim())
                setSabFecha(farmacia.sab.split('-')[1].trim())
                setDomFerAbre(farmacia.dom_fer.split('-')[0].trim())
                setDomFerFecha(farmacia.dom_fer.split('-')[1].trim())
                setDistanciaMaximaEntrega(`${farmacia.distancia_maxima_entrega} km`)
                setPrecoPorKm(`R$ ${farmacia.preco_por_km}`)
                setDistanciaMaximaFreteGratis(`${farmacia.distancia_maxima_frete_gratis} km`)
                setImagem(farmacia.url_imagem)
            } catch (e) {
                return console.log(e.response)
            }
        })()
    }, [token, id])

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
            setSegSexAbre,
            setSegSexFecha,
            setSabAbre,
            setSabFecha,
            setDomFerAbre,
            setDomFerFecha
        }

        periodos[periodo](horaMask(value))
    }

    const preview = useMemo(() => {
        return typeof imagem === 'object' ? URL.createObjectURL(imagem) : imagem
    }, [imagem])

    return (
        <div>
            <div id="boxInputs" style={{ display: 'flex', flexDirection: 'col', alignContent: 'center', justifyContent: 'center' }}>
                <Spinner animation="border" role="status" style={{ marginTop: 300, display: nome !== '' ? 'none' : 'block' }}>
                    <span className="sr-only">Loading...</span>
                </Spinner>

                <form onSubmit={handleSubmit} style={{ width: '100%', display: nome === '' ? 'none' : 'block' }}>
                    <Container className="boxInputFlex">
                        <div className="inputFlex" style={{ width: '50%' }}>
                            <label className="inputText">Nome da farmácia</label>

                            <input
                                type="text"
                                placeholder="Farmácia Fast Drugs"
                                value={nome}
                                onChange={e => setNome(e.target.value.replace(/\d/g, ''))}
                            />
                        </div>

                        <div className="inputFlex" style={{ width: '49%', marginLeft: '1%' }}>
                            <label className="inputText">Telefone</label>

                            <input
                                type="text"
                                placeholder="(00) 0000-0000"
                                value={telefone}
                                onChange={e => setTelefone(telefoneMask(e.target.value))}
                            />
                        </div>
                    </Container>

                    <Container>
                        <Row>
                            <Col md={5} id="imagemInput">
                                <div className="text-center">
                                    <label className="inputText" style={{ paddingLeft: 0 }}>Logo da farmácia</label>
                                </div>
                                <label
                                    id="thumbnail"
                                    style={{ backgroundImage: `url(${preview})`, marginBottom: 0 }}
                                    className={imagem ? 'has-thumbnail' : ''}
                                >
                                    <input type="file" onChange={event => setImagem(event.target.files[0])} />
                                    <img src={camera} alt="Ícone seleção" />
                                </label>
                                <span className="opcional text-center">clique na imagem para alterar</span>
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
                            onChange={e => setDistanciaMaximaEntrega(kmMask(e.target.value))}
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
                            onChange={e => setPrecoPorKm(reaisMask(e.target.value))}
                            value={precoPorKm}
                            style={invalidPrecoPorKm ? { border: '1px solid #dc3545' } : { border: 'solid 1px #ccc' }}
                        />
                        {invalidPrecoPorKm ? <div className="invalid-feedback">Informe um preço válido.</div> : ''}
                    </Container>

                    <Container>
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
                            onChange={e => setDistanciaMaximaFreteGratis(kmMask(e.target.value))}
                            value={distanciaMaximaFreteGratis}
                        />
                    </Container>

                    <Container>
                        <Button style={{ fontSize: 18, marginTop: 10 }} id="btnEntrar" className="transition" type="submit" disabled={disabledButton ? 'disabled' : ''}>
                            Editar Dados
                        </Button>
                    </Container>
                </form>
            </div>
        </div>
    )
}

export default FarmaciaDados
