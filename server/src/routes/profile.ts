import express, { type Request, type Response } from 'express'

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

    } catch (error) {
        console.log("Error in saving the profileData in the db", error.message);
        res.status(500).json({ error: "Failed to save profile" });
    }
})
