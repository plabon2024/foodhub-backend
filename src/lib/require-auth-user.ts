
import { auth } from "./auth";
import { prisma } from "./prisma";
import { Request } from "express";

export async function requireAuthUser(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers as any,
  });

  if (!session?.user) {
    throw new Error("UNAUTHORIZED");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { providerProfile: true },
  });

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}
