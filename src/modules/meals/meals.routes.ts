import { Router } from "express";
import { browseMealsController, getMealDetailsController, getProviderWithMenuController, getStatsController, listProvidersController } from "./meals.controller";
import { listCategoryController } from "../category/category.controller";


const router = Router();

router.get("/meals", browseMealsController);
router.get("/meals/:id", getMealDetailsController);

router.get("/providers", listProvidersController);
router.get("/providers/:id", getProviderWithMenuController);
router.get("/stats", getStatsController);
router.get("/categories", listCategoryController);

export const mealRoutes = router;
