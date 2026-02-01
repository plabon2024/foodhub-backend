import { Router } from "express";
import { applyForProviderController, createMealController, deleteMealController, updateMealController, updateOrderStatusController } from "./provider.controller";

const router = Router();

router.post("/meals", createMealController);
router.put("/meals/:id", updateMealController);
router.delete("/meals/:id", deleteMealController);
router.patch("/orders/:id", updateOrderStatusController);


router.post("/apply", applyForProviderController);

export const providerRoutes = router;


