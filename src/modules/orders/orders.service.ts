import { Prisma } from "../../../generated/prisma/client";
import { requireUser } from "../../lib/auth-user";
import { prisma } from "../../lib/prisma";


export async function createOrderService(req: any) {
  const user = await requireUser(req);

 
  if (user.role !== "CUSTOMER") {
    throw new Error("ONLY_CUSTOMER_CAN_ORDER");
  }


  if (user.status === "SUSPENDED") {
    throw new Error("USER_SUSPENDED");
  }

  const { providerId, deliveryAddress, items } = req.body;

  if (!providerId || !deliveryAddress || !items?.length) {
    throw new Error("INVALID_PAYLOAD");
  }


  const provider = await prisma.providerProfile.findFirst({
    where: {
      id: providerId,
      isActive: true,
    },
  });

  if (!provider) {
    throw new Error("PROVIDER_NOT_FOUND");
  }

  //  Fetch valid meals
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

  // 💰 Calculate total
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

  //  Create order
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


export async function getMyOrdersService(req: any) {
  const user = await requireUser(req);


  if (user.role === "CUSTOMER") {
    return prisma.order.findMany({
      where: { customerId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        totalAmount: true,
        deliveryAddress: true,
        createdAt: true,
        provider: {
          select: {
            id: true,
            name: true,
          },
        },
        items: {
          select: {
            quantity: true,
            price: true,
            meal: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }


  if (user.role === "PROVIDER") {
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!providerProfile) return [];

    return prisma.order.findMany({
      where: { providerId: providerProfile.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        deliveryAddress: true,
        totalAmount: true,
        createdAt: true,
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          select: {
            quantity: true,
            meal: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }


  if (user.role === "ADMIN") {
    return prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        totalAmount: true,
        deliveryAddress: true,
        createdAt: true,
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        provider: {
          select: {
            id: true,
            name: true,
          },
        },
        items: {
          select: {
            quantity: true,
            price: true,
            meal: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  return [];
}







export async function getOrderDetailsService(req: any) {
  const user = await requireUser(req);
  const orderId = req.params.id;

  if (!orderId) {
    throw new Error("ORDER_ID_REQUIRED");
  }

  // ADMIN → full access
  if (user.role === "ADMIN") {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: fullOrderInclude,
    });

    if (!order) throw new Error("ORDER_NOT_FOUND");
    return order;
  }

  // PROVIDER → only own orders
  if (user.role === "PROVIDER") {
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!providerProfile) {
      throw new Error("PROVIDER_PROFILE_NOT_FOUND");
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        providerId: providerProfile.id,
      },
      include: fullOrderInclude,
    });

    if (!order) throw new Error("ORDER_NOT_FOUND");
    return order;
  }

  // CUSTOMER → only own orders
  if (user.role === "CUSTOMER") {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerId: user.id,
      },
      include: fullOrderInclude,
    });

    if (!order) throw new Error("ORDER_NOT_FOUND");
    return order;
  }

  throw new Error("FORBIDDEN");
}

const fullOrderInclude = {
  provider: {
    select: {
      id: true,
      name: true,
      address: true,
      phone: true,
    },
  },
  customer: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  items: {
    include: {
      meal: {
        select: {
          id: true,
          name: true,
          price: true,
          imageUrl: true,
        },
      },
    },
  },
};
