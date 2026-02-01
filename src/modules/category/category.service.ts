import { prisma } from "../../lib/prisma";
import { requireUser } from "../../lib/auth-user";

export async function createCategoryService(req: any) {
  const user = await requireUser(req);
  if (user.role !== "PROVIDER") throw new Error("FORBIDDEN");

  const { name, description } = req.body;
  if (!name) throw new Error("NAME_REQUIRED");

  return prisma.category.create({
    data: { name, description },
  });
}

export async function listCategoryService() {
  return prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function updateCategoryService(req: any) {
  const user = await requireUser(req);
  if (user.role !== "PROVIDER") throw new Error("FORBIDDEN");

  const { name, description } = req.body;

  return prisma.category.update({
    where: { id: req.params.id },
    data: { name, description },
  });
}

export async function deleteCategoryService(req: any) {
  const user = await requireUser(req);
  if (user.role !== "PROVIDER") throw new Error("FORBIDDEN");

  return prisma.category.delete({
    where: { id: req.params.id },
  });
}
