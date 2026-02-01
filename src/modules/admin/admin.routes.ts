import { Router } from "express";
import { approveProviderApplicationController, getAllUsersController, updateUserStatusController } from "./admin.controller";


const router = Router();

router.get("/users", getAllUsersController);
router.patch("/users/:id", updateUserStatusController);

// NEW
router.post(
  "/provider-applications/:applicationId/approve",
  approveProviderApplicationController
);

export const adminRoutes = router;
