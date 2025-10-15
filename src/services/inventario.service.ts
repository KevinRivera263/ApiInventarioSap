import sql from 'mssql';
import { sqlConfig } from '../config/db.js';

export type DynamicRow = Record<string, unknown>;

export interface InventarioMeta {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface InventarioResponse<T = DynamicRow> extends InventarioMeta {
  data: T[];
}

/* 
    Aqui se ejecuta el SP [dbo].[sp_ApiInventario_Consolidado] de la base de datos SAP_DB 
    Respetara todas aquellas columnas que vengan y las mapeara dinamicamente en la respuesta JSON
*/
export async function getInventario(params: {
  page?: number | string;
  limit?: number | string;
  buscar?: string | null;
  bodega?: number | string | null;
}): Promise<InventarioResponse> {
  // Sanitización suave de parámetros
  const page = Math.max(1, Number(params.page ?? 1));
  const limit = Math.max(1, Number(params.limit ?? 100));
  const buscar = params.buscar?.toString().trim() || null;

  // En caso que la Bodega puede venir como string; normalizamos a número o null
  // Esto si llega a cambiar en un futuro, solo es necesario realizar el cambio en el sp para que permita valores varchar
  const bodega =
    params.bodega === null || params.bodega === undefined || params.bodega === ''
      ? null
      : Number(params.bodega);

  try {
    const pool = await sql.connect(sqlConfig);

    //const result = await pool
    //const result: sql.IResult<any> = await pool.request()
     const result: sql.IProcedureResult<any> = await pool.request()
      .input('Page', sql.Int, page)
      .input('Limit', sql.Int, limit)
      .input('Buscar', sql.NVarChar(100), buscar) // Datos son opcionales por si se requieren
      .input('Bodega', sql.Int, bodega)           // Buscar y bodega
      .execute('dbo.sp_ApiInventario_Consolidado'); 

    // El SP devuelve 2 recordsets
    // 0: Metadatos de paginación (una sola fila)
    // 1: Datos paginados (n filas, columnas dinámicas)
   const rs = Array.isArray(result.recordsets)
            ? result.recordsets
            : Object.values(result.recordsets);

    const metaRS = rs[0] ?? [];
    const dataRS = (rs[1] as DynamicRow[] | undefined) ?? [];

    const metaRow = (metaRS[0] || {}) as Partial<InventarioMeta>;

    // Armamos respuesta garantizando defaults si el el sp cambia al agregar mas columnas 
    const response: InventarioResponse = {
      page: Number(metaRow.page ?? page),
      limit: Number(metaRow.limit ?? limit),
      totalRecords: Number(metaRow.totalRecords ?? dataRS.length ?? 0),
      totalPages: Number(metaRow.totalPages ?? 1),
      hasNextPage: Boolean(metaRow.hasNextPage ?? false),
      hasPreviousPage: Boolean(metaRow.hasPreviousPage ?? page > 1),
      data: dataRS,
    };

    return response;
  } catch (err) {
    // Log error hacia capas superiores
    const message =
      err instanceof Error ? err.message : 'Error desconocido ejecutando el SP';
    throw new Error(`InventarioService.getInventario: ${message}`);
  }
}
