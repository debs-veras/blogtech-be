import { PostController } from "controller/post.controller";
import { Router, type Router as ExpressRouter } from "express";
import { authMiddleware } from "middleware/auth.middleware";
import { ownershipMiddleware } from "middleware/ownership.middleware";
import {
  permissionMiddleware,
  Permission,
} from "middleware/permissions.middleware";
import { auditMiddleware } from "middleware/audit.middleware";
import { rateLimitMiddleware } from "middleware/rate-limit.middleware";

const postRouter: ExpressRouter = Router();

// Rotas públicas
postRouter.get("/", PostController.getAll);
postRouter.get("/recent", PostController.getRecent);
postRouter.get("/most-viewed", PostController.getMostViewed);
postRouter.get("/slug/:slug", PostController.getBySlug);
postRouter.get("/author/:authorId", PostController.getByAuthor);
postRouter.get("/:id", PostController.getById);

// Rotas protegidas (requer autenticação)
postRouter.use(authMiddleware);

// Criar posts (apenas AUTHOR e ADMIN) com rate limit
postRouter.post(
  "/",
  rateLimitMiddleware(20, 60 * 60 * 1000), // 20 posts por hora
  permissionMiddleware([Permission.POST_CREATE]),
  auditMiddleware("post:create"),
  PostController.create,
);

// Atualizar posts (próprios ou todos se ADMIN)
postRouter.put(
  "/:id",
  permissionMiddleware([Permission.POST_UPDATE_OWN]),
  ownershipMiddleware("post"),
  auditMiddleware("post:update"),
  PostController.update,
);

// Deletar posts (próprios ou todos se ADMIN)
postRouter.delete(
  "/:id",
  permissionMiddleware([Permission.POST_DELETE_OWN]),
  ownershipMiddleware("post"),
  auditMiddleware("post:delete"),
  PostController.delete,
);

// Publicar post (próprios ou todos se ADMIN)
postRouter.patch(
  "/:id/publish",
  permissionMiddleware([Permission.POST_PUBLISH_OWN]),
  ownershipMiddleware("post"),
  auditMiddleware("post:publish"),
  PostController.publish,
);

export default postRouter;
