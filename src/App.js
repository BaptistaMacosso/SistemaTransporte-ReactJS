import React from 'react';
import GlobalStyle from './styles/global';
import RoutesApp from './routes';
import { AuthProvider } from './contexts/auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <AuthProvider>{/* Passando este AuthProvider aqui permite que sejá acessado por toda aplicação*/}
      <RoutesApp />
      <GlobalStyle />
      <ToastContainer autoClose={3000} position="bottom-right" />
    </AuthProvider>
  )
}

export default App