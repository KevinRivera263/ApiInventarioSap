import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import inventarioRoutes from './routes/inventario.routes.js';
// __dirname para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Cargar .env.parametrosDB (Si no viene el puerto, por default queda el tipico 3000)
dotenv.config({ path: path.resolve(__dirname, '../.env.parametrosDB') });
const app = express();
app.use(express.json());
// Healthcheck para nuestro futuro PRTG :v
app.get('/health', (_req, res) => res.json({ ok: true }));
// Rutas protegidas
app.use('/api', inventarioRoutes);
const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
    console.log(`API iniciada en http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map