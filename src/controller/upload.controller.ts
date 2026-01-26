import { Request, Response } from "express";
import { sendSuccess, sendError } from "../util/response";

export class UploadController {
  async upload(req: Request, res: Response) {
    try {
      if (!req.file) {
        return sendError(res, "Nenhuma imagem foi enviada", 400);
      }

      const imageUrl = `/uploads/${req.file.filename}`;

      return sendSuccess(res, "Upload realizado com sucesso", {
        url: imageUrl,
      });
    } catch (error: any) {
      console.error(error);
      return sendError(res, "Erro ao fazer upload da imagem");
    }
  }
}
