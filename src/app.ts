import express, { Application } from "express";
import cors from "cors";

import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { providerRoutes } from "./modules/provider/provider.routes";
import { authRouter } from "./modules/auth/auth.routes";
import { mealRoutes } from "./modules/meals/meals.routes";
import { orderRoutes } from "./modules/orders/orders.routes";
import { adminRoutes } from "./modules/admin/admin.routes";
export const app: Application = express();
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use("/api/auth", authRouter);
app.all("/api/auth/*splat", toNodeHandler(auth));

// Meals & Providers (Public)
app.use("/api", mealRoutes);

// Provider Management
app.use("/api/provider", providerRoutes);

// Orders
app.use("/api", orderRoutes);


app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("hello world");
});
