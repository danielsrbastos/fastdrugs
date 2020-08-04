import React, { useEffect, useState, useMemo } from 'react'
import { Modal, Col, Row, Container, Button } from 'react-bootstrap'
import Select from 'react-select'
import PubSub from 'pubsub-js'
import Slider from '../../listagemFarmacias/slider'

import camera from '../../../assets/camera.svg'

import { selectTheme } from '../../themes'
import '../styles.css'

import api from '../../../services/api'

function ModalProduto({ farmacia, categorias, show, handleCloseModal }) {

    const [produto, setProduto] = useState('')
    const [descricao, setDescricao] = useState('')
    const [miligramas, setMiligramas] = useState('')
    const [tipo, setTipo] = useState('')
    const [tarja, setTarja] = useState('')
    const [preco, setPreco] = useState('')
    const [categoria, setCategoria] = useState('')
    const [generico, setGenerico] = useState(false)
    const [retencaoReceita, setRetencaoReceita] = useState(false)

    const [productId, setProductId] = useState(0)
    const [imagens, setImagens] = useState(['picker'])

    const [step, setStep] = useState(1)

    const [camposMedicamentosVisibility, setCamposMedicamentosVisibility] = useState(false)
    const [disabledButton, setDisabledButton] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        setDisabledButton(true)

        try {
            if (step === 1) {
                const produtoBody = { nome: produto, descricao, preco: preco.replace('R$', '').replace(',', '.') }

                const responseProduto = await api.post(`/farmacias/${farmacia.id_farmacia}/produtos/categorias/${categoria.value}`, produtoBody)

                if (camposMedicamentosVisibility) {
                    const medicamentoBody = { id_produto: responseProduto.data.id_produto, miligramas, tipo, generico, tarja, retenção_receita: retencaoReceita }

                    const { data } = await api.post(`/medicamentos/${responseProduto.data.id_produto}`, medicamentoBody)
                }

                setProductId(responseProduto.data.id_produto)
                setDisabledButton(false)
                setStep(2)
            } else if (step === 2) {
                for (const imagem of imagens) {
                    if (imagem === 'picker')
                        continue

                    const data = new FormData()
                    data.append('produtos', imagem)

                    await api.post(`/farmacias/${farmacia.id_farmacia}/produtos/${productId}/imagem`, data)
                }

                setProduto('')
                setDescricao('')
                setMiligramas('')
                setTipo('')
                setTarja('')
                setPreco('')
                setCategoria('')
                setGenerico(false)
                setRetencaoReceita(false)
                setImagens(['picker'])
                setDisabledButton(false)
                setStep(1)
                PubSub.publish('refreshProdutos', {})
                handleCloseModal()
            }
        } catch (e) {
            return console.log(e.response)
        }
    }

    return (
        <div>
            <Modal
                show={show}
                onHide={() => {
                    setProduto('')
                    setDescricao('')
                    setMiligramas('')
                    setTipo('')
                    setTarja('')
                    setPreco('')
                    setCategoria('')
                    setGenerico(false)
                    setRetencaoReceita(false)
                    setStep(1)
                    setImagens(['picker'])
                    PubSub.publish('refreshProdutos', {})
                    handleCloseModal()
                }}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <h3 className="defaultText" style={{ color: '#4a4a4a', fontSize: 20, marginBottom: 0, float: 'right', marginRight: 10 }}>Cadastro do Produto</h3>
                </Modal.Header>

                <form onSubmit={handleSubmit}>

                    <Modal.Body id="boxInputs" style={{ paddingLeft: 0, paddingRight: 0, paddingTop: step === 1 ? 20 : 0 }}>
                        {(() => {
                            if (step === 1) return (
                                <div>
                                    <Container className="boxInputFlex">
                                        <div className="inputFlex" style={{ width: '80%' }}>
                                            <label className="inputText">Nome do produto</label>

                                            <input
                                                type="text"
                                                placeholder="Dipirona"
                                                value={produto}
                                                onChange={e => setProduto(e.target.value)}
                                            />
                                        </div>

                                        <div className="inputFlex" style={{ width: '19%', marginLeft: '1%' }}>
                                            <label className="inputText">Preço</label>

                                            <input
                                                type="text"
                                                placeholder="R$ 20,50"
                                                value={preco}
                                                onChange={e => setPreco(e.target.value)}
                                            />
                                        </div>
                                    </Container>

                                    <Container>
                                        <label className="inputText">Descrição <span className="opcional">(opcional)</span></label>

                                        <input
                                            type="text"
                                            placeholder="Ex: Remédio utilizado para o alívio da dor de cabeça"
                                            value={descricao}
                                            onChange={e => setDescricao(e.target.value)}
                                        />
                                    </Container>

                                    <Container>
                                        <label className="inputText">Categoria</label>

                                        <Select
                                            options={categorias}
                                            classNamePrefix="select"
                                            placeholder="Ex: Dor de cabeça"
                                            value={categoria}
                                            onChange={value => setCategoria(value)}
                                            theme={theme => selectTheme(theme)}
                                        />
                                    </Container>

                                    <Container className="text-center containerCheckbox" style={{ marginTop: 20 }}>
                                        <input className="inputCheckbox"
                                            type="checkbox"
                                            id="checkboxVisibilityMedicamentos"
                                            onChange={e => setCamposMedicamentosVisibility(e.target.checked)}
                                            checked={camposMedicamentosVisibility}
                                        />
                                        <label className="inputText" htmlFor="checkboxVisibilityMedicamentos">É um medicamento?</label>
                                    </Container>

                                    <Container className="boxInputFlex" style={{ display: camposMedicamentosVisibility ? 'flex' : 'none' }}>
                                        <div className="inputFlex" style={{ width: '50%' }}>
                                            <label className="inputText">Miligramas</label>

                                            <input
                                                type="text"
                                                placeholder="0 mg"
                                                value={miligramas}
                                                onChange={e => setMiligramas(e.target.value)}
                                            />
                                        </div>

                                        <div className="inputFlex" style={{ width: '49%', marginLeft: '1%' }}>
                                            <label className="inputText">Tipo</label>

                                            <input
                                                type="text"
                                                placeholder="Gotas, comprimido, cápsula, drágea..."
                                                value={tipo}
                                                onChange={e => setTipo(e.target.value)}
                                            />
                                        </div>
                                    </Container>

                                    <Container className="boxInputFlex" style={{ display: camposMedicamentosVisibility ? 'flex' : 'none' }}>
                                        <div className="inputFlex" style={{ width: '30%' }}>
                                            <label className="inputText">Tarja</label>

                                            <input
                                                type="text"
                                                placeholder="Vermelha, preta..."
                                                value={tarja}
                                                onChange={e => setTarja(e.target.value)}
                                            />
                                        </div>

                                        <div style={{ width: '29%', marginLeft: '1%', display: 'flex', justifyContent: 'center', marginTop: 50 }}>
                                            <input className="inputCheckbox"
                                                type="checkbox"
                                                id="checkboxGenerico"
                                                onChange={e => setGenerico(e.target.checked)}
                                                checked={generico}
                                            />
                                            <label className="inputText" style={{ marginTop: -5 }} htmlFor="checkboxGenerico">É genérico?</label>
                                        </div>


                                        <div style={{ width: '39%', marginLeft: '1%', display: 'flex', justifyContent: 'center', marginTop: 50 }}>
                                            <input className="inputCheckbox"
                                                type="checkbox"
                                                id="checkboxRetencaoRecetia"
                                                onChange={e => setRetencaoReceita(e.target.checked)}
                                                checked={retencaoReceita}
                                            />
                                            <label className="inputText" style={{ marginTop: -5 }} htmlFor="checkboxRetencaoRecetia">Exige retenção da receita?</label>
                                        </div>
                                    </Container>
                                </div>
                            )
                            else if (step === 2) return (
                                <div>
                                    <Slider
                                        options={{
                                            adaptiveHeight: true,
                                            pageDots: false,
                                            prevNextButtons: false,
                                            freeScroll: true,
                                            cellAlign: 'left'
                                        }}
                                    >
                                        {imagens.map(imagem => {
                                            if (imagem === 'picker') return (
                                                <div className="imagemSlider" key="picker">
                                                    <label>
                                                        <input type="file" onChange={event => setImagens([...imagens, event.target.files[0]])} />
                                                        <img src={camera} alt="Ícone seleção" />
                                                    </label>
                                                </div>
                                            )

                                            return (
                                                <div className="imagemSlider" key={imagem.nome + imagem.size} style={{ backgroundImage: `url(${URL.createObjectURL(imagem)})` }}></div>
                                            )
                                        })}
                                    </Slider>
                                </div>
                            )
                        })()}
                    </Modal.Body>

                    <Modal.Footer>
                        <Container>
                            <Button style={{ fontSize: 18, marginTop: 10 }} id="btnEntrar" className="transition" type="submit" disabled={disabledButton ? 'disabled' : ''}>
                                {(() => {
                                    if (step === 1)
                                        return 'Cadastrar Produto'
                                    else if (step === 2)
                                        return 'Cadastrar Imagens'
                                })()}
                            </Button>
                        </Container>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    )
}

export default ModalProduto