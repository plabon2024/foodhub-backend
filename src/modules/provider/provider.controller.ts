import { Request, Response } from "express";
import {
  applyForProviderService,
  createMealService,
  deleteMealService,
  updateMealService,
  updateOrderStatusService
} from "./provider.service";

export async function applyForProviderController(req: Request, res: Response) {
  try {
    const profile = await applyForProviderService(req);

    return res.status(201).json({
      success: true,
      data: profile,
    });
  } catch (error: any) {
    const msg = error.message;

    if (msg === "UNAUTHORIZED") {
      return res.status(401).json({ success: false, message: msg });
    }

    if (msg === "ALREADY_PROVIDER" || msg === "PROFILE_ALREADY_EXISTS") {
      return res.status(400).json({ success: false, message: msg });
    }

    return res.status(500).json({ success: false, message: "Failed to apply" });
  }
}

