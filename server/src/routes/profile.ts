import express, { type Request, type Response } from 'express'
import { prisma } from '../lib/prisma';

export const profileRouter = express.Router();

profileRouter.post("/", async (req: Request, res: Response) => {
    try {
        const { userId, profileData } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "Unauthorized User" })
        }

        const {
            goal,
            level,
            age,
            height,
            weight,
            selectedDays,
            selectedTime,
            preferredSplits,
            enviornmentOptions
        } = profileData;

        if (!goal ||
            !level ||
            !age ||
            !height ||
            !weight ||
            !selectedDays ||
            !selectedTime ||
            !preferredSplits ||
            !enviornmentOptions
        ) return res.status(400).json({ message: "Missing fields" })

        await prisma.user_profiles.upsert({
            where: { user_id: userId },
            update: {
                goal,
                level,
                age,
                height,
                weight,
                day_per_week: selectedDays,
                session_length: selectedTime,
                splits: preferredSplits,
                enviornment: enviornmentOptions,
                updated_at: new Date()
            },
            create: {
                user_id: userId,
                goal,
                level,
                age,
                height,
                weight,
                day_per_week: selectedDays,
                session_length: selectedTime,
                splits: preferredSplits,
                enviornment: enviornmentOptions,
                updated_at: new Date()
            }
        })
    } catch (error) {
        console.log("Error in saving the profileData in the db", error.message);
        res.status(500).json({ error: "Failed to save profile" });
    }
})
