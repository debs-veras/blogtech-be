import { UserController } from "controller/user.controller";
import { Router, type Router as ExpressRouter } from "express";
import { authMiddleware } from "middleware/auth.middleware";
import { ownershipMiddleware } from "middleware/ownership.middleware";
import { permissionMiddleware, Permission } from "middleware/permissions.middleware";
import { auditMiddleware } from "middleware/audit.middleware";
import { rateLimitMiddleware } from "middleware/rate-limit.middleware";

const userRouter: ExpressRouter = Router();
userRouter.use(authMiddleware);

// Listar todos os usuários (apenas ADMIN)
userRouter.get(
  "/",
  permissionMiddleware([Permission.USER_LIST]),
  auditMiddleware("user:list"),
  UserController.getAll,
);

// Ver usuário específico (próprio perfil ou todos se ADMIN)
userRouter.get(
  "/:id",
  permissionMiddleware([Permission.USER_READ_OWN]),
  ownershipMiddleware("user"),
  auditMiddleware("user:read"),
  UserController.getById,
);

// Criar usuário (apenas ADMIN)
userRouter.post(
  "/",
  rateLimitMiddleware(10, 60 * 60 * 1000), // 10 usuários por hora
  permissionMiddleware([Permission.USER_CREATE]),
  auditMiddleware("user:create"),
  UserController.create,
);

// Atualizar usuário (próprio perfil ou todos se ADMIN)
userRouter.put(
  "/:id",
  permissionMiddleware([Permission.USER_UPDATE_OWN]),
  ownershipMiddleware("user"),
  auditMiddleware("user:update"),
  UserController.update,
);

// Deletar usuário (apenas ADMIN)
userRouter.delete(
  "/:id",
  permissionMiddleware([Permission.USER_DELETE_ANY]),
  auditMiddleware("user:delete"),
  UserController.delete,
);

export default userRouter;
