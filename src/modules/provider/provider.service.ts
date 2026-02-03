import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { requireProvider } from "../../lib/require-provider";


export async function applyForProviderService(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  if (user.role === "PROVIDER") {
    throw new Error("ALREADY_PROVIDER");
  }

  const existingApplication =
    await prisma.providerApplication.findUnique({
      where: { userId },
    });

  if (existingApplication) {
    throw new Error("APPLICATION_ALREADY_EXISTS");
  }

  const application = await prisma.providerApplication.create({
    data: {
      userId,
    },
  });

  return application;
}






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

  if (!id) {
    throw new Error("MEAL_ID_REQUIRED");
  }

  // Allow only safe fields
  const {
    name,
    description,
    price,
    imageUrl,
    isAvailable,
    categoryId,
    isFeatured,
  } = req.body;

  if (
    name === undefined &&
    description === undefined &&
    price === undefined &&
    imageUrl === undefined &&
    isAvailable === undefined &&
    categoryId === undefined &&
    isFeatured === undefined
  ) {
    throw new Error("NO_FIELDS_TO_UPDATE");
  }

  // Ensure meal belongs to provider
  const existingMeal = await prisma.meal.findFirst({
    where: {
      id,
      providerId: provider.id,
    },
  });

  if (!existingMeal) {
    throw new Error("MEAL_NOT_FOUND");
  }

  // Update meal
  return prisma.meal.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(isAvailable !== undefined && { isAvailable }),
      ...(categoryId !== undefined && { categoryId }),
      ...(isFeatured !== undefined && { isFeatured }),
    },
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
