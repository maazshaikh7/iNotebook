var jwt = require('jsonwebtoken');
const JWT_SECRET = 'Harryisagoodb$oy';

const fetchuser = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Ends up here with auth-token heading unchecked" })
    }
    try {
        user = {
            id: user.id
        }
        const data = jwt.verify(token, JWT_SECRET);
        const id = data.iat
        req.user = id;
        next();
    } catch (error) {
        res.status(401).send({ error: "Always ends up here somehow"})
    }

}


module.exports = fetchuser;