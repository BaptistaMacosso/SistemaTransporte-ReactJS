import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Dashboard from '../../components/Dashboard/dashboard';
import NavBar from '../../components/NavBar';
import { Button, Card, CardContent, FormControl, Grid2, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { TireRepair } from '@mui/icons-material';
import { AuthContext } from '../../contexts/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
//API
import { listarStatusServico } from '../../services/statusServicoService';
import { alterarStatusPedidosAssistenciaTecnica, listarPedidoAssistenciaTecnicaPorId } from '../../services/pedidoAssistenciaTecnica';


const DetalhesPedidoAsistenciaTecnica = () => {
  //States
  const { token } = useContext(AuthContext) ||{ token: localStorage.getItem('token') };
  const { isAuthenticated, Logout } = useContext(AuthContext);
  const [pedido, setPedido] = useState([]);
  const [statusServico, setStatusServico] = useState([]);
  const [novoStatus, setNovoStatus] = useState({ statusId: null, descricao: '', });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoStatus({ ...novoStatus, [name]: value });
  };

  //...................................API........................

  //Confirmar 
  const handleConfirmar = async () => {
    try {
      const response = await alterarStatusPedidosAssistenciaTecnica(id, novoStatus, token);
      if(response.status === 200){
        toast.success(response.data.message);
        fetchPedido();
        navigate(-1); // Volta para a página anterior.
      }else{
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Erro: Não foi possível alterar o status do pedido de assitência. Verifique os detalhes no console.");
      console.log("Detalhes: "+error);
    }
  };

  //Rejeitar
  const handleRejeitar = async () => {
    try {
      
      navigate(-1); // Volta para a página anterior.
    } catch (error) {
      toast.error("Erro ao rejeitar pedido.");
    }
  };

  // Busca os detalhes do pedido ao carregar a página.
  const fetchPedido = async () => {
    setLoading(true);
    try {
      const response = await listarPedidoAssistenciaTecnicaPorId(id, token);
      if(response){
        setPedido(response);
        setLoading(false);
      }else{
        toast.warn("Nenhum pedido de assitência encontrada ou formato inesperado.");
        setPedido([]);
        setLoading(false);
      } 
    } catch (error) {
      setPedido([]); // Previna erros futuros
      toast.error("Error: Não foi possível listar os pedidos de assitência. Verifique os detalhes no console.");
      console.log("Detalhes: "+error);
      setLoading(false);
    }
  };

  //Listar Status Serviço
    const ListarStatusServicoPedido = async () => {
      try {
        const response = await listarStatusServico(token);
        if(response){
          setStatusServico(response);
        }else{
          toast.warn("Nenhum status de serviço encontrado ou formato inesperado.");
          setStatusServico([]);
        }
      } catch (error) {
        setStatusServico([]);
        toast.error("Erro: Não foi possível listar os status de serviço. Verifique os detalhes no console.");
        console.log("Detalhes: "+error);
      }
    };

  useEffect(() => {
    if (!isAuthenticated) {
      Logout();
      navigate('/login');
    }else{
      fetchPedido();
      ListarStatusServicoPedido();
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
                    <Typography sx={{ color: 'text.secondary', marginBottom: 2 }} gutterBottom variant="h6" component="div">Detalhe do Pedido de Assistência</Typography>
                </Grid2>
                <Box p={3}>
                <Button variant="contained" onClick={() => navigate(-1)}>Voltar</Button>
                <Card sx={{ mt: 2 }}>
                    <CardContent>
                    <Typography variant="h5" gutterBottom>Detalhes do Pedido #{pedido.pedidoId}</Typography>
                    <Typography><strong>Viatura:</strong> {pedido.viatura?.viaturaMarca} - {pedido.viatura?.viaturaModelo} ({pedido.viatura?.viaturaMatricula})</Typography>
                    <Typography><strong>Tipo de Serviço:</strong> {pedido.tipoServico?.tipoServico}</Typography>
                    <Typography><strong>Descrição do Pedido:</strong> {pedido?.descricao}</Typography>
                    <Typography><strong>Oficina:</strong> {pedido.prestador?.prestadorNome}</Typography>
                    <Typography><strong>Status Actual:</strong> {pedido.status?.descricao}</Typography>
                    <Typography><strong>Data de Solicitação:</strong> {new Date(pedido?.dataSolicitacao).toLocaleDateString()}</Typography>

                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="status-select-label">Alterar Estado do Pedido</InputLabel>
                        <Select
                        labelId="status-select-label"
                        name="statusId"
                        value={novoStatus.statusId}
                        onChange={handleChange}>
                            {statusServico.map((status) => (
                                <MenuItem value={status.statusId}>
                                {status.descricao}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box display="flex" justifyContent="space-between" mt={3}>
                        <Button variant="contained" color="success" onClick={handleConfirmar}>Confirmar Pedido</Button>
                        <Button variant="contained" color="error" onClick={handleRejeitar}>Rejeitar Pedido</Button>
                    </Box>
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