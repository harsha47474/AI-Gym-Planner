import type { UserProfile, PlanListItem } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function post(path: string, body: object) {
    const res = await fetch(`${BASE_URL}/api/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok)
        throw new Error(
            (await res.json().catch(() => ({}))) || "Request failed"
        );

    return res.json();
}

async function get(path: string) {
    const res = await fetch(`${BASE_URL}/api/${path}`);

    if (!res.ok) {
        throw new Error(
            (await res.json().catch(() => ({}))) || "Request failed"
        );
    }

    return res.json();
}

async function del(path: string) {
    const res = await fetch(`${BASE_URL}/api/${path}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
        throw new Error(
            (await res.json().catch(() => ({}))) || "Request failed"
        );
    }

    return res.json();
}

export const api = {
    saveProfile: (
        userId: string,
        profileData: Omit<UserProfile, 'userId' | 'updatedAt'>,
    ) => {
        return post("profile", { userId, profileData });
    },

    generatePlan: (
        userId: string
    ) => {
        return post("plan/generate", { userId });
    },

    getCurrentPlan: (userId: string) => {
        return get(`plan/current?userId=${userId}`);
    },

    getAllPlans: (userId: string): Promise<PlanListItem[]> => {
        return get(`plan/all?userId=${userId}`).catch(() => []);
    },

    deletePlan: (planId: string) => {
        return del(`plan/${planId}`).catch(() => null);
    },

    restorePlan: (planId: string, userId: string) => {
        return post("plan/restore", { planId, userId }).catch(() => null);
    },

    saveWorkoutSession: (data: {
        userId: string;
        day: string;
        focus: string;
        completedExercises: string[];
        totalExercises: number;
        durationMinutes: number;
    }) => {
        return post("workout/session", data).catch(() => null);
    },
};