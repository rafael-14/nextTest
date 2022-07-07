import React, { useEffect, useState } from 'react';
import api from './api';
import { login, logout, getToken } from './auth';
import { Navigate } from 'react-router-dom';

export default function WAuth({ children }) {
    const [redirect, setRedirect] = useState(false)

    useEffect(() => {
        async function verifyToken() {
            var res = await api.get('/api/check/token', { params: { token: getToken() } })
            if (res.data.status !== 200) {
                logout()
                setRedirect(true);
            }
        }
        verifyToken();
    }, [])

    return (
        !redirect ? children : <Navigate to={"/login"}/>
    )
}