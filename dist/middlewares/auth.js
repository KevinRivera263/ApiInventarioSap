import * as jwt from 'jsonwebtoken';
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Token no proporcionado' });
        return;
    }
    try {
        const secret = process.env.JWT_SECRET || 'EsUnSecretoTuMirdadaYLaMia';
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(403).json({ message: 'Token inválido o expirado' });
    }
};
//# sourceMappingURL=auth.js.map