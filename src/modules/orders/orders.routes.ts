import { Router } from "express";
import { createOrderController } from "./orders.controller";


const router = Router();

router.post("/orders", createOrderController);


export const orderRoutes = router;
