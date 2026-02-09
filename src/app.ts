import cors from "cors";
import express, { Application } from "express";

import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { adminRoutes } from "./modules/admin/admin.routes";
import { authRouter } from "./modules/auth/auth.routes";
import { mealRoutes } from "./modules/meals/meals.routes";
import { orderRoutes } from "./modules/orders/orders.routes";
import { providerRoutes } from "./modules/provider/provider.routes";
export const app: Application = express();
const allowedOrigins = [
  "http://localhost:3000",
  "https://foodhub-frontend-sepia.vercel.app",
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["Set-Cookie"],

};



app.use(cors(corsOptions));



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
