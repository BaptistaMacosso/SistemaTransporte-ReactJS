import {React} from 'react';
import { Card,Typography,Table,TableBody,TableCell,TableContainer,
         TableHead,TableRow,Paper,IconButton,Tooltip,Box,Grid2 
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const ChecklistDatagrid = ({
    checkViaturaFiltradas,
    handleDelete
}) =>{
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
};

export default ChecklistDatagrid;