// lib/require-provider.ts
import { auth } from "./auth";
import { prisma } from "./prisma";
import { Request } from "express";

export async function requireProvider(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers as any,
  });

  if (!session?.user) throw new Error("UNAUTHORIZED");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.role !== "PROVIDER") {
    throw new Error("FORBIDDEN");
  }

  const provider = await prisma.providerProfile.findUnique({
    where: { userId: user.id },
  });

  if (!provider || !provider.isActive) {
    throw new Error("PROVIDER_NOT_ACTIVE");
  }

  return provider;
}
