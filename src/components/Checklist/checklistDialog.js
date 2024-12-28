import {React} from 'react';
import { TextField,Dialog,DialogActions,DialogContent,DialogTitle,Button,
         FormControl,InputLabel,Select,MenuItem } from '@mui/material';

const ChecklistDatagrid = ({
    open,
    handleChange,
    handleClose,
    handleSave,
    isEdit,
    novoCheckViatura,
    tipoManutencao,
    viaturas
}) => {
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
};

export default ChecklistDatagrid;