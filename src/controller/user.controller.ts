import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../util/response";
import { UserService } from "../service/user.service";
import {
  loginSchema,
  registerSchema,
  updateUserSchema,
  userFilterSchema,
} from "@schemas/auth.schema";
import { blacklistToken } from "../middleware/token-blacklist.middleware";

export class UserController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = loginSchema.parse(req.body);
      const { token, user } = await UserService.login(
        parsed.email,
        parsed.password,
      );
      return sendSuccess(res, "Login realizado com sucesso", { token, user });
    } catch (err) {
      next(err);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader) {
        const token = authHeader.split(" ")[1];
        if (token) {
          // Adiciona o token à blacklist
          blacklistToken(token);
        }
      }

      return sendSuccess(res, "Logout realizado com sucesso", null);
    } catch (err) {
      next(err);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = userFilterSchema.parse(req.query);
      const users = await UserService.getAllUsers(filters);
      return sendSuccess(res, "Lista de usuários", users);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      if (!id || Array.isArray(id))
        return next({ statusCode: 400, message: "ID inválido" });

      const user = await UserService.getUserById(id);
      return sendSuccess(res, "Usuário encontrado", user);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = registerSchema.parse(req.body);
      const user = await UserService.createUser(parsed);
      return sendSuccess(res, "Usuário criado com sucesso", user);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      if (!id || Array.isArray(id))
        return next({ statusCode: 400, message: "ID inválido" });
      const parsed = updateUserSchema.parse(req.body);
      const user = await UserService.updateUser(id, parsed);
      return sendSuccess(res, "Dados atualizados com sucesso", user);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      if (!id || Array.isArray(id))
        return next({ statusCode: 400, message: "ID inválido" });
      const user = await UserService.deleteUser(id);
      return sendSuccess(res, "Usuário deletado com sucesso", user);
    } catch (err) {
      next(err);
    }
  }
}
