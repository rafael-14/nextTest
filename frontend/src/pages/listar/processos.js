import React, { useState, useEffect } from "react";
import api from '../../services/api';
import {
    Button, TextField, Table, Switch, Pagination,
    TableBody, TableCell, TableHead, TableRow, Container, Grid,
    Box, Toolbar, TableContainer
} from "@mui/material";
import CreateIcon from '@mui/icons-material/Create';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ListarProcessos() {

    async function handleNotification(processName, processSituation) {
        (processSituation === "Inativado" ? toast.error : toast.success)(`Processo: ${processName} ${processSituation} com Sucesso!`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        })
    }
    const [situation, setSituation] = useState(null)
    async function handleSituation(id, nome, ativo) {
        setSituation(await api.put(`/api/${ativo ? "inactivate" : "activate"}/process/${id}`))
        handleNotification(nome, ativo ? "Inativado" : "Ativado")
    }

    let [page, setPage] = useState(1)
    let [process, setProcess] = useState("")
    let [count, setCount] = useState(0)
    let [processes, setProcesses] = useState([])
    useEffect(() => {
        async function loadProcesses() {
            let data = { page, process }
            let response = await api.post('/api/select/processes', data)
            setProcesses(response.data.allProcesses)
            setCount(response.data.count)
        }
        loadProcesses()
    }, [situation, page, process])

    useEffect(() => {
        setPage(1)
    }, [process])

    return (
        <Box component="main" sx={{ flexGrow: 1, height: '100vh' }}>
            <Toolbar />
            <ToastContainer />
            <Container maxWidth="xg" sx={{ mt: 2 }}>
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                >
                    <TextField
                        value={process}
                        onChange={e => setProcess(e.target.value)}
                        color="secondary"
                        sx={{ width: 500 }}
                        label="Processos"
                    />
                    <Button style={{ background: "#E8927C", color: "#FFFFFF", width: "10%" }} href="/cadastrar/processos">Novo</Button>
                </Grid>
                <br />
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TableContainer>
                            <Table size="medium" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ background: "#E8927C", color: "#FFFFFF" }} align="left">Processos</TableCell>
                                        <TableCell style={{ background: "#E8927C", color: "#FFFFFF" }} align="right"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {processes.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell align="left">{row.nome}</TableCell>
                                            <TableCell align="right" size="small" width="15%">
                                                <abbr title="Editar">
                                                    <Button style={{ color: "#000000" }}>
                                                        <CreateIcon />
                                                    </Button>
                                                </abbr>
                                                <abbr title={row.ativo ? "Inativar" : "Ativar"}>
                                                    <Switch
                                                        color="success"
                                                        onClick={() => handleSituation(row.id, row.nome, row.ativo)}
                                                        defaultChecked={row.ativo ? true : false}
                                                    />
                                                </abbr>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
                <br />
                {count > 10 ?
                    <Grid container direction="row" justifyContent="center">
                        <Pagination
                            size="large"
                            showFirstButton
                            showLastButton
                            onChange={(_event, page) => setPage(page)}
                            count={(parseInt(count / 10) + (count % 10 !== 0 ? 1 : 0))}
                            defaultPage={1}
                            siblingCount={0}
                            page={page}
                        />
                    </Grid> : null}
            </Container>
        </Box>
    );
}

