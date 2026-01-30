import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { Request } from "express";

export async function getCurrentUserService(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers as any,
  });

  if (!session?.user) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true,
      image: true,
      createdAt: true,
      providerProfile: true,
    },
  });

  return user;
}
