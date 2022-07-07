import React, { useState, useEffect } from "react";
import api from '../../services/api';
import {
    Button, TextField, Table, Typography, IconButton,
    TableBody, TableCell, TableHead, TableRow, Container, Grid, Pagination,
    Box, Toolbar, TableContainer, Collapse,
} from "@mui/material";
import CreateIcon from '@mui/icons-material/Create';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function Row(props) {

    const { row } = props;
    const [open, setOpen] = React.useState(false);

    let [usersBySector, setUsersBySector] = useState([])
    useEffect(() => {
        async function loadUsersBySector() {
            let response = await api.put(`/api/select/users_by_sector/${row.id}`)
            setUsersBySector(response.data)
        }
        if (open) {
            loadUsersBySector()
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
                <TableCell align="left">{row.nome}</TableCell>
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
                                Usuários
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableBody>
                                    {usersBySector.map((row) => (
                                        <TableRow align="left" >{row.nome} {row.sobrenome}</TableRow>
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

export default function ListarSetores() {

    let [page, setPage] = useState(1)
    let [count, setCount] = useState(0)
    let [sector, setSector] = useState("")
    let [sectors, setSectors] = useState([])
    useEffect(() => {
        async function loadSectors() {
            let data = { sector, page }
            let response = await api.post('/api/select/sectors', data)
            setSectors(response.data.allSectors)
            setCount(response.data.count)
        }
        loadSectors()
    }, [page, sector])

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
                        value={sector}
                        onChange={e => setSector(e.target.value)}
                        sx={{ width: 500 }}
                        label="Setores"
                    />
                    <Button style={{ background: '#E8927C', color: '#FFFFFF', width: '10%' }} href='/cadastrar/setores'>Novo</Button>
                </Grid>
                <br />
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TableContainer>
                            <Table size="medium" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ background: '#E8927C', color: '#FFFFFF' }} align="left" width="1%" />
                                        <TableCell style={{ background: '#E8927C', color: '#FFFFFF' }} align="left">Setores</TableCell>
                                        <TableCell style={{ background: '#E8927C', color: '#FFFFFF' }} align="right"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sectors.map((row) => (
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

