import { UserController } from "controller/user.controller";
import { Router, type Router as ExpressRouter } from "express";
import { authMiddleware } from "middleware/auth.middleware";
import { ownershipMiddleware } from "middleware/ownership.middleware";
import { roleMiddleware } from "middleware/permissions.middleware";
import { auditMiddleware } from "middleware/audit.middleware";
import { rateLimitMiddleware } from "middleware/rate-limit.middleware";

const userRouter: ExpressRouter = Router();
userRouter.use(authMiddleware);

// Listar todos os usuários (apenas ADMIN)
userRouter.get(
  "/",
  roleMiddleware(["ADMIN"]),
  // auditMiddleware("user:list"),
  UserController.getAll,
);

// Ver usuário específico (próprio perfil ou todos se ADMIN)
userRouter.get(
  "/:id",
  roleMiddleware(["ADMIN", "AUTHOR"]),
  ownershipMiddleware("user"),
  // auditMiddleware("user:read"),
  UserController.getById,
);

// Criar usuário (apenas ADMIN)
userRouter.post(
  "/",
  rateLimitMiddleware(10, 60 * 60 * 1000),
  roleMiddleware(["ADMIN"]),
  // auditMiddleware("user:create"),
  UserController.create,
);

// Atualizar usuário (próprio perfil ou todos se ADMIN)
userRouter.put(
  "/:id",
  roleMiddleware(["ADMIN", "AUTHOR"]),
  ownershipMiddleware("user"),
  // auditMiddleware("user:update"),
  UserController.update,
);

// Deletar usuário (apenas ADMIN)
userRouter.delete(
  "/:id",
  roleMiddleware(["ADMIN"]),
  // auditMiddleware("user:delete"),
  UserController.delete,
);

export default userRouter;
