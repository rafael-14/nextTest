import React, { useState, useEffect } from "react";
import api from '../../services/api';
import {
    Button, TextField, Table, Typography, IconButton, RadioGroup, TableSortLabel,
    TableBody, TableCell, TableHead, TableRow, Container, Grid, Chip, Radio,
    Box, Toolbar, TableContainer, Collapse, FormControlLabel, Pagination
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function Row(props) {

    const { row } = props;
    const [open, setOpen] = useState(false);

    let [productsByOrder, setProductsByOrder] = useState([])
    useEffect(() => {
        async function loadProductsByOrder() {
            let response = await api.put(`/api/select/products_by_order/${row.id}`)
            setProductsByOrder(response.data)
        }
        if (open) {
            loadProductsByOrder()
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
                <TableCell align="left">{row.id}</TableCell>
                <TableCell align="left">
                    {new Date(row.data_pedido).toLocaleString('pt-br', { dateStyle: "short", timeStyle: "short" })}
                </TableCell>
                <TableCell align="left">
                    <Chip size="small" label={row.status ? row.status : "Concluído"} color={row.status ? "error" : "success"} />
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6">
                                Produtos
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ background: "#FBECE8", color: "#000000" }} align="left">Produtos</TableCell>
                                        <TableCell style={{ background: "#FBECE8", color: "#000000" }} align="left">Quantidade</TableCell>
                                        <TableCell style={{ background: "#FBECE8", color: "#000000" }} align="left">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {productsByOrder.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell align="left">{row.nome}</TableCell>
                                            <TableCell align="left">{row.quantidade}</TableCell>
                                            <TableCell align="left">
                                                <Chip size="small" label={row.status ? row.status : "Concluído"} color={row.status ? "error" : "success"} />
                                            </TableCell>
                                        </TableRow>
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

export default function ListarPedidos() {

    let [direction, setDirection] = useState(true)
    let [searchFor, setSearchFor] = useState("orderNumber")
    let [startDate, setStartDate] = useState(null)
    let [endDate, setEndDate] = useState(null)
    let [orderStatus, setOrderStatus] = useState("All")
    let [orderNumber, setOrderNumber] = useState(null)
    let [page, setPage] = useState(1)
    let [count, setCount] = useState(0)
    let [orders, setOrders] = useState([])
    useEffect(() => {
        async function loadOrders() {
            let data = { direction, orderStatus, orderNumber, startDate, endDate, page }
            let response = await api.post('/api/select/orders', data)
            setOrders(response.data.allOrders)
            setCount(response.data.count)
        }
        loadOrders()

    }, [direction, orderStatus, orderNumber, startDate, endDate, page])

    useEffect(() => {
        setDirection(true)
        setStartDate(null)
        setEndDate(null)
        setOrderNumber(null)
    }, [searchFor])

    useEffect(() => {
        setPage(1)
    }, [searchFor, orderStatus])

    return (
        <Box component="main" sx={{ flexGrow: 1, height: '100vh' }}>
            <Toolbar />
            <Container maxWidth="xg" sx={{ mt: 2 }}>
                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                >
                    {searchFor === "orderNumber" ? (
                        <TextField
                            color="secondary"
                            sx={{ width: 500 }}
                            value={orderNumber}
                            onChange={e => isNaN(parseInt(e.target.value)) ? setOrderNumber("") : setOrderNumber(parseInt(e.target.value))}
                            label="Pedidos"
                        />) : (<Grid>
                            <TextField
                                color="secondary"
                                label="Data Início"
                                required
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                sx={{ width: 225 }}
                            />
                            <TextField
                                color="secondary"
                                style={{ marginInlineStart: 15 }}
                                label="Data Fim"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                sx={{ width: 225 }}
                            />
                        </Grid>)}

                    <Button style={{ background: '#E8927C', color: '#FFFFFF', width: '10%' }} href='/fazer/pedidos'>Novo</Button>
                </Grid>
                <Grid container direction="row" justifyContent="space-between">
                    <Grid>
                        <RadioGroup row defaultValue={searchFor}>
                            <FormControlLabel
                                value="orderNumber"
                                onClick={() => { setSearchFor("orderNumber") }}
                                control={<Radio />}
                                label={
                                    <Grid container direction="row" justifyContent="flex-end">
                                        <Typography>
                                            Número Pedido
                                        </Typography>
                                        {searchFor === "orderNumber" ?
                                            (<TableSortLabel
                                                direction={direction ? "asc" : "desc"}
                                                active
                                                onClick={() => setDirection(!direction)}
                                            />) : null}
                                    </ Grid>
                                }
                            />
                            <FormControlLabel
                                value="orderDate"
                                onClick={() => { setSearchFor("orderDate") }}
                                control={<Radio />}
                                label={
                                    <Grid container direction="row" justifyContent="flex-end">
                                        <Typography>
                                            Data Pedido
                                        </Typography>
                                        {searchFor === "orderDate" ?
                                            (<TableSortLabel
                                                direction={direction ? "asc" : "desc"}
                                                active
                                                onClick={() => setDirection(!direction)}
                                            />) : null}
                                    </ Grid>
                                }
                            />
                        </RadioGroup>
                    </Grid>
                    <Grid>
                        <RadioGroup row defaultValue={orderStatus}>
                            <FormControlLabel
                                value="All"
                                onClick={() => setOrderStatus("All")}
                                control={<Radio />}
                                label="Todos"
                            />
                            <FormControlLabel
                                value="Concluded"
                                onClick={() => setOrderStatus("Concluded")}
                                control={<Radio />}
                                label="Concluídos"
                            />
                            <FormControlLabel
                                value="InProgress"
                                onClick={() => setOrderStatus("InProgress")}
                                control={<Radio />}
                                label="Em Andamento"
                            />
                        </RadioGroup>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TableContainer>
                            <Table size="medium" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ background: '#E8927C', color: '#FFFFFF' }} align="left" width="1%" />
                                        <TableCell style={{ background: '#E8927C', color: '#FFFFFF' }} align="left">Pedidos</TableCell>
                                        <TableCell style={{ background: '#E8927C', color: '#FFFFFF' }} align="left">Data Pedido</TableCell>
                                        <TableCell style={{ background: '#E8927C', color: '#FFFFFF' }} align="left">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orders.map((row) => (
                                        <Row key={row.id} row={row} />
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

