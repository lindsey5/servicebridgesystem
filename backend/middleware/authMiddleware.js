import jwt from 'jsonwebtoken';
import Client_account from '../models/client-account.js';
import Provider_account from '../models/provider-account.js';

export const clientRequireAuth = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decodedToken.id;
            
            const provider = await Client_account.findByPk(decodedToken.id);
            if (provider) {
               return next();
            }
            return res.status(401).json({ error: 'No token found' });

       } catch (error) {
            return res.status(401).json({ error: 'No token found' });
       }
    } else {
        // No token found in cookies
        return res.status(401).json({ error: 'No token found' });
    }
};

export const providerRequireAuth = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decodedToken.id;
            const provider = await Provider_account.findByPk(decodedToken.id);
            if (provider) {
               return next();
            }
            return res.status(401).json({ error: 'No token found' });
       } catch (error) {
            return res.status(401).json({ error: 'No token found' });
       }
    } else {
        // No token found in cookies
        return res.status(401).json({ error: 'No token found' });
    }
};

export default { clientRequireAuth, providerRequireAuth };