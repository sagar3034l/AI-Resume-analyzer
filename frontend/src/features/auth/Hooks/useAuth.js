import { useContext, useEffect } from "react";
import { AuthContext } from '../auth.context'
import { login, logout, getMe, register } from '../services/auth.api'
import { createContext } from "react";


export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login({ email, password });
            setUser(data.user);
            return data.user
        } catch (error) {
            console.error(error)
        }finally{
            setLoading(false);
        }
    }
    const handleRegister = async ({ name, email, password }) => {
        setLoading(true);
        try {
            const data = await register({ name, email, password });
            console.log(data)
            setUser(data.user)
            return data.user;
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    const handleLogout = async () => {
        setLoading(true);
        const data = await logout();
        setUser(null)
        setLoading(false)
    }

    useEffect(()=>{
        const getAndSetUser = async()=> {
            try {
                const data = await getMe();
                setUser(data.user);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        getAndSetUser();
    },[])

    return { user, loading, handleRegister, handleLogin, handleLogout }
}

