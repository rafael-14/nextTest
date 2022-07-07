import React, { useState, useEffect } from "react";
//import api from '../../services/api';
import {
    Button, TableBody, Card, Box, Toolbar, Table, TableHead, Fab,
    Typography, TableCell, CardHeader, CardContent, Container, Grid, TableRow, List, ListItem,
    Dialog, DialogTitle, TextField, DialogContent, DialogContentText, DialogActions, ListItemText
} from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import { getIdSetor } from '../../services/auth';
import RemoveIcon from '@mui/icons-material/Remove';
import QrCode2Icon from '@mui/icons-material/QrCode2';

function HandleDialogUserCode(props) {

    async function verifyCode(value) {
        let response = await api.post(`/api/select/user_by_code`, { code: value })
        if (response.data.status === 200) {
            props.handleUser(response.data.userByCode[0].id)
        } else {
            props.handleNotificationError("Código Inexistente!")
            props.setCode("")
        }
    }

    return (
        <Dialog open={props.open} onClose={() => { props.setOpen(false); props.setCode("") }} >
            <DialogTitle>Digite Seu Código:</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <TextField
                        autoFocus
                        id="dialogTextField"
                        margin="dense"
                        required
                        fullWidth
                        label="Código"
                        type="password"
                        color="secondary"
                        value={props.code}
                        onChange={e => props.setCode(e.target.value)}
                        onKeyDown={e => e.key === "Enter" ? verifyCode(props.code) : null}
                    />
                </DialogContentText>
            </DialogContent>
        </Dialog>
    )
}

function HandleDialogQrCode(props) {

    useEffect(() => {
        props.setQrCode("")
    }, [props.listQrCode])

    function handleListQrCode(value) {
        if (value !== "" && props.listQrCode.indexOf(value) === -1) {
            props.setListQrCode([...props.listQrCode, value])
        } else {
            props.handleNotificationError("QR Code Já Inserido!")
            props.setQrCode("")
        }
    }
    function handleRemoveListQrCode(position) {
        props.listQrCode.splice(position, 1)
        props.setListQrCode([...props.listQrCode])
    }

    function handleButtonWrittin() {
        switch(props.functionToBeExecuted) {
            case "handleStartProduction": return "Iniciar"    
            case "handlePauseProduction": return "Pausar"
            case "handleResumeProduction": return "Retomar"
            case "handleFinishProduction": return "Finalizar"
        }
    }

    return (
        <>
            <Dialog open={props.openQrCode} onClose={() => { props.setOpenQrCode(false); props.setListQrCode([]) }} fullWidth>
                <List>
                    {props.listQrCode.map((row, position) => (
                        <ListItem>
                            <ListItemText primary={new String(row).substring(0, 50)} />
                            <Fab size="small" style={{ backgroundColor: '#E74C3C', color: "#FFFFFF" }} onClick={() => handleRemoveListQrCode(position)}>
                                <RemoveIcon />
                            </Fab>
                        </ListItem>
                    ))}
                </List>
                <DialogContent>
                    <DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            fullWidth
                            label="Leia aqui o QR Code:"
                            color="secondary"
                            value={props.qrCode}
                            onChange={e => props.setQrCode(e.target.value)}
                            onKeyDown={e => e.key === "Enter" ? handleListQrCode(e.target.value.trim()) : null}
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Grid
                        container
                        direction="row"
                        justifyContent="flex-end"
                    >
                        <Button
                            variant="contained"
                            style={{ background: "#E74C3C", color: "#FFFFFF" }}
                            onClick={() => { props.setOpenQrCode(false); props.setListQrCode([]) }}
                        >
                            Cancelar
                        </Button>
                        {props.listQrCode.length > 0 ?
                            (<Button
                                variant="contained"
                                style={{ color: "#FFFFFF", marginInlineStart: 15 }}
                                onClick={() => props.handleQrCode()}
                            >
                                {handleButtonWrittin()}
                            </Button>) : null}
                    </Grid>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default function ListarProducao() {

    let [code, setCode] = useState("")

    async function handleNotificationError(msg) {
        toast.error(msg, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        })
    }

    async function handleNotificationProductions(status, toast) {
        toast(`Produções ${status}!`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        })
    }

    const [productionStatus, setProductionStatus] = useState(null)
    let [functionToBeExecuted, setFunctionToBeExecuted] = useState(null)

    let [productionNotStarted, setProductionNotStarted] = useState([])
    let [productionStarted, setProductionStarted] = useState([])
    let [productionPaused, setProductionPaused] = useState([])
    useEffect(() => {
        async function loadProductionNotStarted() {
            let response = await api.post('/api/select/production_not_started', { id_setor: getIdSetor() })
            setProductionNotStarted(response.data)
        }
        loadProductionNotStarted()

        async function loadProductionStarted() {
            let response = await api.post('/api/select/production_started', { id_setor: getIdSetor() })
            setProductionStarted(response.data)
        }
        loadProductionStarted()

        async function loadProductionPaused() {
            let response = await api.post('/api/select/production_paused', { id_setor: getIdSetor() })
            setProductionPaused(response.data)
        }
        loadProductionPaused()
    }, [productionStatus])

    let [responseQrCode, setResponseQrCode] = useState([])
    let [open, setOpen] = useState(false);
    async function handleUser(userID) {
        let processID = responseQrCode.data.map((data) => { return parseInt(data.id_processo) })
        let response = await api.post(`/api/verify/processes_by_user`, { userID, processID })
        setOpen(false)
        setOpenQrCode(false)
        setListQrCode([])
        setQrCode("")
        setCode("")
        if (response.data.status === 400) {
            handleNotificationError("Usuário Não Possui Permissão!")
        }
        else {
            let productionID = responseQrCode.data.map((data) => { return parseInt(data.id) })
            switch (functionToBeExecuted) {
                case "handleStartProduction":
                    setProductionStatus(await api.post(`/api/start/productions`, { productionID, userID }))
                    handleNotificationProductions("Iniciadas", toast.info)
                    break
                case "handlePauseProduction":
                    response = await api.post(`/api/verify/user`, { productionID, userID })
                    if (response.data.status === 200) {
                        setProductionStatus(await api.post(`/api/pause/productions`, { productionID }))
                        handleNotificationProductions("Pausadas", toast.error)
                    } else {
                        handleNotificationError("Usuário Diferente do Usuário que Iniciou a Produção!")
                    } break
                case "handleResumeProduction":
                    setProductionStatus(await api.post(`/api/resume/productions`, { productionID, userID }))
                    handleNotificationProductions("Retomadas", toast.warning)
                    break
                case "handleFinishProduction":
                    response = await api.post(`/api/verify/user`, { productionID, userID })
                    if (response.data.status === 200) {
                        setProductionStatus(await api.post(`/api/finish/productions`, { productionID }))
                        handleNotificationProductions("Concluídas", toast.success)
                    } else {
                        handleNotificationError("Usuário Diferente do Usuário que Iniciou a Produção!")
                    }
                    break
            }
        }
    }

    let [openQrCode, setOpenQrCode] = useState(false);
    let [listQrCode, setListQrCode] = useState([])
    let [qrCode, setQrCode] = useState("")

    async function handleQrCode() {
        let response = await api.post(`/api/qrcode`, {listQrCode, functionToBeExecuted})
        setResponseQrCode(response)
        if (response.data.length > 0) {
            setOpen(true)
            setOpenQrCode(false)
        } else {
            handleNotificationError("QR Code Inexistente!")
        }
    }

    return (
        <>
            <Box component="main" sx={{ flexGrow: 1, height: '100vh' }}>
                <Toolbar />
                <HandleDialogUserCode
                    open={open}
                    setOpen={setOpen}
                    handleUser={handleUser}
                    handleNotificationError={handleNotificationError}
                    code={code}
                    setCode={setCode}
                />
                <HandleDialogQrCode
                    openQrCode={openQrCode}
                    setOpenQrCode={setOpenQrCode}
                    listQrCode={listQrCode}
                    setListQrCode={setListQrCode}
                    qrCode={qrCode}
                    setQrCode={setQrCode}
                    handleQrCode={handleQrCode}
                    handleNotificationError={handleNotificationError}
                    functionToBeExecuted={functionToBeExecuted}
                />
                <ToastContainer />
                <Container maxWidth="xg" sx={{ mt: 4, mb: 4 }}>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" width="50%" style={{ background: '#E8927C', color: '#FFFFFF' }}>
                                    A Fazer
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="flex-end"
                                        alignItems="baseline"
                                    >
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => {
                                                setOpenQrCode(true);
                                                setFunctionToBeExecuted("handleStartProduction")
                                            }}
                                        >
                                            <Typography color="#FFFFFF">INICIAR</Typography>
                                            <QrCode2Icon style={{ color: '#FFFFFF' }} />
                                        </Button>
                                    </Grid>
                                </TableCell>
                            </TableRow>
                            {productionNotStarted.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell align="center" width="50%">
                                        <Grid key={row.id}>
                                            <Card>
                                                <CardHeader
                                                    title={row.nome_processo}
                                                    titleTypographyProps={{ align: 'right' }}
                                                    subheader={row.nome_proximo_processo ? row.nome_proximo_processo : null/*<br />*/}
                                                    subheaderTypographyProps={{ align: 'right', }}
                                                    avatar={
                                                        <Typography variant="body2" align="left" color="text.secondary">
                                                            {row.id_pedido}
                                                        </Typography>}
                                                    sx={{ backgroundColor: "#FBECE8", color: "#000000", maxHeight: 50 }}
                                                />
                                                <CardContent sx={{ maxHeight: 65 }}>
                                                    <Box>
                                                        <Typography variant="body2" align="center" color="text.primary">
                                                            {row.nome_produto}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {row.observacao ? row.observacao : null/*<br />*/}
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Container>
            </Box>
            <Box component="main" sx={{ flexGrow: 1, height: '100vh' }}>
                <Toolbar />
                <Container maxWidth="xg" sx={{ mt: 4, mb: 4 }}>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    align="center"
                                    width="50%"
                                    style={{ background: '#E8927C', color: '#FFFFFF' }}
                                >
                                    Fazendo
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="space-between"
                                    >
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => {
                                                setOpenQrCode(true);
                                                setFunctionToBeExecuted("handlePauseProduction")
                                            }}
                                        >
                                            <QrCode2Icon style={{ color: '#FFFFFF' }} />
                                            <Typography color="#FFFFFF">PAUSAR</Typography>
                                        </Button>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => {
                                                setOpenQrCode(true);
                                                setFunctionToBeExecuted("handleFinishProduction")
                                            }}
                                        >
                                            <Typography color="#FFFFFF">FINALIZAR</Typography>
                                            <QrCode2Icon style={{ color: '#FFFFFF' }} />
                                        </Button>
                                    </Grid>
                                </TableCell>
                            </TableRow>
                            {productionStarted.map((rowProduction) => (
                                <TableRow key={rowProduction.id}>
                                    <TableCell align="center" width="50%">
                                        <Grid key={rowProduction.id}>
                                            <Card>
                                                <CardHeader
                                                    title={rowProduction.nome_processo}
                                                    titleTypographyProps={{ align: 'right', variant: "body2" }}
                                                    subheader={rowProduction.nome_proximo_processo ? rowProduction.nome_proximo_processo : null/*<br />*/}
                                                    subheaderTypographyProps={{ align: 'right', variant: "body2" }}
                                                    avatar={
                                                        <Typography variant="body2" align="left" color="text.secondary">
                                                            {rowProduction.id_pedido}
                                                        </Typography>
                                                    }
                                                    sx={{ backgroundColor: "#FBECE8", color: "#000000", maxHeight: 50 }}
                                                />
                                                <CardContent sx={{ maxHeight: 65 }}>
                                                    <Box>
                                                        <Typography variant="body2" align="center" color="text.primary">
                                                            {rowProduction.nome_produto}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {rowProduction.observacao ? rowProduction.observacao : null/*<br />*/}
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Container>
            </Box >
            <Box component="main" sx={{ flexGrow: 1, height: '100vh' }}>
                <Toolbar />
                <Container maxWidth="xg" sx={{ mt: 4, mb: 4 }}>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    align="center"
                                    width="50%"
                                    style={{ background: '#E8927C', color: '#FFFFFF' }}
                                >
                                    Pausado
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="flex-end"
                                        alignItems="baseline"
                                    >
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => {
                                                setOpenQrCode(true);
                                                setFunctionToBeExecuted("handleResumeProduction")
                                            }}
                                        >
                                            <Typography color="#FFFFFF">RETOMAR</Typography>
                                            <QrCode2Icon style={{ color: '#ffffff' }} />
                                        </Button>
                                    </Grid>
                                </TableCell>
                            </TableRow>
                            {productionPaused.map((rowProductionPaused) => (
                                <TableRow key={rowProductionPaused.id}>
                                    <TableCell align="center" width="50%">
                                        <Grid key={rowProductionPaused.id}>
                                            <Card>
                                                <CardHeader
                                                    title={rowProductionPaused.nome_processo}
                                                    titleTypographyProps={{ align: 'right' }}
                                                    subheader={rowProductionPaused.nome_proximo_processo ? rowProductionPaused.nome_proximo_processo : null/*<br />*/}
                                                    subheaderTypographyProps={{ align: 'right', }}
                                                    avatar={
                                                        <Typography variant="body2" align="left" color="text.secondary">
                                                            {rowProductionPaused.id_pedido}
                                                        </Typography>
                                                    }
                                                    sx={{ backgroundColor: "#FBECE8", color: "#000000", maxHeight: 50 }}
                                                />
                                                <CardContent sx={{ maxHeight: 65 }}>
                                                    <Box>
                                                        <Typography variant="body2" align="center" color="text.primary">
                                                            {rowProductionPaused.nome_produto}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {rowProductionPaused.observacao ? rowProductionPaused.observacao : null/*<br />*/}
                                                        </Typography>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Container>
            </Box >
        </>
    );
}