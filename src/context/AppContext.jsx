import { useContext, createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { matches, teams } from "../assets/assets.js"

const AppContext = createContext();

const AppContextProvider = ({children})=>{
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [leagueTeams, setLeagueTeams] = useState([]); // another way of importing teams for the entire project
    const [leagueMatches, setLeagueMatches] = useState([]);

    const fetchTeams = async ()=>{
        setLeagueTeams(teams)
    }
    const fetchMatches = async ()=>{
        setLeagueMatches(matches)
    }
    useEffect(() => {
        fetchTeams();
        fetchMatches();
    },[]); // fetch teams everytime page gets loaded

    const value = {navigate,
        user, setUser, 
        isAdmin, setIsAdmin, 
        showUserLogin, setShowUserLogin,
        leagueTeams, leagueMatches
    }

    return (
    <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>)
}

const useAppContext = ()=>{
    return useContext(AppContext);
}

export { AppContext, AppContextProvider, useAppContext };