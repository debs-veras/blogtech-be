import { CategoryRepository } from "../repositories/category.repository";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../schemas/category.schema";

export class CategoryService {
  private categoryRepository = new CategoryRepository();

  async getAllCategories() {
    return this.categoryRepository.findAll();
  }

  async getCategoryById(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new Error("Categoria não encontrada");
    return category;
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.categoryRepository.findBySlug(slug);
    if (!category) throw new Error("Categoria não encontrada");
    return category;
  }

  async createCategory(data: CreateCategoryInput) {
    // Verificar se o nome já existe
    const nameExists = await this.categoryRepository.checkNameExists(data.name);
    if (nameExists) throw new Error("Já existe uma categoria com este nome");
    // Verificar se o slug já existe
    const slugExists = await this.categoryRepository.checkSlugExists(data.slug);
    if (slugExists) throw new Error("Já existe uma categoria com este slug");
    return this.categoryRepository.create(data);
  }

  async updateCategory(id: string, data: UpdateCategoryInput) {
    // Verificar se a categoria existe
    await this.getCategoryById(id);
    // Verificar se o nome já existe (se fornecido)
    if (data.name) {
      const nameExists = await this.categoryRepository.checkNameExists(
        data.name,
        id,
      );
      if (nameExists) throw new Error("Já existe uma categoria com este nome");
    }
    // Verificar se o slug já existe (se fornecido)
    if (data.slug) {
      const slugExists = await this.categoryRepository.checkSlugExists(
        data.slug,
        id,
      );
      if (slugExists) throw new Error("Já existe uma categoria com este slug");
    }
    return this.categoryRepository.update(id, data);
  }

  async deleteCategory(id: string) {
    // Verificar se a categoria existe
    const category = await this.getCategoryById(id);
    // Verificar se a categoria tem posts
    if (category._count && category._count.posts > 0)
      throw new Error(
        "Não é possível excluir uma categoria que possui posts associados",
      );
    return this.categoryRepository.delete(id);
  }
}
