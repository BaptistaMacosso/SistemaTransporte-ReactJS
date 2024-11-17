import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Dashboard from '../../components/Dashboard/dashboard';
import NavBar from '../../components/NavBar';
import { Card,Typography,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,
  IconButton,Tooltip,TextField,Dialog,DialogActions,DialogContent,DialogTitle,Button,Grid2
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { differenceInDays, parseISO } from 'date-fns';


const Publicidade = () => {

    const [viaturas, setViaturas] = useState([
      { id: 1, placa: 'ABC-1234', modelo: 'Ford Ranger', km: 49500, dataManutencao: '2024-11-20' },
      { id: 2, placa: 'DEF-5678', modelo: 'Toyota Hilux', km: 47500, dataManutencao: '2024-11-25' },
      { id: 3, placa: 'GHI-9012', modelo: 'Chevrolet S10', km: 49000, dataManutencao: '2024-11-28' },
    ]);
    const [open, setOpen] = useState(false);
    const [novaViatura, setNovaViatura] = useState({ placa: '', modelo: '', km: '', dataManutencao: '' });
    const [filtro, setFiltro] = useState('');

    const hoje = new Date();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setNovaViatura({ ...novaViatura, [name]: value });
    };

    const adicionarPlano = () => {
      const novaId = viaturas.length ? viaturas[viaturas.length - 1].id + 1 : 1;
      setViaturas([...viaturas, { ...novaViatura, id: novaId }]);
      setNovaViatura({ placa: '', modelo: '', km: '', dataManutencao: '' });
      handleClose();
    };

    const handleSearch = (e) => setFiltro(e.target.value);

    const viaturasFiltradas = viaturas.filter((viatura) =>
      viatura.placa.toLowerCase().includes(filtro.toLowerCase())
    );

   return (
    <>
      <NavBar />
      <Box height={60} />
      <Box sx={{ display: 'flex' }}  paddingLeft={1} paddingRight={1}>
        <Dashboard />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            {/* Botão de Adicionar e Campo de Pesquisa */}
            <Grid2 item xs={12} display="flex" justifyContent="space-between" alignItems="center">
                <TextField
                  label="Pesquisar por viatura"
                  variant="outlined"
                  value={filtro}
                  onChange={handleSearch}
                  sx={{ marginBottom: 2 }}
                />
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
                  Adicionar Publicidade
                </Button>
            </Grid2>
            {/* Tabela de Publicidade */}
            <Grid2 item xs={12}>
              <Card>
                <Typography variant="h6" sx={{ padding: 2 }}>Lista de Publicidade</Typography>
                <TableContainer component={Paper}>
                  <Table aria-label="tabela de publicidade">
                    <TableHead>
                      <TableRow>
                        <TableCell>Código</TableCell>
                        <TableCell>Placa</TableCell>
                        <TableCell>Modelo</TableCell>
                        <TableCell>Kilometragem</TableCell>
                        <TableCell>Data de Manutenção</TableCell>
                        <TableCell align="center">Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {viaturasFiltradas.map((viatura) => {
                        const diasParaManutencao = differenceInDays(parseISO(viatura.dataManutencao), hoje);
                        const highlight = diasParaManutencao <= 10 ? { backgroundColor: '#EEEED1' } : {};

                        return (
                          <TableRow key={viatura.id} style={highlight}>
                            <TableCell>{viatura.id}</TableCell>
                            <TableCell>{viatura.placa}</TableCell>
                            <TableCell>{viatura.modelo}</TableCell>
                            <TableCell>{viatura.km} km</TableCell>
                            <TableCell>{viatura.dataManutencao}</TableCell>
                            <TableCell align="center">
                              <Tooltip title="Editar">
                                <IconButton color="primary">
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Excluir">
                                <IconButton color="secondary">
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid2>
            {/* Modal de Adicionar Nova Viatura */}
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Adicionar Nova Publicidade</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Placa"
                  name="placa"
                  fullWidth
                  value={novaViatura.placa}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  label="Modelo"
                  name="modelo"
                  fullWidth
                  value={novaViatura.modelo}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  label="Kilometragem"
                  name="km"
                  type="number"
                  fullWidth
                  value={novaViatura.km}
                  onChange={handleChange}
                />
                <TextField
                  margin="dense"
                  label="Data de Manutenção"
                  name="dataManutencao"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={novaViatura.dataManutencao}
                  onChange={handleChange}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="secondary">Cancelar</Button>
                <Button onClick={adicionarPlano} color="primary">Adicionar</Button>
              </DialogActions>
            </Dialog>
          {/**/}

        </Box>
      </Box>
    </>
  )
}

export default Publicidade;