import { Router } from "express";
import { createOrderController, getMyOrdersController } from "./orders.controller";


const router = Router();

router.post("/orders", createOrderController);
router.get("/orders", getMyOrdersController);


export const orderRoutes = router;
