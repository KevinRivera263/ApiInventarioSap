import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env.parametrosDB') });

export interface AuthClient { id: string; secret: string; scopes?: string[]; }

export function getClients(): AuthClient[] {
  const raw = process.env.AUTH_CLIENTS_JSON || '[]';
  try { return JSON.parse(raw) as AuthClient[]; } catch { return []; }
}

export function findClient(id: string): AuthClient | undefined {
  return getClients().find(c => c.id === id);
}
