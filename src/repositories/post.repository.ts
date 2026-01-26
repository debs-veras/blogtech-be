import { prisma } from "lib/prisma";
import {
  CreatePostInput,
  UpdatePostInput,
  PostFilter,
} from "../models/post.model";

export class PostRepository {
  static async getAll(filters?: PostFilter) {
    const where: any = {};
    if (filters?.title)
      where.title = { contains: filters.title, mode: "insensitive" };
    if (filters?.published !== undefined) where.published = filters.published;
    if (filters?.authorId) where.authorId = filters.authorId;

    return prisma.post.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async findBySlug(slug: string) {
    return prisma.post.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
      },
    });
  }

  static async findById(id: string) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
      },
    });
  }

  static async create(data: CreatePostInput) {
    return prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        slug: data.slug,
        published: data.published || false,
        author: { connect: { id: data.authorId } },
        ...(data.categoryId && {
          category: { connect: { id: data.categoryId } },
        }),
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

  static async findByAuthorId(authorId: string) {
    return prisma.post.findMany({
      where: { authorId },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async findRecent(limit: number) {
    return prisma.post.findMany({
      where: { published: true },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  static async findMostViewed(limit: number) {
    return prisma.post.findMany({
      where: { published: true },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
      },
      orderBy: { views: "desc" },
      take: limit,
    });
  }

  static async incrementViews(id: string) {
    return prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }
}
