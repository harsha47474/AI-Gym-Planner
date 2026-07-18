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