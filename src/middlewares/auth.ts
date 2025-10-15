// import type { Request, Response, NextFunction } from 'express';
// import * as jwt from 'jsonwebtoken';

// export interface AuthenticatedRequest extends Request {
//   user?: any;
// }

// export const verifyToken = (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ): void => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     res.status(401).json({ message: 'Token no proporcionado' });
//     return;
//   }

//   try {
//     const secret = process.env.JWT_SECRET || '24a77392869656e3dc95eeabd44d2235';
//     const decoded = jwt.verify(token, secret) as jwt.JwtPayload | string;
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(403).json({ message: 'Token inválido o expirado' });
//   }
// };
import type { Request, Response, NextFunction } from 'express';
import pkgJwt from 'jsonwebtoken';
const jwt = (pkgJwt as any).default ?? pkgJwt;

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Token no proporcionado' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || 'secretoTemporal';

    const decoded = jwt.verify(token, secret, {
      algorithms: ['HS256'],
      issuer: process.env.JWT_ISSUER || 'ApiInventarioSAP',
      audience: process.env.JWT_AUDIENCE || 'ProveedorExterno',
    });

    req.user = decoded;
    next();
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[JWT VERIFY ERROR]', msg);
    res.status(403).json({ message: 'Token inválido o expirado' });
  }
};
