import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

function verifyTokenMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token is not valid" });
        }
        req.user = user; 
        next();
    });
}

export default verifyTokenMiddleware;