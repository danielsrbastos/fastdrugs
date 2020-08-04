import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import { Button } from 'react-bootstrap'

import '../home/styles.css'

import { signOut } from '../../services/authService'

function ButtonSair({ type }) {

    let [logout, setLogout] = useState(false)
    let history = useHistory()

    useEffect(() => {
        if (logout) {
            signOut(type)
            history.push('/')
        }
    }, [logout, history, type])

    return (
        <Button variant="outline-light" style={{ border: 'solid 1px #fff' }} onClick={() => setLogout(true)}>
            Sair
        </Button>
    )
}

export default ButtonSair