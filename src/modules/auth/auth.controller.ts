import { Request, Response } from "express";
import { getCurrentUserService, updateProfileService } from "./auth.service";

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


export async function updateProfileController(
  req: Request,
  res: Response
) {
  try {
    const updatedUser = await updateProfileService(req);

    return res.json({
      success: true,
      data: updatedUser,
    });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED") {
      return res.status(401).json({ success: false, message: e.message });
    }

    if (e.message === "NO_FIELDS_TO_UPDATE") {
      return res.status(400).json({ success: false, message: e.message });
    }

    if (e.message === "PROVIDER_PROFILE_NOT_FOUND") {
      return res.status(400).json({ success: false, message: e.message });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
}
