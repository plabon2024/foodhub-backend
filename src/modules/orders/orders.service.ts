import { Prisma } from "../../../generated/prisma/client";
import { requireUser } from "../../lib/auth-user";
import { prisma } from "../../lib/prisma";


export async function createOrderService(req: any) {
  const user = await requireUser(req);

  const { providerId, deliveryAddress, items } = req.body;

  if (!providerId || !deliveryAddress || !items?.length) {
    throw new Error("INVALID_PAYLOAD");
  }

  // Ensure provider exists & active
  const provider = await prisma.providerProfile.findFirst({
    where: {
      id: providerId,
      isActive: true,
    },
  });

  if (!provider) {
    throw new Error("PROVIDER_NOT_FOUND");
  }

  // Fetch meals
  const mealIds = items.map((i: any) => i.mealId);

  const meals = await prisma.meal.findMany({
    where: {
      id: { in: mealIds },
      providerId,
      isAvailable: true,
    },
  });

  if (meals.length !== items.length) {
    throw new Error("INVALID_MEALS");
  }

  // Calculate total
  let totalAmount = new Prisma.Decimal(0);

  const orderItemsData = items.map((item: any) => {
    const meal = meals.find(m => m.id === item.mealId)!;
    const lineTotal = meal.price.mul(item.quantity);
    totalAmount = totalAmount.add(lineTotal);

    return {
      mealId: meal.id,
      quantity: item.quantity,
      price: meal.price,
    };
  });

  const order = await prisma.order.create({
    data: {
      customerId: user.id,
      providerId,
      deliveryAddress,
      totalAmount,
      items: {
        create: orderItemsData,
      },
    },
    include: {
      items: true,
    },
  });

  return order;
}
