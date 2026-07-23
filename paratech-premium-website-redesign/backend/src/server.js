// Ponto de entrada: carrega o .env, sobe o servidor HTTP.
import "dotenv/config";
import { createApp } from "./app.js";

const app = createApp();
const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Paratech backend rodando em http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
});
