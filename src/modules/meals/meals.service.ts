import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

export async function browseMealsService(query: any) {
  const {
    categoryId,
    providerId,
    minPrice,
    maxPrice,
    q,
    available,
    page = 1,
    limit = 10,
  } = query;

  const where: Prisma.MealWhereInput = {
    ...(available !== undefined && {
      isAvailable: available === "true",
    }),
    provider: {
      isActive: true,
    },
  };

  if (categoryId) {
    where.categoryId = categoryId;
  }
  
  if (providerId) {
    where.providerId = providerId;
  }


  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) {
      where.price.gte = new Prisma.Decimal(minPrice);
    }
    if (maxPrice) {
      where.price.lte = new Prisma.Decimal(maxPrice);
    }
  }

 
  if (q) {
    where.name = {
      contains: q,
      mode: "insensitive",
    };
  }

  // Calculate pagination offset
  const skip = (Number(page) - 1) * Number(limit);

  // Fetch meals and total count in parallel
  const [items, total] = await Promise.all([
    prisma.meal.findMany({
      where,
      include: {
        category: true,
        provider: {
          select: { id: true, name: true },
        },
      },
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
    }),
    prisma.meal.count({ where }),
  ]);

  // Return formatted response with pagination info
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
      isAvailable: true,
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

