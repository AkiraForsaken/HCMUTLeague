import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./AppContext.js"

export const AppContextProvider = ({children})=>{
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);

    const value = {navigate,
        user, setUser, 
        isAdmin, setIsAdmin, 
        showUserLogin, setShowUserLogin}

    return (
    <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>)
}

export const useAppContext = ()=>{
    return useContext(AppContext);
}