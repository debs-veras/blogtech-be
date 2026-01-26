import { Request, Response, NextFunction } from "express";
import { sendError, sendSuccess } from "../util/response";
import { PostService } from "../service/post.service";

export class PostController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = req.query;
      const posts = await PostService.getAllPosts(filters as any);
      return sendSuccess(res, "Lista de posts", posts);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return sendError(res, "ID inválido", { id }, 400);
      }

      const post = await PostService.getPostById(id);
      return sendSuccess(res, "Post encontrado", post);
    } catch (err) {
      next(err);
    }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      if (!slug || Array.isArray(slug)) {
        return sendError(res, "Slug inválido", { slug }, 400);
      }

      const post = await PostService.getPostBySlug(slug);
      // Incrementar visualizações
      await PostService.incrementViews(post.id);
      return sendSuccess(res, "Post encontrado", post);
    } catch (err) {
      next(err);
    }
  }

  static async getRecent(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const posts = await PostService.getRecentPosts(limit);
      return sendSuccess(res, "Posts mais recentes", posts);
    } catch (err) {
      next(err);
    }
  }

  static async getMostViewed(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const posts = await PostService.getMostViewedPosts(limit);
      return sendSuccess(res, "Posts mais visualizados", posts);
    } catch (err) {
      next(err);
    }
  }

  static async getByAuthor(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorId } = req.params;
      if (!authorId || Array.isArray(authorId)) {
        return sendError(res, "ID do autor inválido", { authorId }, 400);
      }

      const posts = await PostService.getPostsByAuthor(authorId);
      return sendSuccess(res, "Posts do autor", posts);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, content, slug } = req.body;
      const authorId = req.user?.id;

      if (!authorId) {
        return sendError(res, "Usuário não autenticado", null, 401);
      }

      if (!title || !content || !slug) {
        return sendError(
          res,
          "Campos obrigatórios faltando",
          { title, content, slug },
          400,
        );
      }

      const post = await PostService.createPost({
        title,
        content,
        slug,
        authorId,
      });

      res.status(201);
      return sendSuccess(res, "Post criado com sucesso", post);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { title, content, slug } = req.body;

      if (!id || Array.isArray(id)) {
        return sendError(res, "ID inválido", { id }, 400);
      }

      const post = await PostService.updatePost(id, {
        title,
        content,
        slug,
      });

      return sendSuccess(res, "Post atualizado com sucesso", post);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id || Array.isArray(id)) {
        return sendError(res, "ID inválido", { id }, 400);
      }

      await PostService.deletePost(id);
      return sendSuccess(res, "Post deletado com sucesso", null);
    } catch (err) {
      next(err);
    }
  }

  static async publish(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id || Array.isArray(id)) {
        return sendError(res, "ID inválido", { id }, 400);
      }

      const post = await PostService.publishPost(id);
      return sendSuccess(res, "Post publicado com sucesso", post);
    } catch (err) {
      next(err);
    }
  }
}
