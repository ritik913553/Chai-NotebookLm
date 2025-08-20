import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const loginUser = (user) => {
        console.log(user);
        setUser(user);
    };

    const logoutUser = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, isLoggedIn: !!user, loginUser, logoutUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
