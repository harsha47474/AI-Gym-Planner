export interface UserProfile {
    goal: "muscle" | "strength" | "fat" | "endurance"
    levels: "Beginner" | "Intermediate" | "Advanced"
    age: number
    height: number
    weight: number
    daysPerWeek: number
    sessionLength: number
    splits: "Full_Body" | "Upper_Lower" | "Push_Pull_Legs" | "Bro_Split"
    enviornment: "Commercial_Gym" | "Home_Gym" | "Bodyweight_Only"
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