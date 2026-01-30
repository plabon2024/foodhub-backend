import { Router } from "express";
import { getCurrentUserController } from "./auth.controller";

const router = Router();

router.get("/me", getCurrentUserController);

export const authRouter= router;
