import { Router } from "express";
import { CategoryController } from "../controller/category.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const categoryController = new CategoryController();

// Rotas públicas
router.get("/", categoryController.getAll.bind(categoryController));
router.get("/:id", categoryController.getById.bind(categoryController));
router.get(
  "/slug/:slug",
  categoryController.getBySlug.bind(categoryController),
);

// Middleware de autenticação para rotas protegidas
router.use(authMiddleware);

// Middleware simples para verificar se é ADMIN
const adminOnly = (req: any, res: any, next: any) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({
      status: "error",
      message:
        "Acesso negado. Apenas administradores podem executar esta ação.",
    });
  }
  next();
};

// Rotas protegidas (apenas ADMIN)
router.post("/", adminOnly, categoryController.create.bind(categoryController));
router.put(
  "/:id",
  adminOnly,
  categoryController.update.bind(categoryController),
);
router.delete(
  "/:id",
  adminOnly,
  categoryController.delete.bind(categoryController),
);

export default router;
