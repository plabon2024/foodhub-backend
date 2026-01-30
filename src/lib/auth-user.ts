import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { Request } from "express";

export async function requireUser(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers as any,
  });

  if (!session?.user) {
    throw new Error("UNAUTHORIZED");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  return user;
}
