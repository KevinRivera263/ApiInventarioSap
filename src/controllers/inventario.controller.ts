import type { Request, Response } from 'express';
import { getInventario } from '../services/inventario.service.js';

export async function obtenerInventario(req: Request, res: Response): Promise<void> {
    try {
    const { page, limit, buscar, bodega } = req.query;

    const params = {
        ...(typeof page === 'string'  ? { page }   : {}),
        ...(typeof limit === 'string' ? { limit }  : {}),
        ...(typeof buscar === 'string' && buscar.trim() !== '' ? { buscar } : {}),
           //Actualmente se maneja númerico en sp pero se contempla que en un futuro las bodegas se manejen alfanumerico
        ...(typeof bodega === 'string' && bodega.trim() !== '' ? { bodega } : {}), 
    };

    const resp = await getInventario(params);
    res.json(resp);
    } catch (err) {
    const detail = err instanceof Error ? err.message : 'Error desconocido';
    res.status(500).json({ message: 'Error al consultar inventario', detail });
    }
}
