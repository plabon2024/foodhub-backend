import { Request, Response } from "express";

export const getCurrentUser = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    res.json({
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        status: req.user.status,
    });
};
