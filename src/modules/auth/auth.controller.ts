import { Request, Response } from "express";
import { getCurrentUserService } from "./auth.service";

export async function getCurrentUserController(
  req: Request,
  res: Response
) {
  try {
    const user = await getCurrentUserService(req);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
}
