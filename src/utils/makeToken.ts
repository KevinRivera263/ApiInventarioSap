import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env.parametrosDB') });

const secret = process.env.JWT_SECRET || '24a77392869656e3dc95eeabd44d2235';
const token = jwt.sign(
  { sub: 'tester', app: 'ApiInventarioSAP' }, // payload de prueba
  secret,
  { expiresIn: '1h' }
);

console.log(token);
