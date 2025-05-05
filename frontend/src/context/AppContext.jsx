import { useContext, createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { matches, teams } from '../assets/assets.js';

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  // Initialize user from localStorage
  const [user, setUser] = useState(() => {
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');
    console.log('Initial state check - Username:', storedUsername, 'Role:', storedRole);
    return storedUsername && storedRole ? { username: storedUsername, role: storedRole } : null;
  });

  // Initialize token from localStorage
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [leagueTeams, setLeagueTeams] = useState([]);
  const [leagueMatches, setLeagueMatches] = useState([]);

  const fetchTeams = async () => {
    setLeagueTeams(teams);
  };

  const fetchMatches = async () => {
    setLeagueMatches(matches);
  };

  // Login function to set user and token
  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUser.username);
    localStorage.setItem('role', newUser.role);
    console.log('Logged in - Token:', newToken, 'User:', newUser);
  };

  // Logout function to clear states and localStorage
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/signin');
    console.log('Logged out');
  };

  useEffect(() => {
    console.log('AppContext useEffect triggered');
    fetchTeams();
    fetchMatches();
  }, []);

  useEffect(() => {
    setIsAdmin(user?.role === 'admin');
    console.log('User updated, isAdmin:', user?.role === 'admin');
  }, [user]);

  const value = {
    navigate,
    user,
    token,
    login,
    logout,
    isAdmin,
    setIsAdmin,
    showUserLogin,
    setShowUserLogin,
    leagueTeams,
    leagueMatches,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppContextProvider, useAppContext };