import { prisma } from "lib/prisma";
import { PostFilter, PaginatedResponse } from "../models/post.model";
import { RegisterPostInput, UpdatePostInput } from "@schemas/post.schema";

export class PostRepository {
  // Listar todos os posts (com filtros opcionais)
  static async getAll(filters?: PostFilter): Promise<PaginatedResponse<any>> {
    const where: any = {};
    const and: any[] = [];

    if (filters?.title)
      and.push({ title: { contains: filters.title, mode: "insensitive" } });
    if (filters?.published !== undefined) {
      const published =
        typeof filters.published === "string"
          ? filters.published === "true"
          : filters.published;

      and.push({ published });
    }
    if (filters?.author)
      and.push({
        author: { name: { contains: filters.author, mode: "insensitive" } },
      });
    if (filters?.authorId) and.push({ authorId: filters.authorId });
    if (filters?.categoryId) and.push({ categoryId: filters.categoryId });
    if (filters?.startDate || filters?.endDate) {
      const createdAt: { gte?: Date; lte?: Date } = {};
      if (filters?.startDate) {
        const start = new Date(filters.startDate);
        if (!Number.isNaN(start.getTime())) createdAt.gte = start;
      }
      if (filters?.endDate) {
        const end = new Date(filters.endDate);
        if (!Number.isNaN(end.getTime())) createdAt.lte = end;
      }
      if (Object.keys(createdAt).length) and.push({ createdAt });
    }
    if (and.length) where.AND = and;

    const page = filters?.page && filters.page > 0 ? filters.page : 1;
    const limit = filters?.limit && filters.limit > 0 ? filters.limit : 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, email: true } },
          category: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.post.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Buscar post por ID
  static async findById(id: string) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
      },
    });
  }

  // Buscar post pela url
  static async findBySlug(slug: string) {
    return prisma.post.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
      },
    });
  }

  // Buscar post por autor
  static async findByAuthorId(
    authorId: string,
    filters?: PostFilter,
  ): Promise<PaginatedResponse<any>> {
    return this.getAll({ ...filters, authorId });
  }

  static async create(data: RegisterPostInput) {
    return prisma.post.create({
      data: {
        title: data.title,
        description: data.description,
        content: data.content,
        slug: data.slug,
        published: data.published || false,
        author: { connect: { id: data.authorId } },
        category: data.categoryId
          ? { connect: { id: data.categoryId } }
          : undefined,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
      },
    });
  }

  static async update(id: string, data: UpdatePostInput) {
    return prisma.post.update({
      where: { id },
      data,
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
      },
    });
  }

  static async delete(id: string) {
    return prisma.post.delete({ where: { id } });
  }
  
  static async incrementViews(id: string) {
    return prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
      },
    });
  }

  static async findRecent(limit: number, authorId?: string) {
    const where: any = { published: true };
    if (authorId) where.authorId = authorId;

    return prisma.post.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  static async findMostViewed(limit: number, authorId?: string) {
    const where: any = { published: true };
    if (authorId) where.authorId = authorId;

    return prisma.post.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
      },
      orderBy: { views: "desc" },
      take: limit,
    });
  }

  static async countPosts(authorId?: string) {
    return prisma.post.count(authorId ? { where: { authorId } } : undefined);
  }

  static async countPublished(authorId?: string) {
    const where: any = { published: true };
    if (authorId) where.authorId = authorId;
    return prisma.post.count({ where });
  }

  static async countDrafts(authorId?: string) {
    const where: any = { published: false };
    if (authorId) where.authorId = authorId;
    return prisma.post.count({ where });
  }

  static async sumViews(authorId?: string) {
    const result = await prisma.post.aggregate({
      where: authorId ? { authorId } : undefined,
      _sum: {
        views: true,
      },
    });

    return result._sum.views || 0;
  }
}
