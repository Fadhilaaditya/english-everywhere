const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Import Routes (untuk yang menggunakan express.Router())
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/event.routes");
const uploadRoutes = require("./routes/upload.routes");
const teacherScheduleRoutes = require("./routes/teacherSchedule.routes");

const app = express();

// ==============================
// 1. MIDDLEWARE
// ==============================
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder untuk akses gambar hasil upload (jika ada)
app.use("/uploads", express.static("uploads"));

// ==============================
// 2. ROUTES REGISTRATION
// ==============================

// Route Utama Jadwal Guru (Teacher Schedule)
app.use("/api/teacher-schedules", teacherScheduleRoutes);

// Route Auth & General
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/upload", uploadRoutes);

// Route yang menggunakan pola require(path)(app)
// Pastikan file-file di bawah ini ekspornya adalah: module.exports = app => { ... }
require("./routes/program.routes")(app);
require("./routes/article.routes")(app);
require("./routes/student.routes")(app);
require("./routes/user.routes")(app);
require("./routes/teacher.routes")(app); // Tambahkan ini agar endpoint /api/teachers aktif

// Root Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the English Everywhere Backend API" });
});

// ==============================
// 3. ERROR HANDLING
// ==============================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: err.message,
  });
});

module.exports = app;
