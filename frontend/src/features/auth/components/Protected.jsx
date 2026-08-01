import { useAuth } from "../Hooks/useAuth";
import { Navigate } from "react-router";
import { getMe } from "../services/auth.api";

const Protected = ({children}) => {
    const {loading, user} = useAuth();
    if(loading){
        return (
            <main>
                Loading...
            </main>
        )
    }  
    if(!user){
        return <Navigate to={"/login"} />
    }
    return children;
}  

export default Protected;
