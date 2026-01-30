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
