import jwt from 'jsonwebtoken';

// Token configuration
const maxAge = 1 * 24 * 60 * 60; 

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    });
}

export default { createToken, maxAge }