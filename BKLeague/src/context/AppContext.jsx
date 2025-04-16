import { useContext, createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { matches, teams } from '../assets/assets.js';

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');
    console.log('Initial state check - Token:', token, 'Role:', role, 'Username:', username);
    return token && role && username ? { username, role } : null;
  });
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

  const restoreUser = async () => {
    const token = localStorage.getItem('token');
    console.log('Restoring user - Token exists:', !!token);
    if (!token) {
      console.log('No token found, user remains null');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('Profile fetch status:', res.status);

      const result = await res.json();
      console.log('Profile fetch result:', result);

      if (result.success) {
        const restoredUser = { username: result.data.username, role: result.data.role };
        setUser(restoredUser);
        localStorage.setItem('username', result.data.username);
        localStorage.setItem('role', result.data.role);
        console.log('User restored successfully:', restoredUser);
      } else {
        console.log('Profile fetch failed:', result.error);
        if (res.status === 401) { // Token explicitly invalid or expired
          setUser(null);
          localStorage.clear();
          navigate('/signin');
          console.log('Token invalid, logged out');
        }
      }
    } catch (err) {
      console.error('Error during restoreUser:', err.message);
      // Don’t clear user state on network errors, only on explicit auth failure
    }
  };

  useEffect(() => {
    console.log('AppContext useEffect triggered');
    fetchTeams();
    fetchMatches();
    restoreUser();
  }, []);

  useEffect(() => {
    setIsAdmin(user?.role === 'admin');
    console.log('User updated, isAdmin:', user?.role === 'admin');
  }, [user]);

  const value = {
    navigate,
    user,
    setUser,
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