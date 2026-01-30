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


export async function createMealController(req: Request, res: Response) {
  try {
    const meal = await createMealService(req);
    res.status(201).json({ success: true, data: meal });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
}

export async function updateMealController(req: Request, res: Response) {
  try {
    await updateMealService(req);
    res.json({ success: true });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
}

export async function deleteMealController(req: Request, res: Response) {
  try {
    await deleteMealService(req);
    res.json({ success: true });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
}

export async function updateOrderStatusController(req: Request, res: Response) {
  try {
    await updateOrderStatusService(req);
    res.json({ success: true });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
}
