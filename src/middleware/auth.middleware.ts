import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth";


export async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        // Convert Node headers → Fetch Headers
        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers)) {
            if (typeof value === "string") {
                headers.append(key, value);
            }
        }

        const session = await auth.api.getSession({ headers });

        if (!session) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = {
            id: session.user.id,
            email: session.user.email,
            // role: session.user.role,
            // status: session.user.status,
        };

        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}
