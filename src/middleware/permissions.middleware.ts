import { Request, Response, NextFunction } from "express";
import { sendError } from "../util/response";
import { UserRole } from "../models/user.model";

/**
 * Sistema de permissões granulares
 */
export enum Permission {
  // Posts
  POST_CREATE = "post:create",
  POST_READ = "post:read",
  POST_UPDATE_OWN = "post:update:own",
  POST_UPDATE_ANY = "post:update:any",
  POST_DELETE_OWN = "post:delete:own",
  POST_DELETE_ANY = "post:delete:any",
  POST_PUBLISH_OWN = "post:publish:own",
  POST_PUBLISH_ANY = "post:publish:any",
  // Users
  USER_CREATE = "user:create",
  USER_READ_OWN = "user:read:own",
  USER_READ_ANY = "user:read:any",
  USER_UPDATE_OWN = "user:update:own",
  USER_UPDATE_ANY = "user:update:any",
  USER_DELETE_ANY = "user:delete:any",
  USER_LIST = "user:list",
}

/**
 * Mapeamento de roles para permissões
 */
const rolePermissions: Record<UserRole, Permission[]> = {
  ADMIN: [
    // Todas as permissões
    Permission.POST_CREATE,
    Permission.POST_READ,
    Permission.POST_UPDATE_ANY,
    Permission.POST_DELETE_ANY,
    Permission.POST_PUBLISH_ANY,
    Permission.USER_CREATE,
    Permission.USER_READ_ANY,
    Permission.USER_UPDATE_ANY,
    Permission.USER_DELETE_ANY,
    Permission.USER_LIST,
  ],
  AUTHOR: [
    Permission.POST_CREATE,
    Permission.POST_READ,
    Permission.POST_UPDATE_OWN,
    Permission.POST_DELETE_OWN,
    Permission.POST_PUBLISH_OWN,
    Permission.USER_READ_OWN,
    Permission.USER_UPDATE_OWN,
  ],
};

/**
 * Verifica se o usuário tem as permissões necessárias
 */
export const hasPermission = (
  userRole: UserRole,
  requiredPermissions: Permission[],
): boolean => {
  const userPermissions = rolePermissions[userRole] || [];
  return requiredPermissions.every((permission) =>
    userPermissions.includes(permission),
  );
};

/**
 * Middleware para verificar permissões
 */
export const permissionMiddleware = (requiredPermissions: Permission[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return sendError(res, "Usuário não autenticado", 401);
    if (!hasPermission(req.user.role, requiredPermissions)) {
      return sendError(
        res,
        "Você não tem permissão para executar esta ação",
        403,
      );
    }

    next();
  };
};
