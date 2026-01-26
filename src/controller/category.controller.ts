import { Request, Response } from "express";
import { CategoryService } from "../service/category.service";
import { sendSuccess, sendError } from "../util/response";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../schemas/category.schema";

export class CategoryController {
  private categoryService = new CategoryService();

  // GET /category
  async getAll(req: Request, res: Response) {
    try {
      const categories = await this.categoryService.getAllCategories();
      return sendSuccess(res, "Categorias recuperadas com sucesso", categories);
    } catch (error: any) {
      return sendError(res, error.message, undefined, 500);
    }
  }

  // GET /category/:id
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return sendError(res, "ID inválido", undefined, 400);
      }
      const category = await this.categoryService.getCategoryById(id);
      return sendSuccess(res, "Categoria recuperada com sucesso", category);
    } catch (error: any) {
      const status = error.message === "Categoria não encontrada" ? 404 : 500;
      return sendError(res, error.message, undefined, status);
    }
  }

  // GET /category/slug/:slug
  async getBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      if (!slug || Array.isArray(slug)) {
        return sendError(res, "Slug inválido", undefined, 400);
      }
      const category = await this.categoryService.getCategoryBySlug(slug);
      return sendSuccess(res, "Categoria recuperada com sucesso", category);
    } catch (error: any) {
      const status = error.message === "Categoria não encontrada" ? 404 : 500;
      return sendError(res, error.message, undefined, status);
    }
  }

  // POST /category
  async create(req: Request, res: Response) {
    try {
      const validatedData = createCategorySchema.parse(req.body);
      const category = await this.categoryService.createCategory(validatedData);
      return sendSuccess(res, "Categoria criada com sucesso", category);
    } catch (error: any) {
      const status = error.message.includes("já existe") ? 409 : 500;
      return sendError(res, error.message, status);
    }
  }

  // PUT /category/:id
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return sendError(res, "ID inválido", 400);
      }
      const validatedData = updateCategorySchema.parse(req.body);
      const category = await this.categoryService.updateCategory(
        id,
        validatedData,
      );
      return sendSuccess(res, "Categoria atualizada com sucesso", category);
    } catch (error: any) {
      let status = 500;
      if (error.message === "Categoria não encontrada") status = 404;
      if (error.message.includes("já existe")) status = 409;
      return sendError(res, error.message, status);
    }
  }

  // DELETE /category/:id
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id || Array.isArray(id)) {
        return sendError(res, "ID inválido", undefined, 400);
      }
      await this.categoryService.deleteCategory(id);
      return sendSuccess(res, "Categoria excluída com sucesso");
    } catch (error: any) {
      let status = 500;
      if (error.message === "Categoria não encontrada") status = 404;
      if (error.message.includes("posts associados")) status = 400;
      return sendError(res, error.message, undefined, status);
    }
  }
}
