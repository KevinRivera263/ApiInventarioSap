import { Router } from 'express';
import type { Request, Response } from 'express';
import pkgJwt from 'jsonwebtoken';
const jwt = (pkgJwt as any).default ?? pkgJwt;
import type { JwtPayload, SignOptions, Secret } from 'jsonwebtoken';
import { Buffer } from 'node:buffer';



import { findClient } from '../core/clients.js';


const router = Router();

/**
 * POST /auth/token
 * Obtiene un JWT usando grant "client_credentials".
 * Acepta:
 *  Basic Auth: Authorization: Basic base64(client_id:client_secret)
 *  Body JSON: { "client_id": "...", "client_secret": "..." }
 */
router.post('/token', (req: Request, res: Response) => {
  let clientId = '';
  let clientSecret = '';

  // 1) Soporta Basic Auth o body JSON
  const auth = req.headers.authorization;
  if (auth?.startsWith('Basic ')) {
    const tokenBasic = (auth.split(' ')[1] ?? '').trim();
    if (!tokenBasic) {
      return res.status(400).json({ error: 'invalid_request', detail: 'Authorization Basic requerido' });
    }
    try {
      const decoded = Buffer.from(tokenBasic, 'base64').toString('utf8');
      const [id, sec] = decoded.split(':');
      clientId = (id ?? '').trim();
      clientSecret = (sec ?? '').trim();
    } catch {
      return res.status(400).json({ error: 'invalid_request', detail: 'Basic token malformado' });
    }
  } else {
    clientId = String(req.body?.client_id ?? '').trim();
    clientSecret = String(req.body?.client_secret ?? '').trim();
  }

  if (!clientId || !clientSecret) {
    return res.status(400).json({ error: 'invalid_request', detail: 'client_id y client_secret requeridos' });
  }

  // Valida el cliente contra la lista permitida (desde .env AUTH_CLIENTS_JSON)
  const client = findClient(clientId);
  if (!client || client.secret !== clientSecret) {
    return res.status(401).json({ error: 'invalid_client' });
  }

  // Construye y firma el JWT
  const secret: Secret = (process.env.JWT_SECRET || 'secretoTemporal') as Secret;
  const issuer = process.env.JWT_ISSUER || 'ApiInventarioSAP';
  const audience = process.env.JWT_AUDIENCE || 'ProveedorExterno';
  const expiresIn = process.env.TOKEN_EXPIRES_IN || '2h'; // si se requiere que no expire, comentarear

  const payload: JwtPayload = {
    sub: client.id,
    scope: client.scopes ?? ['inventario:read'],
    app: 'ApiInventarioSAP',
  };

  const token = jwt.sign(payload, secret, {
    issuer,
    audience,
    expiresIn, // SI se requiere que no expire, comentarear
  } as SignOptions);

  // Respuesta estilo OAuth2
  return res.json({
    access_token: token,
    token_type: 'Bearer',
    expires_in:
      typeof expiresIn === 'string' && expiresIn.endsWith('h')
        ? Number(expiresIn.replace('h', '')) * 3600
        : 3600, 
    scope: (client.scopes ?? []).join(' '),
  });
});

export default router;
