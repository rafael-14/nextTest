import { useRouter } from "next/router";
import Dashboard from "../components/Dashboard"
//<Dashboard componente={router.pathname}/>
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { login, logout, getToken } from '../services/auth';
import Login from "./login"

export default function MyApp({ Component, pageProps }) {

  const router = useRouter()

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
    !redirect ? <Component {...pageProps} /> : //router.push("/login")
    <Login/>
  )
}