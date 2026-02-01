import { Router } from "express";
import { approveProviderApplicationController, getAllUsersController, updateUserStatusController } from "./admin.controller";
import { applyForProviderController } from "../provider/provider.controller";
import { createCategoryController, deleteCategoryController, listCategoryController, updateCategoryController } from "../category/category.controller";


const router = Router();

router.get("/users", getAllUsersController);
router.patch("/users/:id", updateUserStatusController);

// NEW
router.post(
  "/provider-applications/:applicationId/approve",
  approveProviderApplicationController
);

// extra for  managing provider and categories 
router.post("/apply", applyForProviderController);
router.post("/categories", createCategoryController);
router.get("/categories", listCategoryController);
router.put("/categories/:id", updateCategoryController);
router.delete("/categories/:id", deleteCategoryController);




export const adminRoutes = router;
