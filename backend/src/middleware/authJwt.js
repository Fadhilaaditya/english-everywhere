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

const isAdmin = (req, res, next) => {
  if (req.userRole === "admin") {
    next();
    return;
  }
  return res.status(403).send({ message: "Require Admin Role!" });
};

const isTeacher = (req, res, next) => {
  if (req.userRole === "teacher" || req.userRole === "admin") {
    next();
    return;
  }
  return res.status(403).send({ message: "Require Teacher Role!" });
};

const isOwnerOrAdmin = (req, res, next) => {
  // Jika admin, izinkan langsung
  if (req.userRole === "admin") {
    next();
    return;
  }

  // Jika id di params sama dengan id di token, izinkan
  // ParseInt digunakan karena req.params.id adalah string sedangkan req.userId adalah number
  if (req.params.id && parseInt(req.params.id) === req.userId) {
    next();
    return;
  }

  return res.status(403).send({ message: "Require Admin Role or Ownership!" });
};

module.exports = { verifyToken, isAdmin, isTeacher, isOwnerOrAdmin };