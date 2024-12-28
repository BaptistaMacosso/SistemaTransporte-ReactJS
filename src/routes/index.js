import {Fragment} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import Home from '../pages/Home';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import Motoristas from '../pages/Motoristas';
import ChecklistViatura from '../pages/ChecklistViatura';
import Publicidade from '../pages/Publicidade';
import Usuarios from '../pages/Usuários';
import Viaturas from '../pages/Viaturas';
import Manutencao from '../pages/Manutencao';

//Elemento que irá verificar se o usuário 
//está logado ou não antes de acessar a pagina home.
const Private = ({Item})=>{
  const { isAuthenticated } = useAuth(); //O useAuth possui todas as informações de autenticação e verificação se está logado ou não.
    return isAuthenticated > 0 ? <Item /> : <Signin />
}

//Criando o meu sistema rotas com o router DOM.
const RoutesApp = () => {
  return (
    <BrowserRouter>
        <Fragment>
            <Routes>
                <Route exact path='/Home' element={<Private Item={Home} />} />
                <Route exact path='/Motoristas' element={<Private Item={Motoristas} />} />
                <Route exact path='/CheckViatura' element={<Private Item={ChecklistViatura} />} />
                <Route exact path='/Publicidade' element={<Private Item={Publicidade} />} />
                <Route exact path='/Usuarios' element={<Private Item={Usuarios} />} />
                <Route exact path='/Viaturas' element={<Private Item={Viaturas} />} />
                <Route exact path='/Manutencao' element={<Private Item={Manutencao} />} />
                <Route path='/' element={<Signin />} />
                <Route path='/Signup' element={<Signup />} />
                <Route path='*' element={<Signin />} />
            </Routes>
        </Fragment>
    </BrowserRouter>
  )
}

export default RoutesApp