import { Request, Response } from "express";
import {
  createCategoryService,
  listCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from "./category.service";

export async function createCategoryController(req: Request, res: Response) {
  try {
    const data = await createCategoryService(req);
    res.status(201).json({ success: true, data });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
}

export async function listCategoryController(req: Request, res: Response) {
  const data = await listCategoryService();
  res.json({ success: true, data });
}

export async function updateCategoryController(req: Request, res: Response) {
  try {
    const data = await updateCategoryService(req);
    res.json({ success: true, data });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
}

export async function deleteCategoryController(req: Request, res: Response) {
  try {
    await deleteCategoryService(req);
    res.json({ success: true });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
}
