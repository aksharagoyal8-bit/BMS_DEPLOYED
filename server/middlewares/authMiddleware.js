const jwt = require("jsonwebtoken");

module.exports = function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
       

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.send({ success: false, message: "No token provided" });
        }

        const token = authHeader.split(' ')[1];
        const verifiedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        req.user = { userId: verifiedUser.userID }; 
        next();
    } catch(err) {
        console.log("JWT ERROR:", err.message);
        res.send({ success: false, message: "Unauthorized User" });
    }
}