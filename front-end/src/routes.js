import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

import { isSignedIn } from './services/authService'
import md5 from 'md5'
import api from './services/api'

import Home from './components/home/home'
import ExperienciaUsuario from './components/home/experienciaUsuario'

import LoginFarmaciaBox from './components/login/farmacia/loginFarmaciaBox'
import LoginClienteBox from './components/login/cliente/loginClienteBox'

import CadastroFarmaciaBox from './components/cadastro/farmacia/cadastroFarmaciaBox'
import CadastroClienteBox from './components/cadastro/cliente/cadastroClienteBox'

import MinhaFarmaciaBox from './components/minhaFarmacia/minhaFarmaciaBox'

import ListagemFarmaciasBox from './components/listagemFarmacias/listagemFarmaciasBox'
import Farmacia from './components/listagemFarmacias/farmacia'
import Cesta from './components/listagemFarmacias/cesta/cesta';
import MeuPerfil from './components/listagemFarmacias/meuPerfil/meuPerfil'
import MeusPedidos from './components/listagemFarmacias/meusPedidos/meusPedidos'

import NotFound from './components/notFound/notFoundBox'

const PrivateRoute = ({ component: Component, permission, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props =>
                isSignedIn(permission === 'cliente' ? 'cliente' : 'farmacia') ? (
                    <div>
                        <Component {...props} />
                    </div>
                ) : (
                        <Redirect to={{
                            pathname: '/entrar' + (permission === 'cliente' ? '/cliente' : '/farmacia'),
                            state: {
                                from: props.location
                            }
                        }} />
                    )
            }
        />
    )
}

function Routes() {
    const [farmacias, setFarmacias] = useState([])

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get('/farmacias')
                setFarmacias(data)
            } catch (e) {
                return console.log(e)
            }
        })()
    }, [])

    return (
        <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Home} />

                <Route path ='/experiencia-usuario' component={ExperienciaUsuario} />

                <Route path='/entrar/farmacia' component={LoginFarmaciaBox} />
                <Route path='/entrar/cliente' component={LoginClienteBox} />

                <Route path='/cadastrar/farmacia' exact component={CadastroFarmaciaBox} />
                <Route path='/cadastrar/cliente' exact component={CadastroClienteBox} />

                <PrivateRoute path='/minha-farmacia' exact component={MinhaFarmaciaBox} permission='farmacia' />

                <PrivateRoute path='/lista-farmacias' exact component={ListagemFarmaciasBox} permission='cliente' />
                <PrivateRoute path='/cesta' component={Cesta} permission='cliente' />
                <PrivateRoute path='/meu-perfil' exact component={MeuPerfil} permission='cliente' />
                <PrivateRoute path='/meus-pedidos' component={MeusPedidos} permission='cliente' />
                {farmacias.map(farmacia => {
                    if (!farmacia.status)
                        return false

                    return <PrivateRoute key={farmacia.id_farmacia} path={`/delivery/${farmacia.nome.replace(/\s/g, '-').toLowerCase()}/${md5(farmacia.id_farmacia)}`} component={() => <Farmacia id_farmacia={farmacia.id_farmacia} />} permission="cliente" />
                })}

                <Route component={NotFound} />
            </Switch>
        </BrowserRouter>
    );
}

export default Routes;