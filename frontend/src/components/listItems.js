import * as React from 'react';
import {ListItem, ListItemIcon, ListItemText} from '@mui/material';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import DiamondIcon from '@mui/icons-material/Diamond';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import PlumbingIcon from '@mui/icons-material/Plumbing';

export const mainListItems = (
  <>
    <ListItem button component="a" href="/pedidos" >
      <ListItemIcon >
        <ReceiptIcon style={{ color: "#000000" }} />
      </ListItemIcon>
      <ListItemText primary="Pedidos" primaryTypographyProps={{ color: "#000000" }} />
    </ListItem>
    <ListItem button component="a" href="/processos" >
      <ListItemIcon >
        <PrecisionManufacturingIcon style={{ color: "#000000" }} />
      </ListItemIcon>
      <ListItemText primary="Processos" primaryTypographyProps={{ color: "#000000" }} />
    </ListItem>
    <ListItem button component="a" href="/" >
      <ListItemIcon >
        <PlumbingIcon style={{ color: "#000000" }} />
      </ListItemIcon>
      <ListItemText primary="Produção" primaryTypographyProps={{ color: "#000000" }} />
    </ListItem>
    <ListItem button component="a" href="/produtos" >
      <ListItemIcon >
        <DiamondIcon style={{ color: "#000000" }} />
      </ListItemIcon>
      <ListItemText primary="Produtos" primaryTypographyProps={{ color: "#000000" }} />
    </ListItem>
    <ListItem button component="a" href="/setores" >
      <ListItemIcon >
        <ViewModuleIcon style={{ color: "#000000" }} />
      </ListItemIcon>
      <ListItemText primary="Setores" primaryTypographyProps={{ color: "#000000" }} />
    </ListItem>
    <ListItem button component="a" href="/usuarios" >
      <ListItemIcon >
        <PersonIcon style={{ color: "#000000" }} />
      </ListItemIcon>
      <ListItemText primary="Usuários" primaryTypographyProps={{ color: "#000000" }} />
    </ListItem>
  </>
);