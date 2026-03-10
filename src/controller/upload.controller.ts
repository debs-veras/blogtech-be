import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../util/response";

export class UploadController {
  static async upload(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) 
        return next({ statusCode: 400, message: "Nenhuma imagem foi enviada" });
      
      const baseUrl = process.env.APP_BASE_URL ?? `${req.protocol}://${req.get("host")}`;
      const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
      const imageUrl = `${normalizedBaseUrl}/uploads/${req.file.filename}`;

      return sendSuccess(res, "Upload realizado com sucesso", {
        url: imageUrl,
      });
      
    } catch (error) {
      next(error);
    }
  }
}
