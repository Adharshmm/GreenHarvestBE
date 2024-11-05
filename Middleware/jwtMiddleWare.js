const jwt = require("jsonwebtoken")
const jwtMiddleware = (req, res, next) => {
    console.log('inside jwt middleware');
    if (!req.headers['authorization']) {
        res.status(401).json('Authorization faild please login');
    }
    const token = req.headers['authorization'].split(' ')[1];
    console.log(token)
    try {
        const jwtResponse = jwt.verify(token, `${process.env.JWT_SECRET}`)
        req.payload = jwtResponse.role;
        req.userRole = jwtResponse.id; 
        next()
    } catch (error) {
        console.error(error)
        res.status(401).json('Authorization faild please login');
    }
}
module.exports = jwtMiddleware