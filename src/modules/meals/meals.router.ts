import { Router } from "express";
import { browseMealsController, getMealDetailsController, getProviderWithMenuController, listProvidersController } from "./meals.controller";

const router = Router();

router.get("/meals", browseMealsController);
router.get("/meals/:id", getMealDetailsController);




export const mealRoutes= router;
