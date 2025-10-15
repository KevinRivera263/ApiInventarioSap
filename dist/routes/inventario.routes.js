import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.js';
import { obtenerInventario } from '../controllers/inventario.controller.js';
const router = Router();
//Ejemplo de como seria GET /api/inventario?page=1&limit=5&buscar=botella&bodega=4
//El token de momento lo manejaremos sin tiempo de venciomiento 
router.get('/inventario', verifyToken, obtenerInventario);
export default router;
//# sourceMappingURL=inventario.routes.js.map