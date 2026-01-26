import { Request, Response, NextFunction } from "express";

/**
 * Middleware para auditoria de acessos
 * Registra tentativas de acesso (autorizadas e negadas)
 */

export const auditMiddleware = (action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id || "anônimo";
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.socket.remoteAddress;
    const method = req.method;
    const path = req.originalUrl;

    // Log da tentativa de acesso
    console.log(
      JSON.stringify({
        timestamp,
        action,
        userId,
        ip,
        method,
        path,
        userAgent: req.headers["user-agent"],
      }),
    );

    // Interceptar a resposta para logar o resultado
    const originalSend = res.send;
    res.send = function (data: any) {
      console.log(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          action,
          userId,
          statusCode: res.statusCode,
          success: res.statusCode < 400,
        }),
      );
      return originalSend.call(this, data);
    };

    next();
  };
};
