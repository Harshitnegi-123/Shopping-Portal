import jwt from 'jsonwebtoken';

const verifytoken = (req, res, next) => {

    const authHeader = req.headers.authorization
    console.log("Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Header does not exist" })
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoder = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoder
        next()
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" })
    }
}

export default verifytoken;
