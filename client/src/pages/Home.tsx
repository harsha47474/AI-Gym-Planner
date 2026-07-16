import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
    const { user, loading } = useAuth();

    if(user && !loading) {
        return <Navigate to="/profile" replace />;
    }
    
    return (
        <>Home page</>
    )
}