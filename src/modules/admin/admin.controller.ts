import { Request, Response } from "express";

import { approveProviderApplication, getAllProviderApplicationsService, getAllUsersService, updateUserStatusService } from "./admin.service";

export async function getAllUsersController(req: Request, res: Response) {
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

export async function updateUserStatusController(req: Request, res: Response) {
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



export async function approveProviderApplicationController(
  req: Request,
  res: Response
) {
  try {
    const rawId = req.params.applicationId;
    const applicationId = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!applicationId) {
      return res
        .status(400)
        .json({ success: false, message: "APPLICATION_ID_REQUIRED" });
    }

    const profile = await approveProviderApplication(req, applicationId);

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (e: any) {
    if (e.message === "APPLICATION_NOT_FOUND") {
      return res.status(404).json({ success: false, message: e.message });
    }

    if (e.message === "APPLICATION_ALREADY_PROCESSED") {
      return res.status(400).json({ success: false, message: e.message });
    }

    if (e.message === "INVALID_APPLICATION") {
      return res.status(400).json({ success: false, message: e.message });
    }

    if (e.message === "INVALID_USER_DATA") {
      return res.status(400).json({ success: false, message: e.message });
    }

    if (e.message === "UNAUTHORIZED") {
      return res.status(401).json({ success: false, message: e.message });
    }

    if (e.message === "FORBIDDEN") {
      return res.status(403).json({ success: false, message: e.message });
    }

    console.error("Provider application approval error:", e);
    return res
      .status(500)
      .json({ success: false, message: "APPROVAL_FAILED" });
  }
}




export async function getAllProviderApplicationsController(
  req: Request,
  res: Response
) {
  try {
    const applications = await getAllProviderApplicationsService(req);

    return res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (e: any) {
    if (e.message === "UNAUTHORIZED") {
      return res.status(401).json({ success: false, message: e.message });
    }

    if (e.message === "FORBIDDEN") {
      return res.status(403).json({ success: false, message: e.message });
    }

    console.error("Fetch provider applications error:", e);
    return res
      .status(500)
      .json({ success: false, message: "FAILED_TO_FETCH_APPLICATIONS" });
  }
}
