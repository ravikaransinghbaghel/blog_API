import jwt from 'jsonwebtoken';

export const forgetPasswordToken = (req, res, next) => {

    const token = req.cookies.forgetPasswordToken;

    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.isAdmin_id = decoded.id;
        // console.log('token_id ', req.isAdmin_id);

        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};
