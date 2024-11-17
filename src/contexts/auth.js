import React, { createContext, useContext, useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Função para verificar o token e definir o estado
  const checkToken = () => {
    const savedToken = localStorage.getItem('token');
    if (savedToken && !isTokenExpired(savedToken)) {
      const decodedToken = jwtDecode(savedToken);
      setToken(savedToken);
      setUserInfo(decodedToken); // Define as informações do usuário a partir do token
      setIsAuthenticated(true);
    } else {
      logout(); // Remove o token se estiver expirado ou ausente
    }
  };

  // Função de login para configurar o token e as informações do usuário
  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    const decodedToken = jwtDecode(newToken);
    setToken(newToken);
    setUserInfo(decodedToken);
    setIsAuthenticated(true);
  };

   // Função para verificar o tempo de expiração do token
   const isTokenExpired = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Em segundos
      return decodedToken.exp < currentTime; // Verifica se já passou da expiração
    } catch (error) {
      return true; // Retorna como expirado se houver erro na decodificação
    }
  };

  // useEffect para verificar o token ao carregar o aplicativo
  useEffect(() => {
    checkToken();
  }, []);

  // Função de logout para limpar o estado e remover o token
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUserInfo(null);
    setIsAuthenticated(false);
  };

  const getToken =() =>{
    return localStorage.getItem('token');
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout, getToken,checkToken, userInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
};



