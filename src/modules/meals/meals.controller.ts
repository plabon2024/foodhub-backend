
import { Request, Response } from "express";
import { browseMealsService, getMealDetailsService, getProviderWithMenuService, getStatsService, listCategoryService, listProvidersService } from "./meals.service";

export async function browseMealsController(
  req: Request,
  res: Response
) {
  try {
    const data = await browseMealsService(req.query);

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch meals",
    });
  }
}



export async function getMealDetailsController(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid meal id",
      });
    }
    const meal = await getMealDetailsService(id);

    return res.json({
      success: true,
      data: meal,
    });
  } catch (error: any) {
    const msg = error.message;

    if (msg === "MEAL_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Meal not found",
      });
    }

    return res.status(400).json({
      success: false,
      message: msg,
    });
  }
}


export async function listProvidersController(
  req: Request,
  res: Response
) {
  try {
    const providers = await listProvidersService();

    return res.json({
      success: true,
      data: providers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch providers",
    });
  }
}


export async function getProviderWithMenuController(
  req: Request,
  res: Response
) {
  try {

    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid meal id",
      });
    }
    const provider = await getProviderWithMenuService(id);

    return res.json({
      success: true,
      data: provider,
    });
  } catch (error: any) {
    if (error.message === "PROVIDER_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


export async function getStatsController(
  req: Request,
  res: Response
) {
  try {
    const stats = await getStatsService(req);

    return res.json({
      success: true,
      data: stats,
    });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED") {
      return res.status(401).json({ success: false, message: e.message });
    }

    if (e.message === "FORBIDDEN") {
      return res.status(403).json({ success: false, message: e.message });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to load stats",
    });
  }
}


