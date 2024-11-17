import React, { useContext, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Dashboard from '../../components/Dashboard/dashboard';
import NavBar from '../../components/NavBar';
import { Card,Typography,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,
  IconButton,Tooltip,TextField,Dialog,DialogActions,DialogContent,DialogTitle,Button,Grid2
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { AuthContext } from '../../contexts/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Motoristas = () => {
    // Recupera o token do contexto de autenticação ou localStorage
    const { token } = useContext(AuthContext) || { token: localStorage.getItem('token') };
    const { isAuthenticated, logout  } = useContext(AuthContext);
    const [motoristas, setMotoristas] = useState([]);
    const [NovoMotorista, setNovoMotorista] = useState({ motoristaId: null, motoristaNome: '', motoristaEmail: '', motoristaTelefone: '', CartaDeConducaoNr: '', DataValidade: '', numeroBI: ''});
    const [isEdit, setIsEdit] = useState(false); // Indica se é modo edição.
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [filtro, setFiltro] = useState('');
    const { navigate } = useNavigate();

    const handleOpen = (motoris) => {
      if(motoris.motoristaId === undefined){
        setIsEdit(false);
        setNovoMotorista({ 
          motoristaId: null, 
          motoristaNome: motoris.motoristaNome || '', 
          motoristaEmail: motoris.motoristaEmail || '', 
          motoristaTelefone: motoris.motoristaTelefone || '', 
          CartaDeConducaoNr: motoris.CartaDeConducaoNr || '', 
          DataValidade: motoris.DataValidade || '', 
          numeroBI: motoris.numeroBI || ''});
        }
        else{
          setIsEdit(true);
          setNovoMotorista({ 
            motoristaId: motoris.motoristaId, 
            motoristaNome: motoris.motoristaNome, 
            motoristaEmail: motoris.motoristaEmail, 
            motoristaTelefone: motoris.motoristaTelefone, 
            CartaDeConducaoNr: motoris.CartaDeConducaoNr, 
            DataValidade: motoris.DataValidade, 
            numeroBI: motoris.numeroBI});
          }
          setOpen(true);
    };

    const handleClose = () => setOpen(false);
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      setNovoMotorista({ ...NovoMotorista, [name]: value });
    };
        
    //Pesquisar Motoristas na tabela.
    const handleSearch = (e) => setFiltro(e.target.value);
        
    const motoristaFiltrado = motoristas.filter((moto) =>
       moto.motoristaNome.toLowerCase().includes(filtro.toLowerCase())
    );
      
    //.........................API...............................
    useEffect(()=>{
      if(!isAuthenticated){
        logout();
        navigate('/login');
      }else{
        fetchMotoristas();
      }
    },[isAuthenticated, logout]);

    const fetchMotoristas = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3050/api/motorista/listar',
          {
          headers: {
            'Authorization': `Bearer ${token}`, // Passa o token no cabeçalho
          },
        });
        setMotoristas(response.data.motorista);
      } catch (error) {
        toast.error("Erro: Não foi possível carregar a lista de motoristas. Detalhes: "+error);
      }finally{
        setLoading(false);
      };
    };

    const handleSave = async() => {
      if(isEdit){
        handleEdit();
      }else{
        if(!NovoMotorista.motoristaNome && !NovoMotorista.motoristaTelefone && !NovoMotorista.CartaDeConducaoNr &&
           !NovoMotorista.DataValidade && !NovoMotorista.numeroBI){
            toast.error('Preencha todos os campos');
        }else{
          try{
            const response = await axios.post('http://localhost:3050/api/motorista/registar',
            NovoMotorista,
            {
              headers: {
                'Authorization': `Bearer ${token}`, // Passa o token no cabeçalho
                'Content-Type': 'application/json',
              },
            });
            if(response.status === 201){
              toast.success(response.data.message);
            }
          }catch(error){
            toast.error('Erro: não foi possível salvar o motorista. Detalhes: '+error);
          }
        }
      }
      handleClose();
      fetchMotoristas();
    };

    //Editar Motorista
    const handleEdit = async () =>{
      try{
        const response = await axios.put(`http://localhost:3050/api/motorista/update/${NovoMotorista.motoristaId}`,
        NovoMotorista,
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Passa o token no cabeçalho
            'Content-Type': 'application/json',
          },
        });
        if(response.status === 201){
          toast.success(response.data.message);
        }
      }catch(error){
        toast.error('Erro: não foi possível salvar o motorista. Detalhes: '+error);
      }
      fetchMotoristas();
    };

    //Delete Motorista
    const handleDelete = async (motorista) => {
      if (window.confirm('Tem certeza que deseja excluir este Motorista?')) {
        try {
          const response = await axios.delete(`http://localhost:3050/api/motorista/delete/${motorista.motoristaId}`,
            {
              headers:{
                'Authorization': `Bearer ${token}`,
              }
            });
          if(response.status === 201) {
            toast.success(response.data.message);
          }
        } catch (error) {
          toast.error('Erro: não foi possível excluir o motorista.'+error);
        }
      }
      fetchMotoristas();
    };

    //...........................................................

   return (
    <>
      <NavBar />
      <Box height={60} />
      <Box sx={{ display: 'flex' }} paddingLeft={1} paddingRight={1}>
        <Dashboard />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {/* Botão de Adicionar e Campo de Pesquisa */}
          <Grid2 item xs={12} display="flex" justifyContent="space-between" alignItems="center">
              <TextField
                label="Pesquisar por nome"
                variant="outlined"
                value={filtro}
                onChange={handleSearch}
                sx={{ marginBottom: 2 }}
              />
              <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
                Novo Motorista
              </Button>
          </Grid2>
          {/* Tabela de Viaturas */}
          <Box marginBottom={3}/>
          <Grid2 item xs={12}>
          <Box marginBottom={2}/>
            <Card>
              <Typography variant="h6" sx={{ padding: 2, backgroundColor: 'primary.main', color: 'white' }}>Lista de Motoristas</Typography>
              <TableContainer component={Paper}>
                <Table aria-label="tabela de motoristas">
                  <TableHead>
                    <TableRow>
                      <TableCell>Código</TableCell>
                      <TableCell>Nome do Motorista</TableCell>
                      <TableCell>Telemóvel</TableCell>
                      <TableCell>Carta de Condução</TableCell>
                      <TableCell>Número Bilhete</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {motoristaFiltrado.map((motorista) => {
                      return (
                        <TableRow key={motorista.motoristaId}>
                          <TableCell>{motorista.motoristaId}</TableCell>
                          <TableCell>{motorista.motoristaNome}</TableCell>
                          <TableCell>{motorista.motoristaTelefone}</TableCell>
                          <TableCell>{motorista.CartaDeConducaoNr}</TableCell>
                          <TableCell>{motorista.numeroBI}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="Editar">
                              <IconButton color="primary" onClick={() => handleOpen(motorista)}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Excluir">
                              <IconButton color="secondary" onClick={() => handleDelete(motorista)}>
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
            <DialogTitle>{isEdit===true ? 'Editar Motorista' : 'Adicionar Novo Motorista' }</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Nome"
                name="motoristaNome"
                type="text"
                fullWidth
                value={NovoMotorista.motoristaNome}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                label="Email"
                name="motoristaEmail"
                fullWidth
                type="email"
                value={NovoMotorista.motoristaEmail}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                label="Telefone"
                name="motoristaTelefone"
                type="tel"
                fullWidth
                value={NovoMotorista.motoristaTelefone}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                label="Carta de Condução"
                name="CartaDeConducaoNr"
                type="text"
                fullWidth
                value={NovoMotorista.CartaDeConducaoNr}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                label="Data Validade"
                name="DataValidade"
                type="date"
                fullWidth
                value={NovoMotorista.DataValidade}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                label="Número Bilhete"
                name="numeroBI"
                type="text"
                fullWidth
                value={NovoMotorista.numeroBI}
                onChange={handleChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">Cancelar</Button>
              <Button onClick={handleSave} color="primary">{isEdit===true ? 'Salvar Alterações' : 'Adicionar' }</Button>
            </DialogActions>
          </Dialog>
        {/**/}

        </Box>
      </Box>
    </>
  )
}

export default Motoristas;