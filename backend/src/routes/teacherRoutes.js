const authJwt = require("../middleware/authJwt");
const controller = require("../controllers/teacherController");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, x-access-token, Origin, Content-Type, Accept",
    );
    next();
  });

  // Rute untuk Guru (Profile)
  app.get(
    "/api/teacher/profile",
    [authJwt.verifyToken],
    controller.getTeacherProfile,
  );
  app.put(
    "/api/teacher/profile",
    [authJwt.verifyToken],
    controller.updateTeacherProfile,
  );

  // Rute Umum/Admin
  app.get("/api/teachers", [authJwt.verifyToken, authJwt.isAdmin], controller.findAll);
};
