import express, { type Request, type Response } from 'express'
import { prisma } from '../lib/prisma';
import { v4 as uuid } from 'uuid';
import { generateTrainingPlan } from '../lib/ai';

export const planRouter = express.Router();

planRouter.post("/generate", async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User id is required" });
        }

        const profile = await prisma.user_profiles.findUnique({
            where: { user_id: userId }
        });

        if (!profile) {
            return res.status(400).json({ error: "User profile not found" });
        }


        // fetching the pplans

        const latest_plan = await prisma.training_plans.findFirst({
            where: { user_id: userId },
            orderBy: { created_at: "desc" },
            select: { version: true }
        })

        const nextVersion = latest_plan ? latest_plan.version + 1 : 1;

        let planJson;

        try {
            planJson = await generateTrainingPlan(profile);
        } catch (error) {
            console.error("AI generation failed:", error);
            return res.status(500).json({
                error: "Failed to generate training plan. Please try again.",
                details: error instanceof Error ? error.message : "Unknown error",
            });
        }

        const planText = JSON.stringify(planJson, null, 2);

        const newPlan = await prisma.training_plans.create({
            data: {
                id: uuid(),
                user_id: userId,
                plan_json: planJson as any,
                plan_text: planText,
                version: nextVersion,
            },
        })

        return res.json({
            id: newPlan.id,
            version: newPlan.version,
            createdAt: newPlan.created_at,
        })
    } catch (error) {
        console.log("Error generating a plan", error.message);
        return res.status(500).json({ error: "Failed to generate the plan" });
    }
})

planRouter.get("/current", async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;

        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ error: "User id is required" });
        }

        const plan = await prisma.training_plans.findFirst({
            where: { user_id: userId },
            orderBy: { created_at: "desc" }
        })

        if (!plan) {
            return res.status(400).json({ error: "Cannot find the plan" })
        }

        return res.json({
            id: plan.id,
            userId: plan.user_id,
            planJson: plan.plan_json,
            planText: plan.plan_text,
            version: plan.version,
            createdAt: plan.created_at,
        });
    } catch (error) {
        console.error("Error fetching plan:", error);
        res.status(500).json({ error: "Failed to fetch plan" });
    }
})