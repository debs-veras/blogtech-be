import express from "express";
import "dotenv/config";
import cors from "cors";
import path from "path";
import routes from "./routes";
import { errorMiddleware } from "middleware/error.middleware";
// cria a app express com tipo explícito
const app = express();
app.use(express.json());
// middlewares globais
app.use(cors());
// servir arquivos estáticos da pasta uploads
// Caminho absoluto para garantir que funcione com tsx
const uploadsPath = path.join(process.cwd(), "uploads");
// Log de requisições para uploads
app.use("/uploads", (req, res, next) => {
  next();
});

app.use("/uploads", express.static(uploadsPath));

// registra rotas
app.use("/", routes);

// middleware de erro deve ser registrado DEPOIS das rotas
app.use(errorMiddleware);

export default app;
