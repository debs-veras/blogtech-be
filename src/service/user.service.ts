import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@config/constants";
import {
  registerSchema,
  RegisterInput,
  UpdateUserInput,
  UserFilterInput,
} from "@schemas/auth.schema";
import { UserRepository } from "repositories/user.repository";

export class UserService {
  // Listar todos os usuários (com filtros opcionais)
  static async getAllUsers(filters?: UserFilterInput) {
    return UserRepository.getAll(filters);
  }

  // Buscar usuário por ID
  static async getUserById(id: string) {
    const user = await UserRepository.findById(id);
    if (!user) throw { statusCode: 404, message: "Usuário não encontrado" };
    return user;
  }

  // Criar usuário
  static async createUser(data: RegisterInput) {
    // Valida usando schema
    const parsed = registerSchema.parse(data);
    // Verifica se email já existe
    const existingUser = await UserRepository.findByEmail(parsed.email);
    if (existingUser)
      throw { statusCode: 400, message: "Email já está em uso" };
    // Criptografa senha
    const hashedPassword = await bcrypt.hash(parsed.password, 10);
    const newUser = await UserRepository.create({
      ...parsed,
      password: hashedPassword,
    });

    return newUser;
  }

  // Atualizar usuário (sem alterar senha)
  static async updateUser(id: string, data: UpdateUserInput) {
    const user = await UserRepository.findById(id);
    if (!user) throw { statusCode: 404, message: "Usuário não encontrado" };
    // Evita atualizar email para um já existente
    if (data.email && data.email !== user.email) {
      const existingUser = await UserRepository.findByEmail(data.email);
      if (existingUser)
        throw { statusCode: 400, message: "Email já está em uso" };
    }
    return UserRepository.update(id, data);
  }

  // Deletar usuário
  static async deleteUser(id: string) {
    const user = await UserRepository.findById(id);
    if (!user) throw { statusCode: 404, message: "Usuário não encontrado" };
    return UserRepository.delete(id);
  }

  // Login
  static async login(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw { statusCode: 401, message: "Credenciais inválidas" };
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches)
      throw { statusCode: 401, message: "Credenciais inválidas" };
    if (!JWT_SECRET) throw { statusCode: 500, message: "JWT não configurado" };
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });
    // Retorna token e dados do usuário (sem a senha)
    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  }
}
