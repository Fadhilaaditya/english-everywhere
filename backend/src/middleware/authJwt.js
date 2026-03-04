const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  // Menangani format "Bearer <token>"
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id; // Simpan id user ke request agar bisa dipakai di controller
    req.userRole = decoded.role;
    next();
  });
};

module.exports = { verifyToken };