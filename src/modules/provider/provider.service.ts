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
