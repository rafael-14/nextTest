import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { login, logout, getToken } from '../services/auth';
import Login from "./login"
import {
  Button, styled, CssBaseline, Box, createTheme, ThemeProvider,
  Toolbar, List, Divider, IconButton, Grid
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { mainListItems } from '../components/listItems';

const theme = createTheme({
  palette: {
    primary: { main: '#E8927C' },
    secondary: { main: '#000000' }
  }
})

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

export default function MyApp({ Component, pageProps }) {

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

  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  async function handleLogout() {
    let response = await api.get('/api/destroy/token', { headers: { token: getToken() } })
    if (response.status === 200) {
      logout()
      window.location.href = "/login"
    }
  }

  return (
    <ThemeProvider theme={theme}>
      {!redirect ?
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="fixed" style={{ background: '#E8927C' }} open={open}>
            <Toolbar
              sx={{
                pr: '24px',
              }}
            >
              <IconButton
                edge="start"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  color: "#FFFFFF",
                  marginRight: '36px',
                  ...(open && { display: 'none' }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Grid
                container
                direction="row"
                justifyContent="space-between"
              >
                <Button style={{ color: '#FFFFFF', hover: '#FFFFFF' }} href="/"><strong>Virtual Joias ERP</strong></Button>
                <Button style={{ color: '#FFFFFF', hover: '#FFFFFF' }} onClick={() => handleLogout()}><strong>Sair</strong></Button>
              </Grid>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1],
              }}
            >
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <List>{mainListItems}</List>
            <Divider />
          </Drawer>
          <Component {...pageProps} />
        </Box>
        : <Login />}
    </ThemeProvider>
  )
}