import * as React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import DiamondIcon from '@mui/icons-material/Diamond';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import PlumbingIcon from '@mui/icons-material/Plumbing';
import Link from 'next/link'

export const mainListItems = (
  <>
    <Link href="/listar/pedidos">
      <ListItem button component="a">
        <ListItemIcon >
          <ReceiptIcon style={{ color: "#000000" }} />
        </ListItemIcon>
        <ListItemText primary="Pedidos" primaryTypographyProps={{ color: "#000000" }} />
      </ListItem>
    </Link>
    <Link href="/listar/processos">
      <ListItem button component="a">
        <ListItemIcon >
          <PrecisionManufacturingIcon style={{ color: "#000000" }} />
        </ListItemIcon>
        <ListItemText primary="Processos" primaryTypographyProps={{ color: "#000000" }} />
      </ListItem>
    </Link>
    <Link href="/">
      <ListItem button component="a">
        <ListItemIcon >
          <PlumbingIcon style={{ color: "#000000" }} />
        </ListItemIcon>
        <ListItemText primary="Produção" primaryTypographyProps={{ color: "#000000" }} />
      </ListItem>
    </Link>
    <Link href="/listar/produtos">
      <ListItem button component="a">
        <ListItemIcon >
          <DiamondIcon style={{ color: "#000000" }} />
        </ListItemIcon>
        <ListItemText primary="Produtos" primaryTypographyProps={{ color: "#000000" }} />
      </ListItem>
    </Link>
    <Link href="/listar/setores">
      <ListItem button component="a">
        <ListItemIcon >
          <ViewModuleIcon style={{ color: "#000000" }} />
        </ListItemIcon>
        <ListItemText primary="Setores" primaryTypographyProps={{ color: "#000000" }} />
      </ListItem>
    </Link>
    <Link href="/listar/usuarios">
      <ListItem button component="a">
        <ListItemIcon >
          <PersonIcon style={{ color: "#000000" }} />
        </ListItemIcon>
        <ListItemText primary="Usuários" primaryTypographyProps={{ color: "#000000" }} />
      </ListItem>
    </Link>
  </>
);