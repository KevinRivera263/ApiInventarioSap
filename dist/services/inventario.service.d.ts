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
export declare function getInventario(params: {
    page?: number | string;
    limit?: number | string;
    buscar?: string | null;
    bodega?: number | string | null;
}): Promise<InventarioResponse>;
//# sourceMappingURL=inventario.service.d.ts.map