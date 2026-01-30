import { Request, Response } from "express";

import { getAllUsersService, updateUserStatusService } from "./admin.service";

export async function getAllUsersController(
  req: Request,
  res: Response
) {
  try {
    const users = await getAllUsersService(req);
    res.json({ success: true, data: users });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED") {
      return res.status(401).json({ success: false, message: e.message });
    }
    if (e.message === "FORBIDDEN") {
      return res.status(403).json({ success: false, message: e.message });
    }

    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
}

export async function updateUserStatusController(
  req: Request,
  res: Response
) {
  try {
    const user = await updateUserStatusService(req);
    res.json({ success: true, data: user });
  } catch (e: any) {
    if (e.message === "INVALID_STATUS") {
      return res.status(400).json({ success: false, message: e.message });
    }
    if (e.message === "UNAUTHORIZED") {
      return res.status(401).json({ success: false, message: e.message });
    }
    if (e.message === "FORBIDDEN") {
      return res.status(403).json({ success: false, message: e.message });
    }

    res.status(500).json({ success: false, message: "Update failed" });
  }
}
