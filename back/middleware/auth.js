const jwt = require("jsonwebtoken")

function auth(req, res, next) {
const header = req.header("Authorization");
if (header == null) return res.status(403).send({ message: "Invalid" });

const token = header.split(" ")[1];
if (token == null) return res.status(403).send({ message: "Token cannot be null" });

jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => {
if (err) return res.status(403).send({ message: "Token invalid" + err });
req.user = decoded;
next();
});
}

module.exports = { auth }