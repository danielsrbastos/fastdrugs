import React from 'react';

import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/dist/jquery'
import 'bootstrap/dist/js/bootstrap.min.js'

import api from './services/api'
import { getToken } from './services/authService'

import Routes from './routes'

function App() {

    return (
        <Routes />
    );
}

export default App;