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



export async function approveProviderApplication(
  req: any,
  applicationId: string
) {
  await requireAdmin(req);

  const application = await prisma.providerApplication.findUnique({
    where: { id: applicationId },
    include: { user: true },
  });

  if (!application) {
    throw new Error("APPLICATION_NOT_FOUND");
  }

  if (application.status !== "PENDING") {
    throw new Error("APPLICATION_ALREADY_PROCESSED");
  }

  if (!application.user) {
    throw new Error("INVALID_APPLICATION");
  }

  if (!application.user.name) {
    throw new Error("INVALID_USER_DATA");
  }

  const [, , profile] = await prisma.$transaction([
    prisma.providerApplication.update({
      where: { id: applicationId },
      data: { 
        status: "APPROVED"
      },
    }),
    prisma.user.update({
      where: { id: application.userId },
      data: { role: "PROVIDER" },
    }),
    prisma.providerProfile.create({
      data: {
        userId: application.userId,
        name: application.user.name,
        description: null, 
        address: null,    
        phone: null,      
        isActive: true,
      },
    }),
  ]);

  return profile;
}


