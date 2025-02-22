import {Fragment} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import Home from '../pages/Home';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import Motoristas from '../pages/Motoristas';
import ChecklistViatura from '../pages/ChecklistViatura';
import Oficinas from '../pages/Oficinas';
import Usuarios from '../pages/Usuários';
import Viaturas from '../pages/Viaturas';
import Manutencao from '../pages/Manutencao';
import DetalhesManutencao from '../pages/Manutencao/DetalhesManutencao';
import LicencaPublicidade from '../pages/LicencaPublicidade';
import LicencaTransporte from '../pages/LicencaTransporte';
import PedidoAsistenciaTecnica from '../pages/PedidoAsistenciaTecnica';
import DetalhesPedidoAsistenciaTecnica from '../pages/PedidoAsistenciaTecnica/DetalhesPedidoAsistenciaTecnica';
import DetalhePerfilUsuario from '../pages/Usuários/PerfilUsuario';
import AlterarPasswordUsuario from '../pages/Usuários/alterarPasswordUsuario';
import CadastroMotorista from '../pages/Motoristas/cadastroMotorista';

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
                <Route exact path='/NovoMotorista' element={<Private Item={CadastroMotorista} />} />
                <Route exact path='/CheckViatura' element={<Private Item={ChecklistViatura} />} />
                <Route exact path='/LicencaPublicidade' element={<Private Item={LicencaPublicidade} />} />
                <Route exact path='/LicencaTransporte' element={<Private Item={LicencaTransporte} />} />
                <Route exact path='/Oficinas' element={<Private Item={Oficinas} />} />
                <Route exact path='/Usuarios' element={<Private Item={Usuarios} />} />
                <Route exact path='/DetalhePerfilUsuario/:id' element={<Private Item={DetalhePerfilUsuario} />} />
                <Route exact path='/AlterarPasswordUsuario/:id' element={<Private Item={AlterarPasswordUsuario} />} />
                <Route exact path='/Viaturas' element={<Private Item={Viaturas} />} />
                <Route exact path='/Manutencao' element={<Private Item={Manutencao} />} />
                <Route exact path='/DetalhesManutencao/:id' element={<Private Item={DetalhesManutencao} />} />
                <Route exact path='/PedidoAsistenciaTecnica' element={<Private Item={PedidoAsistenciaTecnica} />} />
                <Route exact path='/DetalhesPedidoAsistenciaTecnica/:id' element={<Private Item={DetalhesPedidoAsistenciaTecnica} />} />
                <Route path='/' element={<Signin />} />
                <Route path='/Signup' element={<Signup />} />
                <Route path='*' element={<Signin />} />
            </Routes>
        </Fragment>
    </BrowserRouter>
  )
}

export default RoutesApp