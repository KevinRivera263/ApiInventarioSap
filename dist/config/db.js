import sql from 'mssql';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Cargar variables desde parametrosDB
dotenv.config({ path: path.resolve(__dirname, '../../.env.parametrosDB') });
export const sqlConfig = {
    user: process.env.MSSQL_USER,
    password: process.env.MSSQL_PASS,
    database: process.env.MSSQL_DB,
    server: process.env.MSSQL_SERVER,
    options: {
        encrypt: String(process.env.MSSQL_ENCRYPT).toLowerCase() === 'false',
        trustServerCertificate: String(process.env.MSSQL_TRUSTCERT).toLowerCase() === 'false',
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000, //Aumenta este vaor en caso que el servidor este muy lento 
    },
};
//# sourceMappingURL=db.js.map