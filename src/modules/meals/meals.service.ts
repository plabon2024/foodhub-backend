import { Meal } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

type CreateMealInput = Omit<Meal, "id" | "createdAt" | "updatedAt">;

export const createMeal = async (data: CreateMealInput) => {
  const result = await prisma.meal.create({
    data,
  });

  return result;
};

export const mealService = {
  createMeal,
};