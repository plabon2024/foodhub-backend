import { auth } from "../../lib/auth";
import { requireUser } from "../../lib/auth-user";
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
export async function updateProfileService(req: any) {
  const user = await requireUser(req);

  const {
    name,
    email,
    image,
    description,
    address,
    phone,
  } = req.body;

  if (
    !name &&
    !email &&
    !image &&
    !description &&
    !address &&
    !phone
  ) {
    throw new Error("NO_FIELDS_TO_UPDATE");
  }

// User-level fields
if (name || email || image) {
  await prisma.user.update({
    where: { id: user.id },
    data: {
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email }),
      ...(image !== undefined && { image }),
    },
  });
}


  // Provider-only fields
  if (user.role === "PROVIDER") {
    const provider = await prisma.providerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!provider) {
      throw new Error("PROVIDER_PROFILE_NOT_FOUND");
    }

    if (description || address || phone) {
      await prisma.providerProfile.update({
        where: { userId: user.id },
        data: {
          ...(description !== undefined && { description }),
          ...(address !== undefined && { address }),
          ...(phone !== undefined && { phone }),
        },
      });
    }
  }

  return prisma.user.findUnique({
    where: { id: user.id },
    include: {
      providerProfile: true,
    },
  });
}