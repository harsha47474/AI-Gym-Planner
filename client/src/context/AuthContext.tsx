import { authClient } from "../lib/auth";
import type { User } from "../types";
import { useContext, createContext, useState, useEffect } from "react";

interface AuthContextType {
    user: User,
    loading: boolean,
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthContextProvider({ children }: { children: React.ReactNode }) {
    const [neonUser, setNeonUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchUser() {
            setLoading(true);
            try {
                const response = await authClient.getSession();
                console.log("User session:", response);
                if (response && response.data?.user) {
                    setNeonUser(response.data.user);
                } else {
                    setNeonUser(null);
                }
            } catch (err) {
                setNeonUser(null);
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, [])


    return (
        <AuthContext.Provider value={{ user: neonUser as User, loading: loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthContextProvider");
    }

    return context;
}
