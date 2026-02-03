
import { Request, Response } from "express";
import { createOrderService, getMyOrdersService, getOrderDetailsService } from "./orders.service";


export async function createOrderController(
  req: Request,
  res: Response
) {
  try {
    const order = await createOrderService(req);
    res.status(201).json({ success: true, data: order });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
}


export async function getMyOrdersController(
  req: Request,
  res: Response
) {
  try {
    const orders = await getMyOrdersService(req);
    res.json({ success: true, data: orders });
  } catch {
    res.status(401).json({ success: false, message: "UNAUTHORIZED" });
  }
}


export async function getOrderDetailsController(
  req: Request,
  res: Response
) {
  try {
    const order = await getOrderDetailsService(req);
    res.json({ success: true, data: order });
  } catch (e: any) {
    res.status(404).json({ success: false, message: e.message });
  }
}
