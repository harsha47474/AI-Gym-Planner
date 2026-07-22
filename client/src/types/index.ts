export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: string;
}

export interface UserProfile {
    userId: string,
    goal: "muscle" | "strength" | "fat" | "endurance"
    levels: "Beginner" | "Intermediate" | "Advanced"
    age: number
    height: number
    weight: number
    daysPerWeek: number
    sessionLength: number
    splits: "Full Body" | "Upper/Lower" | "Push/Pull/Legs" | "Bro Split"
    enviornment: "Commercial Gym" | "Home Gym" | "Bodyweight Only"
    updatedAt: string
}

export interface TrainingPlan {
    id: string;
    userId: string;
    overview: PlanOverview;
    weeklySchedule: DaySchedule[];
    progression: string;
    version: number;
    createdAt: string;
}

export interface PlanOverview {
    goal: string;
    frequency: string;
    split: string;
    notes: string;
}

export interface DaySchedule {
    day: string;
    focus: string;
    exercises: Exercise[];
}

export interface Exercise {
    name: string;
    sets: number;
    reps: string;
    rest: string;
    rpe: number;
    notes?: string;
    alternatives?: string[];
}

export interface PlanListItem {
    id: string;
    userId: string;
    planJson: {
        overview: PlanOverview;
        weeklySchedule: DaySchedule[];
        progression: string;
    };
    planText: string;
    version: number;
    createdAt: string;
}

export interface WorkoutSession {
    id: string;
    day: string;
    focus: string;
    completedExercises: string[];
    totalExercises: number;
    completedAt: string;
    durationMinutes: number;
}

export interface WorkoutHistory {
    sessions: WorkoutSession[];
}

export interface UserSettings {
    units: "kg" | "lbs";
    remindersEnabled: boolean;
    reminderTime: string;
    regenerateNotes: string;
}

export type QuickStat = {
    label: string;
    value: string | number;
    icon: string;
    subtext?: string;
};