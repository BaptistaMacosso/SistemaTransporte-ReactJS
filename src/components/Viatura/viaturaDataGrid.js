import React from "react";
import { Card,Typography,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,IconButton,
    Tooltip,Grid2,Box
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, AirlineStops } from '@mui/icons-material';

const ViaturaDatagrid = ({
    viaturasFiltradas,
    handleOpen,
    excluirViatura
}) => {
    <Grid2 item xs={12}>
    <Box marginBottom={2}/>
    <Card>
        <Typography variant="h6" sx={{ padding: 2, backgroundColor: 'primary.main', color: 'white' }}>Lista de Viaturas</Typography>
        <TableContainer component={Paper}>
        <Table aria-label="tabela de viaturas">
            <TableHead>
            <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Marca</TableCell>
                <TableCell>Modelo</TableCell>
                <TableCell>Matrícula</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Combustível</TableCell>
                <TableCell align="center">Ações</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {viaturasFiltradas?.length > 0 ? (
            viaturasFiltradas.map((viatura) => {
                return (
                <TableRow key={viatura.viaturaId}>
                    <TableCell>{viatura.viaturaId}</TableCell>
                    <TableCell>{viatura.viaturaMarca}</TableCell>
                    <TableCell>{viatura.viaturaModelo}</TableCell>
                    <TableCell>{viatura.viaturaMatricula}</TableCell>
                    <TableCell>{viatura.viaturaCategoria.viaturaCategoria}</TableCell>
                    <TableCell>{viatura.viaturaCombustivel}</TableCell>
                    <TableCell align="center">
                    <Tooltip title="Editar">
                        <IconButton color="primary" onClick={() => handleOpen(viatura)}>
                        <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Atribuir Viatura">
                        <IconButton color="sucess" onClick={() => handleOpen(viatura)}>
                        <AirlineStops />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                        <IconButton color="secondary" onClick={() => excluirViatura(viatura)}>
                        <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    </TableCell>
                </TableRow>
                );
            })
            ) : (
                <TableRow>
                <TableCell colSpan={6} align="center">Nenhuma viatura encontrada.</TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </TableContainer>
    </Card>
    </Grid2>
};

export default ViaturaDatagrid;