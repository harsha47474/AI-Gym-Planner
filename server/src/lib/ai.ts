import OpenAI from "openai";
import dotenv from 'dotenv';
import { TrainingPlan, UserProfile } from "../types/types";

dotenv.config();

export async function generateTrainingPlan(
    profile: UserProfile | Record<string, any>,
): Promise<Omit<TrainingPlan, "id" | "userId" | "version" | "createdAt">> {

    const normalizedProfile: UserProfile = {
        goal: profile.goal || "muscle",
        levels: profile.levels || "Intermediate",
        splits: profile.splits || "Full Body",
        enviornment: profile.enviornment || "Commercial Gym",
        sessionLength: profile.sessionLength || 30,
        age: profile.age || 18,
        weight: profile.weight || 65,
        height: profile.height || 172,
        daysPerWeek: profile.daysPerWeek || 3
    }

    const apiKey = process.env.OPEN_ROUTER_KEY;

    if (!apiKey) {
        throw new Error("Open AI Router key is not set in env variable")
    }

    const openai = new OpenAI({
        apiKey,
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
            "HTTP-Referer": process.env.BASE_URL || "http://localhost:3001",
            "X-Title": "GymAI Plan Generator"
        },
    });

    const prompt = buildPrompt(normalizedProfile);

    try {
        const completion = await openai.chat.completions.create({
            model: "openrouter/free",
            messages: [
                {
                    role: "system",
                    content:
                        "You are an expert fitness trainer and program designer. You must respond with valid JSON only. Do not include any markdown, reasoning, or additional text.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            response_format: { type: "json_object" },
        })

        const content = completion.choices[0].message.content;

        if (!content) {
            console.error(
                "[AI] No content in response:",
                JSON.stringify(completion, null, 2),
            );
            throw new Error("No content in AI response");
        }

        const planData = JSON.parse(content);

        return formatPlanResponse(planData, normalizedProfile);
    } catch (error) {
        console.error("[AI] Error generating training plan:", error);
        throw error;
    }
}




function formatPlanResponse(
    aiResponse: any,
    profile: UserProfile,
): Omit<TrainingPlan, "id" | "userId" | "version" | "createdAt"> {
    const plan: Omit<TrainingPlan, "id" | "userId" | "version" | "createdAt"> = {
        overview: {
            goal: aiResponse.overview?.goal || `Customized ${profile.goal} program`,
            frequency:
                aiResponse.overview?.frequency ||
                `${profile.daysPerWeek} days per week`,
            split: aiResponse.overview?.split || profile.splits,
            notes:
                aiResponse.overview?.notes ||
                "Follow the program consistently for best results.",
        },
        weeklySchedule: (aiResponse.weeklySchedule || []).map((day: any) => ({
            day: day.day || "Day",
            focus: day.focus || "Full Body",
            exercises: (day.exercises || []).map((ex: any) => ({
                name: ex.name || "Exercise",
                sets: ex.sets || 3,
                reps: ex.reps || "8-12",
                rest: ex.rest || "60-90 sec",
                rpe: ex.rpe || 7,
                notes: ex.notes,
                alternatives: ex.alternatives,
            })),
        })),
        progression:
            aiResponse.progression ||
            "Increase weight by 2.5-5lbs when you can complete all sets with good form. Track your progress weekly.",
    };
    return plan;
}



function buildPrompt(profile: UserProfile): string {
    const goalMap: Record<string, string> = {
        muscle: "build muscle and gain size",
        fat: "simultaneously lose fat and build muscle",
        strength: "build maximum strength",
        endurance: "improve cardiovascular endurance and stamina",
    };
    const experienceMap: Record<string, string> = {
        Beginner: "beginner (0-1 years of training experience)",
        Intermediate: "intermediate (1-3 years of training experience)",
        Advanced: "advanced (3+ years of training experience)",
    };
    const enviornmentMap: Record<string, string> = {
        Commerical_Gym: "full gym access with all equipment",
        Home_Gym: "home gym with limited equipment",
        Bodyweight_Only: "only dumbbells available",
    };
    const splitMap: Record<string, string> = {
        Full_Body: "full body workouts",
        Upper_Lower: "upper/lower split",
        Push_Pull_Legs: "push/pull/legs split",
        Bro_Split: "best split for their goals",
    };

    return `Create a personalized ${profile.daysPerWeek}-day per week training plan for someone with the following profile:
  
Goal: ${goalMap[profile.goal] || profile.goal}
Experience Level: ${experienceMap[profile.levels] || profile.levels}
Session Length: ${profile.sessionLength} minutes per session
Equipment: ${enviornmentMap[profile.enviornment] || profile.enviornment}
Preferred Split: ${splitMap[profile.splits] || profile.splits}

Generate a complete training plan in JSON format with this exact structure:
{
  "overview": {
    "goal": "brief description of the training goal",
    "frequency": "X days per week",
    "split": "training split name",
    "notes": "important notes about the program (2-3 sentences)"
  },
  "weeklySchedule": [
    {
      "day": "Monday",
      "focus": "muscle group or focus area",
      "exercises": [
        {
          "name": "Exercise Name",
          "sets": 4,
          "reps": "6-8",
          "rest": "2-3 min",
          "rpe": 8,
          "notes": "form cues or tips (optional)",
          "alternatives": ["Alternative 1", "Alternative 2"]
        }
      ]
    }
  ],
  "progression": "detailed progression strategy (2-3 sentences explaining how to progress)"
}

  Requirements:
  - Create exactly ${profile.daysPerWeek} workout days
  - Each workout should fit within ${profile.sessionLength} minutes
  - Include 4-6 exercises per workout
  - RPE (Rate of Perceived Exertion) should be 6-9
  - Include compound movements for beginners/intermediate, advanced can have more isolation
  - Match the preferred split type: ${profile.splits}
  - Provide exercise alternatives where appropriate
  - Make it progressive and suitable for ${experienceMap[profile.levels] || profile.levels} level
  
  Return ONLY the JSON object (no markdown, no extra text).
  `;
}