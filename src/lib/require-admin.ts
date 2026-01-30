import { auth } from "./auth";
import { prisma } from "./prisma";
import { Request } from "express";

export async function requireAdmin(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers as any,
  });

  if (!session?.user) {
    throw new Error("UNAUTHORIZED");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true },
  });

  if (!user || user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }

  return user;
}
