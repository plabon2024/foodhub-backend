import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth";
import { Request, Response } from "express";
import { Prisma } from "../../../generated/prisma/client";
import { requireUser } from "../../lib/auth-user";
import { requireProvider } from "../../lib/require-provider";




export async function applyForProviderService(req: any) {
  const user = await requireUser(req);

  // Prevent re-apply
  if (user.role === "PROVIDER") {
    throw new Error("ALREADY_PROVIDER");
  }

  const existingProfile = await prisma.providerProfile.findUnique({
    where: { userId: user.id },
  });

  if (existingProfile) {
    throw new Error("PROFILE_ALREADY_EXISTS");
  }

  // Transaction = safe
  const [_, providerProfile] = await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { role: "PROVIDER" },
    }),
    prisma.providerProfile.create({
      data: {
        userId: user.id,
        name: user.name,
        address: "Pending provider setup",
        description: null,
        phone: null,
      },
    }),
  ]);

  return providerProfile;
}

