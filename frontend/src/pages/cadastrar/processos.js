import React, { useState } from "react";
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button, Switch, FormGroup, FormControlLabel,
  Container, Grid, Paper, Box, TextField, Toolbar, CircularProgress
} from "@mui/material";

export default function CadastrarProcessos() {

  async function handleNotificationSuccess(processName) {
    toast.success(`Processo: ${processName} Cadastrado com Sucesso!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      onClose: () => {
        setProgress(false)
          (!manyRegisters ? window.location.href = "/listar/processos" : null)
      },
      onOpen: () => {
        setProcessName("")
        setProgress(true)
      }
    })
  }

  async function handleNotificationError(errorMessage, fieldToBeFocused) {
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      onOpen: () => fieldToBeFocused ? document.getElementById(fieldToBeFocused).focus() : null,
    })
  }

  let [processName, setProcessName] = useState("")
  let [manyRegisters, setManyRegisters] = useState(false)

  async function handleNewProcess() {
    processName = processName.trim()
    if (processName !== "") {
      let data = { processName }
      try {
        let response = await api.post('/api/insert/process', data)
        if (response.status === 200) {
          handleNotificationSuccess(processName)
        }
      } catch (e) {
        handleNotificationError("Erro ao Cadastrar Processo!")
      }
    } else {
      handleNotificationError("Preencha o Nome do Processo Corretamente!", "processName")
    }
  }

  let [progress, setProgress] = useState(false)

  return (
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <ToastContainer />
        <Container maxWidth="lg" sx={{ mt: 2 }}>
          <Paper sx={{ p: 1, display: 'flex', flexDirection: 'column' }}>
            <Grid >
              <Grid container spacing={3}>
                <Grid item xs={12} >
                  <TextField
                    id="processName"
                    required
                    label="Processo"
                    fullWidth
                    color="secondary"
                    value={processName}
                    onChange={e => setProcessName(e.target.value)}
                  />
                </Grid>
              </Grid>
              <FormGroup>
                <FormControlLabel
                  control={<Switch
                    checked={manyRegisters}
                    onChange={() => setManyRegisters(!manyRegisters)}
                  />}
                  label="Cadastrar Vários"
                />
              </FormGroup>
              <br />
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
              >
                {!progress ?
                  (<>
                    <Button variant="contained" style={{ background: '#E74C3C', color: "#FFFFFF" }} href="/listar/processos">
                      Cancelar
                    </Button>
                    <Button variant="contained" style={{ color: '#FFFFFF', marginInlineStart: 15, backgroundColor: "#E8927C" }} onClick={() => handleNewProcess()}>
                      Salvar
                    </Button>
                  </>) :
                  (<Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                  </Box>)}
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
  );
}