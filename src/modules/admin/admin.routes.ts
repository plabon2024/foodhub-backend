import { Router } from "express";
import { createCategoryController, deleteCategoryController, updateCategoryController } from "../category/category.controller";
import { approveProviderApplicationController, getAllProviderApplicationsController, getAllUsersController, updateUserStatusController } from "./admin.controller";


const router = Router();

router.get("/users", getAllUsersController);
router.patch("/users/:id", updateUserStatusController);

// extra for  managing provider and categories 
router.post(
  "/provider-applications/:applicationId/approve",
  approveProviderApplicationController
);
router.get("/provider-applications", getAllProviderApplicationsController);


router.post("/categories", createCategoryController);

router.put("/categories/:id", updateCategoryController);
router.delete("/categories/:id", deleteCategoryController);




export const adminRoutes = router;
