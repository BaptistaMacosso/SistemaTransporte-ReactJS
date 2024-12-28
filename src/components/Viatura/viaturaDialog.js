import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid2
} from "@mui/material";

const ViaturaDialog = ({
  open,
  handleClose,
  handleSave,
  isEdit,
  novaViatura,
  handleChange,
  tipoViatura,
  viaturaCategoria
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{isEdit ? "Editar Viatura" : "Nova Viatura"}</DialogTitle>
      <DialogContent>
        <Box sx={{ maxWidth: 800, margin: "auto", padding: 3 }}>
          <Grid2 container spacing={2}>
            <Grid2 item xs={8}>
              <TextField
                autoFocus
                margin="dense"
                label="Marca"
                name="viaturaMarca"
                type="text"
                fullWidth
                value={novaViatura.viaturaMarca}
                onChange={handleChange}
              />
            </Grid2>
            <Grid2 item xs={4}>
              <TextField
                margin="dense"
                label="Modelo"
                name="viaturaModelo"
                type="text"
                fullWidth
                value={novaViatura.viaturaModelo}
                onChange={handleChange}
              />
            </Grid2>
            <Grid2 item xs={8}>
              <TextField
                margin="dense"
                label="Matrícula"
                name="viaturaMatricula"
                type="text"
                fullWidth
                value={novaViatura.viaturaMatricula}
                onChange={handleChange}
              />
            </Grid2>
            <Grid2 item xs={4}>
              <TextField
                margin="dense"
                label="Ano de Fabrico"
                name="viaturaAnoFabrica"
                type="number"
                fullWidth
                value={novaViatura.viaturaAnoFabrica}
                onChange={handleChange}
              />
            </Grid2>
            <Grid2 item xs={8}>
              <TextField
                margin="dense"
                label="Combustível"
                name="viaturaCombustivel"
                type="text"
                fullWidth
                value={novaViatura.viaturaCombustivel}
                onChange={handleChange}
              />
            </Grid2>
            <Grid2 item xs={4}>
              <TextField
                margin="dense"
                label="Viatura Cor"
                name="viaturaCor"
                type="text"
                fullWidth
                value={novaViatura.viaturaCor}
                onChange={handleChange}
              />
            </Grid2>
            <Grid2 item xs={4}>
              <TextField
                margin="dense"
                label="Quilometragem"
                name="quilometragem"
                type="number"
                fullWidth
                value={novaViatura.quilometragem}
                onChange={handleChange}
              />
            </Grid2>
            <Grid2 item xs={4}>
              <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 1 }}>
                <InputLabel id="tipo-select-label">Tipo</InputLabel>
                <Select
                  labelId="tipo-select-label"
                  name="viaturaTipoId"
                  value={novaViatura.viaturaTipoId}
                  label="Tipo de Viatura"
                  onChange={handleChange}
                >
                  {tipoViatura.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.id}>
                      {tipo.viaturaTipo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 item xs={4}>
              <FormControl fullWidth sx={{ marginBottom: 2, marginTop: 1 }}>
                <InputLabel id="categoria-select-label">Categoria</InputLabel>
                <Select
                  labelId="categoria-select-label"
                  name="viaturaCategoriaId"
                  value={novaViatura.viaturaCategoriaId}
                  label="Categoria"
                  onChange={handleChange}
                >
                  {viaturaCategoria.map((categoria) => (
                    <MenuItem key={categoria.id} value={categoria.id}>
                      {categoria.viaturaCategoria}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid2>
          </Grid2>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary">
          {isEdit ? "Salvar Alterações" : "Adicionar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViaturaDialog;