import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export const getProviderProfile = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "PROVIDER") {
        return res.status(403).json({ message: "Access denied" });
    }

    const profile = await prisma.providerProfile.findUnique({
        where: { userId: req.user.id },
    });

    res.json(profile);
};

export const upsertProviderProfile = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "PROVIDER") {
        return res.status(403).json({ message: "Only providers allowed" });
    }

    const { name, description, address, phone } = req.body;

    if (!name || !address) {
        return res.status(400).json({
            message: "Name and address are required",
        });
    }

    const profile = await prisma.providerProfile.upsert({
        where: { userId: req.user.id },
        update: { name, description, address, phone },
        create: {
            userId: req.user.id,
            name,
            description,
            address,
            phone,
        },
    });

    res.json(profile);
};
