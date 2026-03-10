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

  static async findRecent(limit = 10) {
    return prisma.activity.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: { select: { id: true, name: true } },
      },
    });
  }
}
