import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import inventarioRoutes from './routes/inventario.routes.js';
import authRoutes from './routes/auth.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env.parametrosDB (Si no viene configurado el puerto, por default queda en el puerto 3001)
dotenv.config({ path: path.resolve(__dirname, '../.env.parametrosDB') });

const app = express();
app.use(express.json());

// Healthcheck para nuestro futuro PRTG :v
app.get('/health', (_req, res) => res.json({ ok: true }));

// Rutas....

app.use('/api', inventarioRoutes); //Api inventario
app.use('/auth', authRoutes);   //Tokens JWT


const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, () => {
  console.log(`API iniciada en http://localhost:${PORT}`);
});
