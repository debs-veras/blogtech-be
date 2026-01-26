import {
  CreatePostInput,
  UpdatePostInput,
  PostFilter,
} from "../models/post.model";
import { PostRepository } from "../repositories/post.repository";

export class PostService {
  static async getAllPosts(filters?: PostFilter) {
    return PostRepository.getAll(filters);
  }

  static async getPostById(id: string) {
    const post = await PostRepository.findById(id);
    if (!post) throw { statusCode: 404, message: "Post não encontrado" };
    return post;
  }

  static async getPostBySlug(slug: string) {
    const post = await PostRepository.findBySlug(slug);
    if (!post) throw { statusCode: 404, message: "Post não encontrado" };
    return post;
  }

  static async getPostsByAuthor(authorId: string) {
    return PostRepository.findByAuthorId(authorId);
  }

  static async createPost(data: CreatePostInput) {
    if (!data.slug) throw { statusCode: 400, message: "Slug é obrigatório" };

    const existingPost = await PostRepository.findBySlug(data.slug);
    if (existingPost) throw { statusCode: 400, message: "Slug já existe" };

    const newPost = await PostRepository.create(data);
    return newPost;
  }

  static async updatePost(id: string, data: UpdatePostInput) {
    const post = await PostRepository.findById(id);
    if (!post) throw { statusCode: 404, message: "Post não encontrado" };

    if (data.slug && data.slug !== post.slug) {
      const existingPost = await PostRepository.findBySlug(data.slug);
      if (existingPost) throw { statusCode: 400, message: "Slug já existe" };
    }

    const updatedPost = await PostRepository.update(id, data);
    return updatedPost;
  }

  static async deletePost(id: string) {
    const post = await PostRepository.findById(id);
    if (!post) throw { statusCode: 404, message: "Post não encontrado" };

    return PostRepository.delete(id);
  }

  static async publishPost(id: string) {
    const post = await PostRepository.findById(id);
    if (!post) throw { statusCode: 404, message: "Post não encontrado" };
    if (post.published)
      throw { statusCode: 400, message: "Post já foi publicado" };

    return PostRepository.update(id, { published: true });
  }

  static async getRecentPosts(limit: number = 10) {
    return PostRepository.findRecent(limit);
  }

  static async getMostViewedPosts(limit: number = 10) {
    return PostRepository.findMostViewed(limit);
  }

  static async incrementViews(id: string) {
    return PostRepository.incrementViews(id);
  }
}
