import React, { useState } from 'react';
import { Container, Content, Label, LabelSignup, LabelError } from './styles';
import { useAuth } from '../../contexts/auth';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!email && !password) {
        setError("Preencha todos os campos");
        return;
      }else{
          const response = await axios.post('sistema-transporte-backend.vercel.app/api/auth/login', 
            {
              userEmail: email,
              userPassword: password
            });
          if(response.status === 201) {
              login(response.data.token);
              navigate('/Home');
          }
      }
      
    } catch (err) {
      setError('Falha na autenticação. Verifique suas credenciais.'+err);
    }
  };

  return (
    <Container>
      <Content>
        <Label>Autenticação</Label>
        <Input 
            type="email" 
            placeholder="Digite o e-mail..." 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <Input 
            type="password" 
            placeholder="Digite a senha..." 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <LabelError>{error}</LabelError>
        <Button text="Entrar" onClick={handleSubmit}/>
        <LabelSignup>
          Não possui uma conta? &nbsp;Contacte o administrador do sistema.
        </LabelSignup>
        </Content>
    </Container>
  );
}

export default Signin;