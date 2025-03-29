const jwt = require("jsonwebtoken");

const verifyUserFromToken = async (token) => {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return user;
}

const verifyUser = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    try {
        const user = await verifyUserFromToken(token);
        req.user = user;
        next();
    } catch (err) {
        console.error("Error in verifyUser: ", err);
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
}

module.exports = {
    verifyUser,
    verifyUserFromToken
};