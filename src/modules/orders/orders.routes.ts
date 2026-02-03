
import { Router } from "express";
import { createOrderController, getMyOrdersController, getOrderDetailsController } from "./orders.controller";


const router = Router();

router.post("/orders", createOrderController);
router.get("/orders", getMyOrdersController);
router.get("/orders/:id", getOrderDetailsController);

export const orderRoutes = router;
