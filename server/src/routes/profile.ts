import express, { type Request, type Response } from 'express'
import { prisma } from '../lib/prisma';
import { profile } from 'node:console';

export const profileRouter = express.Router();

profileRouter.post("/", async (req: Request, res: Response) => {
    try {
        const { userId, profileData } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "Unauthorized User" })
        }

        const {
            goal,
            levels,
            age,
            height,
            weight,
            daysPerWeek,
            sessionLength,
            splits,
            enviornment
        } = profileData;

        if (!goal ||
            !levels ||
            !age ||
            !height ||
            !weight ||
            !daysPerWeek ||
            !sessionLength ||
            !splits ||
            !enviornment
        ) return res.status(400).json({ message: "Missing fields" })


        console.log(goal)

        await prisma.user_profiles.upsert({
            where: { user_id: userId },
            update: {
                goal,
                level: levels,
                age,
                height,
                weight,
                day_per_week: daysPerWeek,
                session_length: sessionLength,
                splits: splits,
                enviornment: enviornment,
                updated_at: new Date()
            },
            create: {
                user_id: userId,
                goal,
                level: levels,
                age,
                height,
                weight,
                day_per_week: daysPerWeek,
                session_length: sessionLength,
                splits: splits,
                enviornment: enviornment,
                updated_at: new Date()
            }
        })
    } catch (error) {
        console.log("Error in saving the profileData in the db", error.message);
        res.status(500).json({ error: "Failed to save profile" });
    }
})
