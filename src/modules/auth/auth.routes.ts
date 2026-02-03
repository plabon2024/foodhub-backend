import { Router } from "express";
import { getCurrentUserController, updateProfileController } from "./auth.controller";

const router = Router();

router.get("/me", getCurrentUserController);
router.patch("/profile", updateProfileController);
export const authRouter= router;
