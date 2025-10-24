const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        
        if (!token) {
            return res.status(401).json({ 
                error: 'Acceso denegado. Token no proporcionado.' 
            });
        }

        // Remover "Bearer " del token si está presente
        const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
        
        const verified = jwt.verify(actualToken, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ 
            error: 'Token inválido o expirado.' 
        });
    }
};

module.exports = authMiddleware;