const { authJwt } = require("../middleware");
const controller = require("../controllers/teacher.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Get Profile (Hanya bisa diakses jika punya token)
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