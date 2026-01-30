import { Router } from "express";
import { getAllUsersController } from "./admin.controller";
const router = Router();

router.get("/users", getAllUsersController);


export const adminRoutes = router;