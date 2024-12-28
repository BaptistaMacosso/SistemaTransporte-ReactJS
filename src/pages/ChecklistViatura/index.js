import React, { useContext, useEffect, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Dashboard from '../../components/Dashboard/dashboard';
import NavBar from '../../components/NavBar';
import { Card,Typography,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,
         IconButton,Tooltip,TextField,Dialog,DialogActions,DialogContent,DialogTitle,Button,Grid2,
         FormControl,InputLabel,Select,MenuItem,CircularProgress
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { listar, inserir, deletar } from '../../services/checklistService';
import {listarTipoManutencao} from '../../services/tipoManutencaoService';
import { listarViatura } from '../../services/viaturasService';
import { AuthContext } from '../../contexts/auth';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CheckViatura = () => {
  const [loading, setLoading] = useState(true); // Estado para gerenciar o carregamento.
  const [checkViatura, setCheckViatura] = useState([]);
  const [tipoManutencao, setTipoManutencao] = useState([]);
  const { token } = useContext(AuthContext) ||{ token: localStorage.getItem('token') };
  const [novoCheckViatura, setNovoCheckViatura] = useState({
    id: null, 
    viaturaId: '',
    tipoManutencaoId: '',
    quilometragem: 0,
    itemsVerificados: '',
    observacao: '',
    tecnicoResponsavel: ''
  });
  const { isAuthenticated, Logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [isEdit, setIsEdit] = useState(false); // Indica se é modo edição.
  const [viaturas, setViaturas] = useState([]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoCheckViatura({ ...novoCheckViatura, [name]: value });
  };
  
  const handleSearch = (e) => setFiltro(e.target.value);

  const checkViaturaFiltradas = Array.isArray(checkViatura) 
    ? checkViatura.filter((viaturaCheck) => viaturaCheck.viatura.viaturaMatricula.toLowerCase().includes(filtro.toLowerCase())) 
    : [];

  // Função para abrir o modal para adicionar ou editar
  const handleOpen = (check) => {
    if (check.id === undefined) {
      setIsEdit(false);
      setNovoCheckViatura({ 
        id: null, 
        viaturaId: novoCheckViatura.viaturaId,
        tipoManutencaoId: novoCheckViatura.tipoManutencaoId,
        quilometragem: parseFloat(novoCheckViatura.quilometragem),
        itemsVerificados: novoCheckViatura.itemsVerificados,
        observacao: novoCheckViatura.observacao,
        tecnicoResponsavel: novoCheckViatura.tecnicoResponsavel
      });
    } 
    setOpen(true);
  };

  const handleClose = () => {
    setIsEdit(false);
    setOpen(false);
    setNovoCheckViatura({ id: null, viaturaId: '', tipoManutencaoId: '', quilometragem: 0, itemsVerificados: '', observacao: '', tecnicoResponsavel: ''});
  }
    //................................API.............................
   
    //Deletar Checklist
    const handleDelete = async (checkViatura) => {   
      try {
        if (window.confirm('Tem certeza que deseja excluir este verificação?')) {
          const response = await deletar(checkViatura.id, token);
          if(response.status === 201){
            toast.success(response.data.message);
            listagemCheckListViaturas();
          }
        };
      } catch (error) {
        if (error.response.status === 500) {
          toast.error(error.response.data.message);       
        } else if (error.response.status === 400) {
          toast.error(error.response.data.message); 
        }
      }
    };

    //Criar Checklist
    const handleSave = async () =>{
      if (isEdit) {
        //Editar
        handleClose();
        listagemCheckListViaturas();
      } else {
        //Salvar
        try {
          const response = await inserir(novoCheckViatura, token);
          if(response.status === 201){
            toast.success("Verificação criado com sucesso!");
            listagemCheckListViaturas();
          }
          handleClose();
        } catch (error) {
          if(error.response.status === 500){
            toast.error(error.response.data.message);
          }else if(error.response.status === 400){
            toast.error(error.response.data.message);
          }
        };
      }
    };

    //Listagem de checklist de viaturas
    const listagemCheckListViaturas = async () =>{
      setLoading(true);
      try {
        const response = await listar(token);
        if (response.data.checklist) {
          setCheckViatura(response.data.checklist);
        } else {
          setCheckViatura([]); // Previna erros futuros
        }
        setLoading(false);
      } catch (error) {
        setCheckViatura([]); // Previna erros futuros
        toast.error("Erro: Não foi possível listar as viaturas. Detalhes: "+error);
      }
    };

    //Listagem Tipo de Manutenção
    const listagemTipoManutencao = async () =>{
      try {
        const response = await listarTipoManutencao(token);

        if (Array.isArray(response.data.tipos)) {
          setTipoManutencao(response.data.tipos);
        } else {
          setTipoManutencao([]); // Previna erros futuros
        }
      } catch (error) {
        setTipoManutencao([]); // Previna erros futuros
        toast.error("Erro: Não foi possível listar o tipo de manutenção. Detalhes: "+error);
      }
    };

    //Listagem Tipo de Manutenção
    const listagemViaturas = async () =>{
      try {
        const response = await listarViatura(token);
        if (response.data.viaturas) {
          setViaturas(response.data.viaturas);
        } else {
          setViaturas([]); // Previna erros futuros
        }
      } catch (error) {
        setViaturas([]); // Previna erros futuros
        toast.error("Erro: Não foi possível listar as viaturas. Detalhes: "+error);
      }
    };

    const listagemDados = useCallback(async () => {
      try {
        await Promise.all([
          listagemCheckListViaturas(),
          listagemTipoManutencao(),
          listagemViaturas(),
        ]);
      } catch (error) {
        console.error('Erro ao listar dados:', error);
      }
    }, []);
  
    useEffect(() => {
      if (!isAuthenticated) {
        Logout();
        Navigate('/login');
      } else {
        listagemDados();
      }
    }, [isAuthenticated, Logout, listagemDados]);

    //................................................................
    
   return (
    <>
      <NavBar />
      <Box height={60} />
      <Box sx={{ display: 'flex' }} paddingLeft={1} paddingRight={1}>
        <Dashboard />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/**/}
          {/* Botão de Adicionar e Campo de Pesquisa */}
          <Grid2 item xs={12} display="flex" justifyContent="space-between" alignItems="center">
            <TextField
              label="Pesquisar por Matrícula"
              variant="outlined"
              value={filtro}
              onChange={handleSearch}
              sx={{ marginBottom: 2 }}
            />
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
              Nova Verificação
            </Button>
          </Grid2>
          <Box marginBottom={3} />
          {/* Tabela de Viaturas */}
          {loading ? ( <CircularProgress alignItems="center" justifyContent="center" /> ) : (
          <Grid2 item xs={12}>
          <Box marginBottom={2} />
            <Card>
              <Typography variant="h6" sx={{ padding: 2, backgroundColor: 'primary.main', color: 'white' }}>Checklist de Verificação</Typography>
              <TableContainer component={Paper}>
                <Table aria-label="Checklist de Verificação">
                  <TableHead>
                    <TableRow>
                      <TableCell>Data</TableCell>
                      <TableCell>Matrícula</TableCell>
                      <TableCell>Tipo de Manutenção</TableCell>
                      <TableCell>Quilometragem</TableCell>
                      <TableCell>Itens Verificados</TableCell>
                      <TableCell>Observação</TableCell>
                      <TableCell>Técnico Responsável</TableCell>
                      <TableCell align="center">Ação</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {checkViaturaFiltradas?.length > 0 ? (checkViaturaFiltradas.map((checklist) => {
                    const apenasData = new Date(checklist.dataCheckList).toISOString().split("T")[0];
                      return (
                        <TableRow key={checklist.id}>
                          <TableCell>{apenasData}</TableCell>
                          <TableCell>{checklist.viatura.viaturaMatricula}</TableCell>
                          <TableCell>{checklist.tipoManutencao.tipoManutencao}</TableCell>
                          <TableCell>{checklist.quilometragem} KM</TableCell>
                          <TableCell>{checklist.itemsVerificados}</TableCell>
                          <TableCell>{checklist.observacao}</TableCell>
                          <TableCell>{checklist.tecnicoResponsavel}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="Excluir" onClick={() =>handleDelete(checklist)}>
                              <IconButton color="secondary">
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })
                    ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">Nenhuma verificação encontrado.</TableCell>
                    </TableRow>
                  )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid2>
          )} {/*Fim do loading*/ }
        {/**/}
        {/* Modal de Adicionar Nova Viatura */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{isEdit===true ? 'Editar Verificação' : 'Nova Verificação' }</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 1 }}>
              <InputLabel id="role-select-label">Tipo</InputLabel>
              <Select
                labelId="role-select-label"
                name="tipoManutencaoId"
                value={novoCheckViatura.tipoManutencaoId}
                label="Tipo de manutenção"
                onChange={handleChange}
              >
                {tipoManutencao.map((tipo) => (
                  <MenuItem value={tipo.id}>
                    {tipo.tipoManutencao}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 1 }}>
              <InputLabel id="role-select-label">Viatura</InputLabel>
              <Select
                labelId="role-select-label"
                name="viaturaId"
                value={novoCheckViatura.viaturaId}
                label="Viatura"
                onChange={handleChange}
              >
                {viaturas.map((viatura) => (
                  <MenuItem value={viatura.viaturaId}>
                    {viatura.viaturaMarca+" - "+viatura.viaturaMatricula}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              autoFocus
              margin="dense"
              label="Quilometragem"
              name="quilometragem"
              type="number"
              fullWidth
              value={novoCheckViatura.quilometragem}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Itens Verificados"
              name="itemsVerificados"
              type="text"
              fullWidth
              value={novoCheckViatura.itemsVerificados}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Observação"
              name="observacao"
              type="text"
              fullWidth
              value={novoCheckViatura.observacao}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Técnico Responsável"
              name="tecnicoResponsavel"
              type="text"
              fullWidth
              value={novoCheckViatura.tecnicoResponsavel}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">Cancelar</Button>
            <Button onClick={handleSave} color="primary">{isEdit===true ? 'Salvar Alterações' : 'Adicionar' }</Button>
          </DialogActions>
        </Dialog>
        </Box>
      </Box>
    </>
  )
}

export default CheckViatura;