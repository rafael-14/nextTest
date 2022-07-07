import React, { useState, useEffect } from "react";
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import {
    Button, TextField, Table, Pagination,
    TableBody, TableCell, TableHead, TableRow, Container, Grid,
    Box, Toolbar, TableContainer, Collapse, Switch,
    IconButton, Typography, Chip
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CreateIcon from '@mui/icons-material/Create';

function Row(props) {

    const { row } = props;
    const [open, setOpen] = React.useState(false);

    let [processesByProduct, setProcessesByProduct] = useState([])
    useEffect(() => {
        async function loadProcessesByProduct() {
            let response = await api.put(`/api/select/processes_by_product/${row.id}`)
            setProcessesByProduct(response.data)
        }
        if (open) {
            loadProcessesByProduct()
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
                <TableCell align="left" width="69%">
                    {row.nome}
                </TableCell>
                <TableCell align="center" width="15%">
                    <Chip size="small" label={row.ativo ? "Ativa" : "Inativa"} color={row.ativo ? "success" : "error"} />
                </TableCell>
                <TableCell align="right" size="small" width="15%">
                    <abbr title="Editar">
                        <Button style={{ color: '#000000' }}>
                            <CreateIcon />
                        </Button>
                    </abbr>
                    <abbr title={row.ativo ? "Inativar" : "Ativar"}>
                        <Switch
                            color="success"
                            onClick={() => props.handleSituation(row.id, row.nome, row.ativo)}
                            defaultChecked={row.ativo ? true : false}
                        />
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
                                <TableHead>
                                    <TableRow>
                                        {processesByProduct.map((row) => (
                                            row.sequencia ?
                                                <TableCell
                                                    align="left"
                                                    style={{ background: '#FBECE8', color: '#000000' }}
                                                >
                                                    {row.sequencia}º Processo
                                                </TableCell>
                                                : null
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {processesByProduct.map((row) => (
                                        <TableCell align="left" >{row.nome}</TableCell>
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


export default function ListarProdutos() {

    async function handleNotification(productName, situation) {
        (situation === "Inativado" ? toast.error : toast.success)(`Produto: ${productName} ${situation} com Sucesso!`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        })
    }

    const [productSituation, setProductSituation] = useState(null)
    async function handleSituation(id, nome, ativo) {
        setProductSituation(await api.put(`/api/${ativo ? "inactivate" : "activate"}/product/${id}`))
        handleNotification(nome, ativo ? "Inativado" : "Ativado")
    }

    let [count, setCount] = useState(0)
    let [page, setPage] = useState(1)
    let [product, setProduct] = useState("")
    let [products, setProducts] = useState([])
    useEffect(() => {
        async function loadProducts() {
            let data = { product, page }
            let response = await api.post('/api/select/products', data)
            setProducts(response.data.allProducts)
            setCount(response.data.count)
        }
        loadProducts()
    }, [productSituation, product, page])

    useEffect(() => {
        setPage(1)
    }, [product])

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
                        value={product}
                        onChange={e => setProduct(e.target.value)}
                        color="secondary"
                        label="Produtos"
                        sx={{ width: 500 }}
                    />
                    <Button style={{ background: '#E8927C', color: '#FFFFFF', width: '10%' }} href='/cadastrar/produtos'>Novo</Button>
                </Grid>
                <br />
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TableContainer >
                            <Table size="medium" stickyHeader >
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ background: '#E8927C', color: '#FFFFFF' }} align="left" width="1%" />
                                        <TableCell style={{ background: '#E8927C', color: '#FFFFFF' }} align="left" width="69%">Produtos</TableCell>
                                        <TableCell style={{ background: '#E8927C', color: '#FFFFFF' }} align="center" width="15%">Situação</TableCell>
                                        <TableCell style={{ background: '#E8927C', color: '#FFFFFF' }} align="right" width="15%" />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {products.map((row) => (
                                        <Row
                                            key={row.id}
                                            row={row}
                                            handleSituation={handleSituation}
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

