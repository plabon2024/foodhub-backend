import { Router } from "express";
import { getAllUsersController, updateUserStatusController } from "./admin.controller";


const router = Router();

router.get("/users", getAllUsersController);
router.patch("/users/:id", updateUserStatusController);

export const adminRoutes = router;
