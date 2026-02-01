import { Router } from "express";
import { createCategoryController, deleteCategoryController, listCategoryController, updateCategoryController } from "./category.controller";
import { applyForProviderController, createMealController, deleteMealController, updateMealController, updateOrderStatusController } from "./provider.controller";

const router = Router();

router.post("/meals", createMealController);
router.put("/meals/:id", updateMealController);
router.delete("/meals/:id", deleteMealController);
router.patch("/orders/:id", updateOrderStatusController);


// extra for  managing provider and categories 
router.post("/apply", applyForProviderController);
router.post("/categories", createCategoryController);
router.get("/categories", listCategoryController);
router.put("/categories/:id", updateCategoryController);
router.delete("/categories/:id", deleteCategoryController);

export const providerRoutes = router;


