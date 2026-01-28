// modules/provider/provider.router.ts
import { Router } from "express";
import {
    getProviderProfile,
    upsertProviderProfile,
} from "./provider.controller";
// import { authMiddleware } from "../auth/auth.middleware";

const router = Router();

// router.use(authMiddleware);

router.get("/profile", getProviderProfile);
router.post("/profile", upsertProviderProfile);
router.put("/profile", upsertProviderProfile);

export const providerRoutes= router;
