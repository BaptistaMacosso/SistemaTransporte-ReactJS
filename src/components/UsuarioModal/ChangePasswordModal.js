import React, { useState } from "react";
import {
  Button,
  Modal,
  TextField,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ChangePasswordModal = () => {
  const [open, setOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError("");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As novas senhas não coincidem.");
      return;
    }

    // Simulação de envio para API
    console.log("Senha antiga:", oldPassword);
    console.log("Nova senha:", newPassword);
    setError("");
    handleClose();
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Alterar Senha
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">Alterar Senha</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            label="Senha Antiga"
            type="password"
            fullWidth
            margin="normal"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <TextField
            label="Nova Senha"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <TextField
            label="Confirmar Nova Senha"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSubmit}
          >
            Confirmar Alteração
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ChangePasswordModal;
