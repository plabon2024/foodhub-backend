
import { Request, Response } from "express";
import { browseMealsService, getMealDetailsService, getProviderWithMenuService, listProvidersService } from "./meals.service";

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

