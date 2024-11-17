import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Dashboard from '../../components/Dashboard/dashboard';
import NavBar from '../../components/NavBar';
import { differenceInDays, parseISO } from 'date-fns';
import { Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid2, Divider, Tooltip, IconButton, TablePagination } from '@mui/material';



const Home = () => {
    const hoje = new Date();
    const [filtro, setFiltro] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
  
   // Dados simulados de viaturas
   const viaturas = [
      { id: 1, placa: 'ABC-1234', modelo: 'Ford Ranger', km: 49500, dataManutencao: '2024-11-20' },
      { id: 2, placa: 'DEF-5678', modelo: 'Toyota Hilux', km: 47500, dataManutencao: '2024-11-25' },
      { id: 3, placa: 'GHI-9012', modelo: 'Chevrolet S10', km: 49000, dataManutencao: '2024-11-28' },
      { id: 4, placa: 'JKL-3456', modelo: 'Nissan Frontier', km: 46000, dataManutencao: '2024-12-01' },
      { id: 5, placa: 'MNO-7890', modelo: 'Volkswagen Amarok', km: 48000, dataManutencao: '2024-12-05' },
      // Adicione mais dados conforme necessário
    ];
    
    const handleEdit = (id) => {
      console.log(`Editar viatura com ID: ${id}`);
      // Adicione aqui a lógica para editar a viatura
    };
  
    const handleDelete = (id) => {
      console.log(`Excluir viatura com ID: ${id}`);
      // Adicione aqui a lógica para excluir a viatura
    };

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const viaturasFiltradas = viaturas.filter((viatura) =>
      viatura.placa.toLowerCase().includes(filtro.toLowerCase())
    );

     // Determina as viaturas que serão exibidas na página atual
    const viaturasExibidas = viaturasFiltradas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


   return (
    <>
      <NavBar />
      <Box height={60} />
      <Box sx={{ display: 'flex' }}  paddingLeft={1} paddingRight={1}>
        <Dashboard />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        
        <Grid2 container spacing={3}>
          {/* Card de Estados */}
          <Grid2 item xs={12} sm={6} md={4}>
            <Card sx={{ padding: 3, textAlign: 'center', backgroundColor: '#20B2AA' }}>
              <Typography variant="h6">Total de Viaturas</Typography>
              <Typography variant="h3">{viaturas.length}</Typography>
            </Card>
          </Grid2>

          <Grid2 item xs={12} sm={6} md={4}>
            <Card sx={{ padding: 3, textAlign: 'center', backgroundColor: '#FFA500'}}>
              <Typography variant="h6">Próximas Manutenções</Typography>
              <Typography variant="h3">{viaturas.length}</Typography>
            </Card>
          </Grid2>

          <Grid2 item xs={12} sm={6} md={4}>
            <Card sx={{ padding: 3, textAlign: 'center', backgroundColor: '#B22222' }}>
              <Typography variant="h6">Publicidade Expiradas</Typography>
              <Typography variant="h3">{viaturas.length}</Typography>
            </Card>
          </Grid2>

          <Grid2 item xs={12} sm={6} md={4}>
            <Card sx={{ padding: 3, textAlign: 'center' }}>
              <Typography variant="h6">Checklist Concluídos</Typography>
              <Typography variant="h3">{viaturas.length}</Typography>
            </Card>
          </Grid2>

          <Grid2 item xs={12} sm={6} md={4}>
            <Card sx={{ padding: 3, textAlign: 'center', backgroundColor: '#008B8B' }}>
              <Typography variant="h6">Plano de Manutenção</Typography>
              <Typography variant="h3">{viaturas.length}</Typography>
            </Card>
          </Grid2>
          <Divider />
           {/* Tabela de Viaturas */}
           <TableContainer component={Paper}>
           <Typography variant="h6" sx={{ padding: 2, backgroundColor: 'primary.main', color: 'white' }}>Lista de Viaturas para Manutenção</Typography>
                <Table aria-label="tabela de viaturas">
                  <TableHead>
                    <TableRow>
                      <TableCell>Código</TableCell>
                      <TableCell>Matrícula</TableCell>
                      <TableCell>Modelo</TableCell>
                      <TableCell>Kilometragem</TableCell>
                      <TableCell>Data de Manutenção</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {viaturas.map((viatura) => {
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
                            <IconButton color="primary" onClick={() => handleEdit(viatura.id)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Excluir">
                            <IconButton color="secondary" onClick={() => handleDelete(viatura.id)}>
                              <DeleteIcon color='#A52A2A'/>
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                {/* Componente de Paginação */}
                <TablePagination
                  component="div"
                  count={viaturasFiltradas.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Viaturas por página"
                />
              </TableContainer>
              
        </Grid2>
        </Box>
      </Box>
    </>
  );
};

export default Home;

