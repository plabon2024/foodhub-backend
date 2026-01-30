import { prisma } from "../../lib/prisma";
import { requireAdmin } from "../../lib/require-admin";

export async function getAllUsersService(req: any) {
  await requireAdmin(req);

  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true,
      createdAt: true,
      providerProfile: {
        select: {
          id: true,
          isActive: true,
        },
      },
    },
  });
}


export async function updateUserStatusService(req: any) {
  await requireAdmin(req);

  const { status } = req.body;

  if (!["ACTIVE", "SUSPENDED"].includes(status)) {
    throw new Error("INVALID_STATUS");
  }

  return prisma.user.update({
    where: { id: req.params.id },
    data: { status },
  });
}
