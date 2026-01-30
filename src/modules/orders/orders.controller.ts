import { Request, Response } from "express";
import { createOrderService } from "./orders.service";


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


