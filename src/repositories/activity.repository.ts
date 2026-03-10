import { prisma } from "lib/prisma";

export class ActivityRepository {
  static async create(data: any) {
    return prisma.activity.create({
      data,
    });
  }

  static async findAll() {
    return prisma.activity.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async findRecent(limit = 10, authorId?: string) {
    const where: any = {};
    if (authorId) where.userId = authorId;

    return prisma.activity.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: { select: { id: true, name: true } },
      },
    });
  }
}
