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
      console.log(`[AUTH] Token Verification Failed: ${err.message}`);
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id; 
    let role = decoded.role ? String(decoded.role).toLowerCase().trim() : '';
    req.userRole = role;
    console.log(`[AUTH] UserID: ${req.userId}, Role: "${req.userRole}"`);
    next();
  });
};

const isAdmin = (req, res, next) => {
  const role = String(req.userRole || '').toLowerCase().trim();
  console.log(`[AUTH] isAdmin Check role: "${role}"`);
  
  if (role === "admin" || role === "superadmin" || role.includes("admin")) {
    console.log(`[AUTH] isAdmin Check PASSED`);
    next();
    return;
  }
  console.log(`[AUTH] isAdmin Check FAILED`);
  return res.status(403).send({ message: "Require Admin Role!" });
};

const isTeacher = (req, res, next) => {
  if (req.userRole === "teacher" || req.userRole === "admin" || req.userRole === "superadmin") {
    next();
    return;
  }
  return res.status(403).send({ message: "Require Teacher Role!" });
};

const isOwnerOrAdmin = (req, res, next) => {
  // Jika admin atau superadmin, izinkan langsung
  if (req.userRole === "admin" || req.userRole === "superadmin") {
    next();
    return;
  }

  // Jika id di params sama dengan id di token, izinkan
  if (req.params.id && parseInt(req.params.id) === req.userId) {
    next();
    return;
  }

  return res.status(403).send({ message: "Require Admin Role or Ownership!" });
};

module.exports = { verifyToken, isAdmin, isTeacher, isOwnerOrAdmin };