import { Request, Response } from "express";
import { mealService } from "./meals.service";

const createPost = async (req: Request, res: Response) => {
    try {
        const result = await mealService.createMeal(req.body)
        res.status(201).json(result)
    } catch (error) {
        res.status(400).json({
            error: "Meal cration faild",
            details: error

        })
    }
}
export const postController = {
    createPost
}
