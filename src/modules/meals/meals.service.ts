import { Prisma } from "../../../generated/prisma/client";
import { requireUser } from "../../lib/auth-user";
import { prisma } from "../../lib/prisma";
import { requireAuthUser } from "../../lib/require-auth-user";



export async function browseMealsService(query: any) {
  const {
    categoryId,
    providerId,
    minPrice,
    maxPrice,
    q,
    available,
    featured,
    page,
    limit,
  } = query;

  const where: Prisma.MealWhereInput = {
    provider: { isActive: true },
  };

  if (available === "true") where.isAvailable = true;
  if (available === "false") where.isAvailable = false;

  if (featured === "true") where.isFeatured = true;
  if (featured === "false") where.isFeatured = false;

  if (categoryId) where.categoryId = categoryId;
  if (providerId) where.providerId = providerId;

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = new Prisma.Decimal(minPrice);
    if (maxPrice) where.price.lte = new Prisma.Decimal(maxPrice);
  }

  if (q) {
    where.name = {
      contains: q,
      mode: "insensitive",
    };
  }

  // 🔒 Build Prisma args safely
  const findArgs: Prisma.MealFindManyArgs = {
    where,
    include: {
      category: true,
      provider: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  };

  const hasPagination = page !== undefined && limit !== undefined;

  if (hasPagination) {
    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.max(Number(limit), 1);

    findArgs.skip = (pageNum - 1) * limitNum;
    findArgs.take = limitNum;
  }

  const [items, total] = await Promise.all([
    prisma.meal.findMany(findArgs),
    prisma.meal.count({ where }),
  ]);

  if (!hasPagination) {
    return {
      items,
      total,
    };
  }

  return {
    items,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
}



export async function getMealDetailsService(mealId: string) {
  if (!mealId) {
    throw new Error("MEAL_ID_REQUIRED");
  }

  const meal = await prisma.meal.findFirst({
    where: {
      id: mealId,
     
      provider: {
        isActive: true,
      },
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      provider: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },
  });

  if (!meal) {
    throw new Error("MEAL_NOT_FOUND");
  }

  return meal;
}



export async function listProvidersService() {
  const providers = await prisma.providerProfile.findMany({
    where: {
      isActive: true,
      user: {
        status: "ACTIVE",
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      address: true,
      phone: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          role: true,
          status: true
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return providers;
}


export async function getProviderWithMenuService(providerId: string) {
  if (!providerId) {
    throw new Error("PROVIDER_ID_REQUIRED");
  }

  const provider = await prisma.providerProfile.findFirst({
    where: {
      id: providerId,
      isActive: true,
      user: {
        status: "ACTIVE",
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      address: true,
      phone: true,
      createdAt: true,
      user: {
        select: {
          image: true,
        },
      },
      meals: {
        where: {
          isAvailable: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          imageUrl: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!provider) {
    throw new Error("PROVIDER_NOT_FOUND");
  }

  return provider;
}

export async function getStatsService(req: any) {
  const user = await requireAuthUser(req);

  // 🔒 CUSTOMER not allowed
  if (user.role === "CUSTOMER") {
    throw new Error("FORBIDDEN");
  }

  // ============================
  // 👑 ADMIN STATS (GLOBAL)
  // ============================
  if (user.role === "ADMIN") {
    const [
      totalUsers,
      customers,
      providers,
      suspendedUsers,

      providerApplications,

      providerProfiles,
      activeProviders,

      totalMeals,
      availableMeals,

      totalOrders,
      ordersByStatus,
      revenue,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.user.count({ where: { role: "PROVIDER" } }),
      prisma.user.count({ where: { status: "SUSPENDED" } }),

      prisma.providerApplication.groupBy({
        by: ["status"],
        _count: true,
      }),

      prisma.providerProfile.count(),
      prisma.providerProfile.count({ where: { isActive: true } }),

      prisma.meal.count(),
      prisma.meal.count({ where: { isAvailable: true } }),

      prisma.order.count(),
      prisma.order.groupBy({
        by: ["status"],
        _count: true,
      }),
      prisma.order.aggregate({
        where: { status: "DELIVERED" },
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      role: "ADMIN",
      users: {
        total: totalUsers,
        customers,
        providers,
        suspended: suspendedUsers,
      },
      providerApplications: providerApplications.reduce(
        (acc: any, row) => {
          acc[row.status] = row._count;
          return acc;
        },
        { PENDING: 0, APPROVED: 0, REJECTED: 0 },
      ),
      providers: {
        total: providerProfiles,
        active: activeProviders,
      },
      meals: {
        total: totalMeals,
        available: availableMeals,
      },
      orders: {
        total: totalOrders,
        byStatus: ordersByStatus.reduce((acc: any, row) => {
          acc[row.status] = row._count;
          return acc;
        }, {}),
        revenue: revenue._sum.totalAmount ?? "0.00",
      },
    };
  }

  // ============================
  // 🧑‍🍳 PROVIDER STATS (OWN)
  // ============================
  if (user.role === "PROVIDER") {
    if (!user.providerProfile) {
      throw new Error("PROVIDER_PROFILE_NOT_FOUND");
    }

    const providerId = user.providerProfile.id;

    const [
      totalMeals,
      availableMeals,

      totalOrders,
      ordersByStatus,
      revenue,
    ] = await Promise.all([
      prisma.meal.count({ where: { providerId } }),
      prisma.meal.count({ where: { providerId, isAvailable: true } }),

      prisma.order.count({ where: { providerId } }),
      prisma.order.groupBy({
        where: { providerId },
        by: ["status"],
        _count: true,
      }),
      prisma.order.aggregate({
        where: {
          providerId,
          status: "DELIVERED",
        },
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      role: "PROVIDER",
      meals: {
        total: totalMeals,
        available: availableMeals,
      },
      orders: {
        total: totalOrders,
        byStatus: ordersByStatus.reduce((acc: any, row) => {
          acc[row.status] = row._count;
          return acc;
        }, {}),
        revenue: revenue._sum.totalAmount ?? "0.00",
      },
    };
  }
}

