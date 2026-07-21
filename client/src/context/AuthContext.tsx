import { api } from "../lib/api";
import { authClient } from "../lib/auth";
import type { User, UserProfile } from "../types";
import { useContext, createContext, useState, useEffect } from "react";

interface AuthContextType {
    user: User,
    loading: boolean,
    saveProfile: (
        profile: Omit<UserProfile, 'userId' | 'updatedAt'>
    ) => Promise<void>,
    generatePlan: () => Promise<void>;
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

    const saveProfile = async (
        profileData: Omit<UserProfile, 'userId' | 'updatedAt'>
    ) => {
        if (!neonUser) {
            throw new Error("User must be authenticated to save profile")
        }

        await api.saveProfile(neonUser.id, profileData);
    }

    const generatePlan = async () => {
        if (!neonUser) {
            throw new Error("User must be authenticated to generate the plan")
        }

        await api.generatePlan(neonUser.id);
    }


    return (
        <AuthContext.Provider value={{ user: neonUser as User, loading: loading, saveProfile, generatePlan }}>
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
