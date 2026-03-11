import { PostController } from "controller/post.controller";
import { Router, type Router as ExpressRouter } from "express";
import { authMiddleware } from "middleware/auth.middleware";
import { ownershipMiddleware } from "middleware/ownership.middleware";
import { roleMiddleware } from "middleware/permissions.middleware";
import { auditMiddleware } from "middleware/audit.middleware";
import { rateLimitMiddleware } from "middleware/rate-limit.middleware";

const postRouter: ExpressRouter = Router();
// Rotas públicas
// Rota para obter posts publicados
postRouter.get("/published", PostController.getPublished);
postRouter.get("/slug/:slug", PostController.getBySlug);

// Rota para obter post por ID (apenas ADMIN ou AUTHOR dono do post)
postRouter.get(
  "/by-id/:id",
  authMiddleware,
  ownershipMiddleware("post"),
  roleMiddleware(["ADMIN", "AUTHOR"]),
  PostController.getById,
);
// Rota para obter todos os posts (apenas ADMIN)
postRouter.get(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  PostController.getAll,
);
// Rota para obter dados para dashboard (apenas ADMIN)
postRouter.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  PostController.getDashboard,
);
// Rota para obter dados para dashboard do autor (apenas AUTHOR ou ADMIN)
postRouter.get(
  "/author-dashboard",
  authMiddleware,
  roleMiddleware(["ADMIN", "AUTHOR"]),
  PostController.getAuthorDashboard,
);
// Rota para obter posts por autor
postRouter.get(
  "/author/:authorId",
  authMiddleware,
  roleMiddleware(["ADMIN", "AUTHOR"]),
  PostController.getByAuthor,
);
// Criar posts (apenas AUTHOR e ADMIN) com rate limit
postRouter.post(
  "/",
  rateLimitMiddleware(20, 60 * 60 * 1000),
  authMiddleware,
  roleMiddleware(["ADMIN", "AUTHOR"]),
  auditMiddleware("create", "post"),
  PostController.create,
);
// Atualizar posts (próprios ou todos se ADMIN)
postRouter.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN", "AUTHOR"]),
  ownershipMiddleware("post"),
  auditMiddleware("update", "post"),
  PostController.update,
);
// Deletar posts (próprios ou todos se ADMIN)
postRouter.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN", "AUTHOR"]),
  ownershipMiddleware("post"),
  auditMiddleware("delete", "post"),
  PostController.delete,
);
// Publicar post (próprios ou todos se ADMIN)
postRouter.patch(
  "/:id/publish",
  authMiddleware,
  roleMiddleware(["ADMIN", "AUTHOR"]),
  ownershipMiddleware("post"),
  auditMiddleware("publish", "post"),
  PostController.publish,
);

postRouter.get(
  "/activities",
  authMiddleware,
  roleMiddleware(["ADMIN", "AUTHOR"]),
  PostController.activitiesPosts,
);

export default postRouter;
