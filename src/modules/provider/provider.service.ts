import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth";
import { Request, Response } from "express";
import { Prisma } from "../../../generated/prisma/client";
import { requireUser } from "../../lib/auth-user";
import { requireProvider } from "../../lib/require-provider";


// export async function createMealService(req: Request, res: Response) {
//     const session = await auth.api.getSession({
//         headers: req.headers as any,
//     });
//     console.log(session)
//     if (!session?.user) throw new Error("UNAUTHORIZED");

//     const user = await prisma.user.findUnique({
//         where: { id: session.user.id },
//         select: { id: true, role: true },
//     });

//     if (!user || user.role !== "PROVIDER") {
//         throw new Error("FORBIDDEN");
//     }

//     const provider = await prisma.providerProfile.findUnique({
//         where: { userId: user.id },
//     });

//     if (!provider) {
//         throw new Error("PROVIDER_PROFILE_NOT_FOUND");
//     }

//     const { categoryId, name, description, price, imageUrl } = req.body;

//     if (!categoryId || !name || price === undefined) {
//         throw new Error("MISSING_REQUIRED_FIELDS");
//     }

//     const category = await prisma.category.findUnique({
//         where: { id: categoryId },
//     });

//     if (!category) {
//         throw new Error("CATEGORY_NOT_FOUND");
//     }

//     const meal = await prisma.meal.create({
//         data: {
//             providerId: provider.id,
//             categoryId,
//             name,
//             description,
//             price: new Prisma.Decimal(price), // ✅ CRITICAL FIX
//             imageUrl,
//         },
//     });

//     return meal;
// }


export async function applyForProviderService(req: any) {
  const user = await requireUser(req);

  // Prevent re-apply
  if (user.role === "PROVIDER") {
    throw new Error("ALREADY_PROVIDER");
  }

  const existingProfile = await prisma.providerProfile.findUnique({
    where: { userId: user.id },
  });

  if (existingProfile) {
    throw new Error("PROFILE_ALREADY_EXISTS");
  }

  // Transaction = safe
  const [_, providerProfile] = await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { role: "PROVIDER" },
    }),
    prisma.providerProfile.create({
      data: {
        userId: user.id,
        name: user.name,
        address: "Pending provider setup",
        description: null,
        phone: null,
      },
    }),
  ]);

  return providerProfile;
}






//  ____


export async function createMealService(req: any) {
  const provider = await requireProvider(req);

  const { categoryId, name, description, price, imageUrl } = req.body;

  if (!categoryId || !name || price === undefined) {
    throw new Error("INVALID_PAYLOAD");
  }

  return prisma.meal.create({
    data: {
      providerId: provider.id,
      categoryId,
      name,
      description,
      imageUrl,
      price: new Prisma.Decimal(price),
    },
  });
}


export async function updateMealService(req: any) {
  const provider = await requireProvider(req);
  const { id } = req.params;

  return prisma.meal.updateMany({
    where: {
      id,
      providerId: provider.id,
    },
    data: req.body,
  });
}

export async function deleteMealService(req: any) {
  const provider = await requireProvider(req);

  return prisma.meal.deleteMany({
    where: {
      id: req.params.id,
      providerId: provider.id,
    },
  });
}

export async function updateOrderStatusService(req: any) {
  const provider = await requireProvider(req);
  const { status } = req.body;

  if (!status) throw new Error("STATUS_REQUIRED");

  return prisma.order.updateMany({
    where: {
      id: req.params.id,
      providerId: provider.id,
    },
    data: { status },
  });
}
