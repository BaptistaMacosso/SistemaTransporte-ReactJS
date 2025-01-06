import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Dashboard from '../../components/Dashboard/dashboard';
import NavBar from '../../components/NavBar';
import { Button, Card, CardContent, Grid2, Paper, Stack, Typography } from '@mui/material';
import { TireRepair } from '@mui/icons-material';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
//API
import { listarManutencaoPorId } from '../../services/manutencaoService';


const DetalhesPedidoAsistenciaTecnica = () => {
  //States
  const { token } = useContext(AuthContext) ||{ token: localStorage.getItem('token') };
  const { isAuthenticated, Logout } = useContext(AuthContext);
  const [manutencao, setManutencao] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  //...................................API........................
  // Busca os detalhes do pedido ao carregar a página.
  const fetchPedido = async () => {
    try {
      const response = await listarManutencaoPorId(id, token);
      if(response){
        setManutencao(response);
      }else{
        toast.warn("Nenhum detalhe de manutenção encontrada ou formato inesperado.");
        setManutencao([]);
      } 
    } catch (error) {
      setManutencao([]); // Previna erros futuros
      toast.error("Error: Não foi possível listar as manutenções. Verifique os detalhes no console.");
      console.log("Detalhes: "+error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      Logout();
      navigate('/login');
    }else{
      fetchPedido();
    }
  }, [isAuthenticated, Logout]);
  //..............................................................

  return (
  <>
    <NavBar />
    <Box height={60} />
    <Box sx={{ display: 'flex' }}  paddingLeft={1} paddingRight={1}>
      <Dashboard />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Stack spacing={2} direction="row" sx={{ width: '100%' }}>
          <Card sx={{ width: '100%', height: 85+"vh" }}>
            <CardContent>
                <Grid2 container spacing={2} direction={'row'}>
                <TireRepair sx={{marginTop: 0.5, marginLeft: 0, color: 'text.secondary'}} />
                    <Typography sx={{ color: 'text.secondary', marginBottom: 2 }} gutterBottom variant="h6" component="div">Detalhe da Manutenção</Typography>
                </Grid2>
                <Box p={3}>
                <Button variant="contained" onClick={() => navigate(-1)}>Voltar</Button>
                <Card sx={{ mt: 2 }}>
                    <CardContent>
                    <Paper sx={{ padding: 3 }}>
                    <Typography variant="h5" gutterBottom>Detalhes da Manutenção #{manutencao.id}</Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Viatura:</strong> {manutencao.viatura?.viaturaMarca} {manutencao.viatura?.viaturaModelo} ({manutencao.viatura?.viaturaMatricula})
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Tipo de Manutenção:</strong> {manutencao.tipoManutencao?.tipoManutencao}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Descrição:</strong> {manutencao.descricao || "Não informado"}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Data:</strong> {new Date(manutencao.dataManutencao).toLocaleDateString()}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Quilometragem:</strong> {manutencao.quilometragem} km
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Responsável:</strong> {manutencao.responsavel || "Não informado"}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>Status:</strong> {manutencao.statusManutencao?.statusManutencao}
                    </Typography>
                  </Paper>
                                </CardContent>
                </Card>
                </Box>
            </CardContent>
            </Card>
        </Stack>
      </Box>
    </Box>
  </>
  )
}

export default DetalhesPedidoAsistenciaTecnica;