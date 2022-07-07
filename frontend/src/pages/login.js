import React, { useState } from 'react';
import {
  Avatar, Button, TextField, Box, Typography, Container
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import api from '../services/api';
import { setIdSetor, login } from '../services/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Copyright() {
  return (
    <Typography variant="body2" align="center">
      {`Virtual Joias ${new Date().getFullYear()}.`}
    </Typography>
  );
}

export default function Login() {

  async function handleNotificationError(msg) {
    toast.error(msg, {
      position: "top-right",
      autoClose: 2250,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      onOpen: document.getElementById("sectorField").focus()
    })
  }

  let [sector, setSector] = useState("")
  let [password, setPassword] = useState("")

  async function handleSubmit() {
    await api.post("/api/login", { nome: sector })
      .then(res => {
        if (res.data.status === 200) {
          login(res.data.token)
          setIdSetor(res.data.login.id)
          window.location.href = "/"
        } else {
          handleNotificationError("Setor ou Senha Incorreto!")
        }
      })
  }

  return (
    <>
      <ToastContainer />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar style={{ color: "#FFFFFF", backgroundColor: "#E8927C" }}>
            <LockOutlinedIcon />
          </Avatar>
          <TextField
            id="sectorField"
            margin="normal"
            required
            fullWidth
            label="Setor"
            color="secondary"
            value={sector}
            onChange={e => setSector(e.target.value)}
            onKeyDown={e => e.key === "Enter" ? document.getElementById("passField").focus() : null}
          />
          <TextField
            id="passField"
            margin="normal"
            required
            fullWidth
            label="Senha"
            type="password"
            color="secondary"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" ? handleSubmit() : null}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            style={{
              background: "#E8927C",
              color: "#FFFFFF",
            }}
            onClick={() => handleSubmit()}
          >
            Login
          </Button>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </>
  );
}