import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decodedToken.id;

            next();
        } catch (err) {
            return res.status(400).json({ error: 'Invalid Token' });
        }
    } else {
        return res.status(401).json({ error: 'No token found' });
    }
};

export default verifyToken;
