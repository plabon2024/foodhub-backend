import { prisma } from "../../lib/prisma";
import { requireAdmin } from "../../lib/require-admin";
import { requireAuthUser } from "../../lib/require-auth-user";

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

  const userId = req.params?.id;
  const { status } = req.body;

  if (!userId) {
    throw new Error("USER_ID_REQUIRED");
  }

  const allowedStatuses = ["ACTIVE", "SUSPENDED"] as const;

  if (!allowedStatuses.includes(status)) {
    throw new Error("INVALID_STATUS");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
    },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  // 🔐 Atomic update
  return prisma.$transaction(async (tx) => {
    // 1️⃣ Update user status
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: { status },
    });

    // 2️⃣ If PROVIDER → toggle providerProfile.isActive
    if (user.role === "PROVIDER") {
      await tx.providerProfile.update({
        where: { userId },
        data: {
          isActive: status === "ACTIVE",
        },
      });
    }

    return updatedUser;
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


export async function getAllProviderApplicationsService(req: any) {
  await requireAdmin(req);

  return prisma.providerApplication.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          role: true,
          createdAt: true,
        },
      },
    },
  });
}




