import { prisma } from "lib/prisma";
import {
  RegisterInput,
  UpdateUserInput,
  UserFilterInput,
} from "../schemas/auth.schema";

export class UserRepository {
  static async getAll(filters?: UserFilterInput) {
    const where: any = {};
    if (filters?.name)
      where.name = { contains: filters.name, mode: "insensitive" };
    if (filters?.email)
      where.email = { contains: filters.email, mode: "insensitive" };
    if (filters?.role) where.role = filters.role;

    return prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  static async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  static async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  static async create(userData: RegisterInput) {
    return prisma.user.create({ data: userData });
  }

  static async update(id: string, data: UpdateUserInput) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  }
}
