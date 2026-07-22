import { api } from "../lib/api";
import { authClient } from "../lib/auth";
import type { TrainingPlan, User, UserProfile } from "../types";
import { useContext, createContext, useState, useEffect, useRef, useCallback } from "react";

interface AuthContextType {
    user: User,
    loading: boolean,
    saveProfile: (
        profile: Omit<UserProfile, 'userId' | 'updatedAt'>
    ) => Promise<void>,
    generatePlan: () => Promise<void>;
    refreshData: () => Promise<void>;
    plan: TrainingPlan | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthContextProvider({ children }: { children: React.ReactNode }) {
    const [neonUser, setNeonUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [plan, setPlan] = useState<TrainingPlan | null>(null);
    const isRefreshingRef = useRef(false);

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

    useEffect(() => {
        if (!loading) {
            if (neonUser?.id) {
                refreshData();
            } else {
                setPlan(null);
            }
            setLoading(false);
        }
    }, [neonUser?.id, loading]);


    const refreshData = useCallback(async () => {
        if (!neonUser || isRefreshingRef.current) return;

        isRefreshingRef.current = true;

        try {
            const planData = await api.getCurrentPlan(neonUser.id).catch(() => null);
            if (planData) {
                setPlan({
                    id: planData.id,
                    userId: planData.userId,
                    overview: planData.planJson.overview,
                    weeklySchedule: planData.planJson.weeklySchedule,
                    progression: planData.planJson.progression,
                    version: planData.version,
                    createdAt: planData.createdAt,
                });
            }
        } catch (error) {
            console.error("Error refreshing data:", error);
        } finally {
            isRefreshingRef.current = false;
        }
    }, [neonUser?.id]);



    const saveProfile = async (
        profileData: Omit<UserProfile, 'userId' | 'updatedAt'>
    ) => {
        if (!neonUser) {
            throw new Error("User must be authenticated to save profile")
        }

        await api.saveProfile(neonUser.id, profileData);
        await refreshData();
    }

    const generatePlan = async () => {
        if (!neonUser) {
            throw new Error("User must be authenticated to generate the plan")
        }

        await api.generatePlan(neonUser.id);
        await refreshData();
    }

    return (
        <AuthContext.Provider value={{
            user: neonUser as User, loading: loading, saveProfile, generatePlan, refreshData, plan: plan
        }}>
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
