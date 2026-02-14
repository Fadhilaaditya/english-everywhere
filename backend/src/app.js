const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/event.routes");
const uploadRoutes = require("./routes/upload.routes");
const teacherScheduleRoutes = require("./routes/teacherSchedule.routes");

const app = express();

// ==============================
// 1. MIDDLEWARE
// ==============================
app.use(cors());
app.use(morgan("dev")); // Log request ke terminal
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Folder statis untuk gambar
app.use("/uploads", express.static("uploads"));

// ==============================
// 2. ROUTES REGISTRATION
// ==============================

// Menggunakan Router Object
app.use("/api/teacher-schedules", teacherScheduleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/upload", uploadRoutes);

// Menggunakan pola Factory Function (app)
require("./routes/program.routes")(app);
require("./routes/article.routes")(app);
require("./routes/student.routes")(app);
require("./routes/user.routes")(app);
require("./routes/teacher.routes")(app);

// Root Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the English Everywhere Backend API" });
});

// Middleware 404 (Route tidak ditemukan)
app.use((req, res, next) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan!" });
});

// ==============================
// 3. ERROR HANDLING (Global)
// ==============================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Terjadi kesalahan pada server!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

module.exports = app;
