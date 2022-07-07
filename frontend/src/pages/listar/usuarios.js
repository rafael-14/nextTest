import React, { useState, useEffect } from "react";
import api from '../../services/api';
import {
    Button, TextField, Pagination, Table, Typography, IconButton,
    TableBody, TableCell, TableHead, TableRow, Container, Grid,
    Box, Toolbar, TableContainer, Collapse
} from "@mui/material";
import CreateIcon from '@mui/icons-material/Create';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function Row(props) {

    const { row } = props;
    const [open, setOpen] = React.useState(false);

    let [processesByUser, setProcessesByUser] = useState([])
    useEffect(() => {
        async function loadProcessesByUser() {
            let response = await api.put(`/api/select/processes_by_user/${row.id}`)
            setProcessesByUser(response.data)
        }
        if (open) {
            loadProcessesByUser()
        }
    }, [open])

    return (
        <>
            <TableRow >
                <TableCell width="1%">
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align="left">{row.nome} {row.sobrenome}</TableCell>
                <TableCell align="right" size="small" width="1%">
                    <abbr title="Editar">
                        <Button style={{ color: '#000000' }}>
                            <CreateIcon />
                        </Button>
                    </abbr>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6">
                                Processos
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableBody>
                                    {processesByUser.map((row) => (
                                        <TableRow align="left" >{row.nome}</TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    )
}

export default function ListarUsuarios() {

    let [page, setPage] = useState(1)
    let [count, setCount] = useState(0)
    let [user, setUser] = useState("")
    let [users, setUsers] = useState([])
    useEffect(() => {
        async function loadUsers() {
            let data = { user, page }
            let response = await api.post('/api/select/users', data)
            setUsers(response.data.allUsers)
            setCount(response.data.count)
        }
        loadUsers()
    }, [page, user])

    return (
        <Box component="main" sx={{ flexGrow: 1, height: '100vh' }}>
            <Toolbar />
            <Container maxWidth="xg" sx={{ mt: 2 }}>
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                >
                    <TextField
                        color="secondary"
                        value={user}
                        onChange={e => setUser(e.target.value)}
                        sx={{ width: 500 }}
                        label="Usuários"
                    />
                    <Button style={{ background: '#E8927C', color: '#FFFFFF', width: '10%' }} href='/cadastrar/usuarios'>Novo</Button>
                </Grid>
                <br />
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TableContainer>
                            <Table size="medium" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left" width="1%" style={{ background: "#E8927C", color: "#FFFFFF" }} />
                                        <TableCell align="left" style={{ background: "#E8927C", color: "#FFFFFF" }}>Usuários</TableCell>
                                        <TableCell align="right" style={{ background: "#E8927C", color: "#FFFFFF" }}></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((row) => (
                                        <Row
                                            key={row.id}
                                            row={row}
                                        />
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

