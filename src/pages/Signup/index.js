import React, { useState } from 'react';
import {Container, Content, Label, LabelSignup, LabelError, Strong} from './styles';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';


const Signup = () => {
  const {Signup} = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailConfig, setEmailConfig] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = () =>{
    if (!email && !emailConfig && !password) {
      setError("Preencha todos os campos");
      return;
    }else if(email !== emailConfig){
      setError("Os e-mails não conferem");
      return;
    }

    const res = Signup(email, password);
    if(res) {
      setError(res);
      return;
    }
    navigate("/");
  };

  return (
    <Container>
      <Label>Cadastro de Usuários</Label>
      <Content>
        <Input 
            type="email" 
            placeholder="Digite o e-mail..." 
            value={email}
            onChange={(e) => [setEmail(e.target.value), setError("")]}
        />
        <Input 
            type="email" 
            placeholder="Confirme o e-mail..." 
            value={emailConfig}
            onChange={(e) => [setEmailConfig(e.target.value), setError("")]}
        />
        <Input 
            type="password" 
            placeholder="Digite a senha..." 
            value={password}
            onChange={(e) => [setPassword(e.target.value), setError("")]}
        />
        <LabelError>{error}</LabelError>
        <Button text="Cadastrar" onClick={handleSignup}/>
        <LabelSignup>
          Se já possui uma conta? &nbsp;<Strong><Link to="/">Faça login</Link></Strong>
        </LabelSignup>
      </Content>
    </Container>
  )
}

export default Signup;