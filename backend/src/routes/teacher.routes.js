// 1. Impor middleware authJwt agar variabel authJwt tidak undefined
const authJwt = require("../middleware/authJwt");
const controller = require("../controllers/teacher.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      // Tambahkan 'Authorization' ke dalam header yang diizinkan
      "Authorization, x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Get Profile (Hanya bisa diakses jika token valid)
  // Middleware [authJwt.verifyToken] sekarang sudah bisa terbaca
  app.get(
    "/api/teacher/profile",
    [authJwt.verifyToken],
    controller.getTeacherProfile
  );

  // Update Profile
  app.put(
    "/api/teacher/profile",
    [authJwt.verifyToken],
    controller.updateTeacherProfile
  );
};