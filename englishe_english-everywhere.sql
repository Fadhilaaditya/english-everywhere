-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 08 Mar 2026 pada 14.10
-- Versi server: 11.4.10-MariaDB
-- Versi PHP: 8.4.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `englishe_english-everywhere`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `appointment_bookings`
--

CREATE TABLE `appointment_bookings` (
  `id` int(11) NOT NULL,
  `applicantName` varchar(255) NOT NULL,
  `applicantGender` varchar(255) DEFAULT NULL,
  `applicantAddress` text DEFAULT NULL,
  `applicantFather` varchar(255) DEFAULT NULL,
  `applicantMother` varchar(255) DEFAULT NULL,
  `applicantBirthPlace` varchar(255) DEFAULT NULL,
  `applicantBirthDate` date DEFAULT NULL,
  `applicantPhone` varchar(255) DEFAULT NULL,
  `applicantEmail` varchar(255) DEFAULT NULL,
  `status` enum('PENDING','BOOKED','REJECTED','ACCEPTED') NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `scheduleId` int(11) DEFAULT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `appointment_bookings`
--

INSERT INTO `appointment_bookings` (`id`, `applicantName`, `applicantGender`, `applicantAddress`, `applicantFather`, `applicantMother`, `applicantBirthPlace`, `applicantBirthDate`, `applicantPhone`, `applicantEmail`, `status`, `createdAt`, `updatedAt`, `scheduleId`, `isRead`) VALUES
(1, 'Adit', 'Male', 'Bintaro', '-', '-', 'Jakarta', '2026-03-07', '62895337881781', 'fadhilaaditya@gmail.com', 'ACCEPTED', '2026-03-07 06:30:34', '2026-03-07 06:54:28', 36, 1),
(2, 'Davin', 'Male', 'Bintaro', '-', '-', 'Tangerang', '2026-03-07', '12312313', 'davin@gmail.com', 'REJECTED', '2026-03-07 06:33:10', '2026-03-07 06:36:54', 36, 0),
(3, 'a', 'Male', 'a', 'a', 'a', 'a', '2026-03-07', '1231412', 'a@gmail.com', 'ACCEPTED', '2026-03-07 06:37:40', '2026-03-07 07:42:19', 36, 1),
(4, 'b', 'Male', 'b', 'b', 'b', 'b', '2026-03-07', '4123141', 'b@gmail.com', 'ACCEPTED', '2026-03-07 06:38:25', '2026-03-07 07:42:08', 36, 1);

-- --------------------------------------------------------

--
-- Struktur dari tabel `articles`
--

CREATE TABLE `articles` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `intro` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`intro`)),
  `sections` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`sections`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `articles`
--

INSERT INTO `articles` (`id`, `title`, `description`, `image`, `intro`, `sections`, `createdAt`, `updatedAt`) VALUES
(1, '5 Tips Seru untuk Belajar Bahasa Inggris di Rumah', 'Mencari cara agar anak-anak tetap semangat belajar? Kami merangkum 5 tips dan trik yang bisa Anda terapkan di rumah dengan mudah dan menyenangkan', 'https://res.cloudinary.com/dosfggbxu/image/upload/v1769400255/english-everywhere/thumbnails/xrxw7sib2qg2drn3sgro.png', '[\"Belajar Bahasa Inggris tidak harus selalu membosankan dengan buku tebal atau hafalan grammar. Dengan sedikit kreativitas, Anda bisa mengubah rumah menjadi sekolah Bahasa Inggris pribadi yang menyenangkan.\",\"Berikut adalah 5 tips seru dari English Everywhere agar proses belajar Anda di rumah lebih efektif dan menyenangkan:\"]', '[{\"title\":\"1. Ubah Media Hiburan Anda Menjadi Kelas Bahasa Inggris\",\"text\":\"Alihkan kebiasaan menonton atau mendengarkan Anda sepenuhnya ke dalam Bahasa Inggris. Ini adalah cara paling efektif untuk melatih listening skill dan memperkaya kosakata secara kontekstual.\"},{\"title\":\"2. Labeli Benda-Benda di Rumah\",\"text\":\"Tempelkan sticky note pada benda-benda di sekitar rumah dengan nama bahasa Inggrisnya. Misalnya \'Refrigerator\', \'Mirror\', \'Wardrobe\'. Ini membantu mengingat vocabulary sehari-hari tanpa terasa sedang belajar.\"},{\"title\":\"3. Biasakan Self-Talk dalam Bahasa Inggris\",\"text\":\"Cobalah untuk menarasikan kegiatan Anda sehari-hari dalam bahasa Inggris. \'I am making coffee now\', \'I need to find my keys\'. Ini melatih kelancaran berbicara dan berpikir dalam bahasa Inggris.\"}]', '2025-12-25 14:37:46', '2026-01-26 04:04:19'),
(2, 'Kapan Menggunakan \'A\' dan \'An\'?', 'Bingung mengajarkan penggunaan articles? Ini penjelasan sederhana dengan contoh yang mudah diingat si kecil.', 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=2000&auto=format&fit=crop', '[\"Penggunaan article \'a\' dan \'an\' seringkali membingungkan bagi pemula. Padahal aturannya cukup sederhana jika kita memahami kuncinya: bunyi awal kata.\",\"Mari kita bahas tuntas kapan harus menggunakan \'a\' dan kapan menggunakan \'an\'.\"]', '[{\"title\":\"1. Gunakan \'A\' untuk Bunyi Konsonan\",\"text\":\"Gunakan \'a\' sebelum kata benda tunggal yang diawali dengan bunyi konsonan. Contoh: a cat, a dog, a university (bunyi \'yu\' adalah konsonan).\"},{\"title\":\"2. Gunakan \'An\' untuk Bunyi Vokal\",\"text\":\"Gunakan \'an\' sebelum kata benda tunggal yang diawali dengan bunyi vokal (a, i, u, e, o). Contoh: an apple, an egg, an hour (huruf \'h\' tidak dibaca).\"}]', '2025-12-25 14:37:46', '2025-12-25 14:37:46'),
(3, 'Pentingnya Dongeng dalam Meningkatkan Kosakata', 'Ketahui mengapa mendengarkan dongeng dalam bahasa Inggris adalah cara terbaik untuk memperkaya vocabulary anak.', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=2000&auto=format&fit=crop', '[\"Mendongeng bukan hanya aktivitas pengantar tidur, tapi juga metode ampuh untuk mengajarkan bahasa Inggris kepada anak-anak.\",\"Melalui cerita, anak-anak belajar kosakata baru dalam konteks yang menyenangkan dan mudah diingat.\"]', '[{\"title\":\"1. Konteks yang Kuat\",\"text\":\"Anak-anak lebih mudah mengingat kata ketika dikaitkan dengan alur cerita dan emosi karakter dalam dongeng.\"},{\"title\":\"2. Pengulangan Alami\",\"text\":\"Dongeng sering menggunakan frasa yang diulang-ulang, membantu penyerapan pola kalimat secara tidak sadar.\"}]', '2025-12-25 14:37:46', '2025-12-25 14:37:46'),
(4, 'Strategi Mengatasi Rasa Malu Berbicara Bahasa Inggris', 'Jangan biarkan rasa takut salah menghalangi kemampuan bicara Anda. Simak tips ampuh untuk membangun kepercayaan diri.', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2000&auto=format&fit=crop', '[\"Banyak orang mengerti bahasa Inggris secara pasif tetapi \'membeku\' saat harus berbicara. Rasa takut salah grammar atau ditertawakan adalah penghalang utama.\",\"Ingatlah bahwa tujuan utama bahasa adalah komunikasi, bukan kesempurnaan. Berikut cara mengatasi mental block tersebut:\"]', '[{\"title\":\"1. Temukan Partner Belajar yang Suportif\",\"text\":\"Cari teman atau komunitas yang sama-sama sedang belajar. Lingkungan yang tidak menghakimi sangat penting untuk membangun keberanian.\"},{\"title\":\"2. Mulai dengan Logat Sendiri\",\"text\":\"Jangan memaksakan diri meniru aksen native speaker di awal jika itu membuat Anda sulit bicara. Fokuslah pada kejelasan pengucapan (pronunciation) terlebih dahulu.\"},{\"title\":\"3. Rekam Suara Sendiri\",\"text\":\"Merekam diri sendiri berbicara membantu Anda mengevaluasi kemajuan secara objektif dan membiasakan diri mendengar suara Anda dalam bahasa Inggris.\"}]', '2025-12-25 14:37:46', '2025-12-25 14:37:46');

-- --------------------------------------------------------

--
-- Struktur dari tabel `classrooms`
--

CREATE TABLE `classrooms` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `capacity` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `classrooms`
--

INSERT INTO `classrooms` (`id`, `name`, `capacity`, `createdAt`, `updatedAt`) VALUES
(1, 'Room A-101', 20, '2026-02-27 14:39:46', '2026-02-27 14:39:46'),
(2, 'Room B-205', 15, '2026-02-27 14:39:46', '2026-02-27 14:39:46'),
(3, 'Online Zoom', 100, '2026-02-27 14:39:46', '2026-02-27 14:39:46');

-- --------------------------------------------------------

--
-- Struktur dari tabel `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `time` varchar(255) NOT NULL,
  `price` varchar(255) NOT NULL,
  `desc` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `events`
--

INSERT INTO `events` (`id`, `title`, `date`, `time`, `price`, `desc`, `location`, `image`, `category`, `createdAt`, `updatedAt`) VALUES
(2, 'English Playdate: Cooking with Friends', '2025-01-15', '19.00 - 20.30 WIB', '25K', 'A relaxed discussion about New Year goals and how to achieve them, conducted in English.', 'Pamulang', '/class2.svg', 'Cooking', '2025-12-25 10:18:39', '2026-01-26 04:24:01'),
(3, 'Holiday Prep: Christmas Carol Karaoke', '2025-01-15', '19.00 - 20.30 WIB', '25K', 'A relaxed discussion about New Year goals and how to achieve them, conducted in English.', 'Pamulang', '/class3.svg', 'Music', '2025-12-25 10:18:39', '2026-01-26 04:24:07'),
(4, 'Speaking Club: New Year Resolutions', '2025-01-15', '19.00 - 20.30 WIB', '25K', 'A relaxed discussion about New Year goals and how to achieve them, conducted in English.', 'Bintaro', '/class4.svg', 'Speaking', '2025-12-25 10:18:39', '2026-01-26 04:24:13'),
(6, 'Grammar Clinic: Present Tenses Mastery', '2024-02-27', '14.00 - 16.00 WIB', 'Free', 'An intensive workshop focusing on the usage of the three main present tenses that often cause confusion.', 'Pamulang', '/class2.svg', 'Workshop', '2025-12-25 10:18:39', '2026-01-26 04:24:20'),
(8, 'English Movie Night: \"The Kings Speech\"', '2024-03-22', '19.30 - 21.30 WIB', '35K', 'A movie screening to practice listening skills, followed by a short discussion.', 'Bintaro', '/class4.svg', 'Entertainment', '2025-12-25 10:18:39', '2026-01-26 04:24:25'),
(11, 'Funtastic Build — Open House English Everywhere', '2026-01-15', '19.00 - 20.30 WIB', 'FREE', 'A relaxed discussion about New Year goals and how to achieve them, conducted in English.', 'Bintaro', '/class1.svg', 'Word Play', '2025-12-25 10:23:35', '2026-01-26 04:24:33'),
(12, 'English Playdate: Cooking with Friends', '2026-01-15', '19.00 - 20.30 WIB', '25K', 'A relaxed discussion about New Year goals and how to achieve them, conducted in English.', 'Ciputat', '/class2.svg', 'Cooking', '2025-12-25 10:23:35', '2026-01-26 04:24:37'),
(13, 'Holiday Prep: Christmas Carol Karaoke', '2026-01-15', '19.00 - 20.30 WIB', '25K', 'A relaxed discussion about New Year goals and how to achieve them, conducted in English.', 'Bintaro', '/class3.svg', 'Music', '2025-12-25 10:23:35', '2026-01-26 04:24:42'),
(14, 'Speaking Club: New Year Resolutions', '2026-01-15', '19.00 - 20.30 WIB', '25K', 'A relaxed discussion about New Year goals and how to achieve them, conducted in English.', 'Pamulang', '/class4.svg', 'Speaking', '2025-12-25 10:23:35', '2026-01-26 04:24:48'),
(16, 'Grammar Clinic: Present Tenses Mastery', '2024-02-27', '14.00 - 16.00 WIB', 'Free', 'An intensive workshop focusing on the usage of the three main present tenses that often cause confusion.', 'Ciputat', '/class2.svg', 'Workshop', '2025-12-25 10:23:35', '2026-01-26 04:24:55'),
(17, 'TOEFL Simulation Test', '2024-03-10', '09.00 - 12.00 WIB', '75K', 'A complete ITP TOEFL simulation exam to measure participants readiness.', 'Bintaro', '/class3.svg', 'Exam', '2025-12-25 10:23:35', '2026-01-26 04:24:59'),
(19, 'IELTS Speaking Practice with Native Speaker', '2024-05-05', '10.00 - 12.00 WIB', '100K', 'An intensive speaking practice session with a native speaker for IELTS test preparation.', 'Pamulang', '/class1.svg', 'Practice', '2025-12-25 10:23:35', '2026-01-26 04:25:04'),
(20, 'Vocabulary Booster: Travel & Culture', '2024-06-25', '19.00 - 21.00 WIB', '40K', 'Learning specific vocabulary needed when traveling and interacting with other cultures.', 'Pamulang', '/class2.svg', 'Workshop', '2025-12-25 10:23:35', '2026-01-26 04:25:09'),
(21, 'English Fun Day 2025', '2025-08-15', '09:00', 'Free', 'A day full of fun English activities for kids and teenagers. Games, storytelling, and more!', 'Pamulang', 'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2670&auto=format&fit=crop', 'Workshop', '2026-01-04 06:56:13', '2026-01-26 04:25:14'),
(25, 'Test Event', '2026-02-24', '13.00-15.00 WIB', '25K', 'Tes', 'Bintaro', 'https://res.cloudinary.com/dosfggbxu/image/upload/v1769402269/english-everywhere/thumbnails/jpe6pqtjz49umd7gdyhx.png', '', '2026-01-26 04:38:27', '2026-01-26 04:38:27');

-- --------------------------------------------------------

--
-- Struktur dari tabel `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `transactionId` varchar(255) NOT NULL,
  `invoiceNo` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `deadline` date NOT NULL,
  `status` enum('Success','Pending','Failed') NOT NULL DEFAULT 'Pending',
  `paymentType` enum('Lunas','Cicilan') NOT NULL DEFAULT 'Lunas',
  `installmentCount` int(11) NOT NULL DEFAULT 0,
  `vaNumber` varchar(50) DEFAULT NULL,
  `bankName` varchar(20) DEFAULT NULL,
  `snapToken` varchar(255) DEFAULT NULL,
  `paymentDate` datetime DEFAULT NULL,
  `studentId` int(11) DEFAULT NULL,
  `programId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `payments`
--

INSERT INTO `payments` (`id`, `transactionId`, `invoiceNo`, `amount`, `deadline`, `status`, `paymentType`, `installmentCount`, `vaNumber`, `bankName`, `snapToken`, `paymentDate`, `studentId`, `programId`, `createdAt`, `updatedAt`) VALUES
(4, 'TX-LNS-001', 'INV/2026/001', 2500000.00, '2026-02-10', 'Pending', 'Lunas', 0, '1234567890', 'BCA', 'snap-token-lunas-123', NULL, NULL, 1, '2026-01-28 04:49:51', '2026-01-28 04:49:51');

-- --------------------------------------------------------

--
-- Struktur dari tabel `payment_installments`
--

CREATE TABLE `payment_installments` (
  `id` int(11) NOT NULL,
  `installmentNumber` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `dueDate` date NOT NULL,
  `status` enum('Success','Pending','Failed') NOT NULL DEFAULT 'Pending',
  `vaNumber` varchar(50) DEFAULT NULL,
  `bankName` varchar(20) DEFAULT NULL,
  `snapToken` varchar(255) DEFAULT NULL,
  `paymentDate` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `paymentId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `programs`
--

CREATE TABLE `programs` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `price` varchar(255) NOT NULL,
  `desc` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `category` enum('REGULAR','INTENSIVE','OTHERS') NOT NULL DEFAULT 'REGULAR',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `programs`
--

INSERT INTO `programs` (`id`, `title`, `price`, `desc`, `image`, `category`, `createdAt`, `updatedAt`) VALUES
(1, 'Funny Phonics (1-2)', 'Mulai Rp 350.000', 'Belajar membaca & mengeja seru dengan metode Phonics.', '/class1.svg', 'REGULAR', '2025-12-29 09:57:29', '2025-12-29 09:57:29'),
(2, 'Hi Kids! (1-3)', 'Mulai Rp 350.000', 'Kelas dasar anak-anak. Fokus pada Bahasa Inggris sehari-hari.', '/class2.svg', 'REGULAR', '2025-12-29 09:57:29', '2025-12-29 09:57:29'),
(3, 'Oxford Phonics (1-5)', 'Mulai Rp 350.000', 'Metode Phonics dari Oxford untuk membaca & menulis handal.', '/class3.svg', 'REGULAR', '2025-12-29 09:57:29', '2025-12-29 09:57:29'),
(4, 'Abracadabra (1-6)', 'Mulai Rp 350.000', 'Program seru untuk kosakata dasar & percakapan awal.', '/class4.svg', 'REGULAR', '2025-12-29 09:57:29', '2025-12-29 09:57:29'),
(5, 'Get Smart (1-6)', 'Mulai Rp 350.000', 'Kurikulum dinamis, tingkatan 6 kemampuan dasar bahasa.', '/class5.svg', 'REGULAR', '2025-12-29 09:57:29', '2025-12-29 09:57:29'),
(6, 'Full Blast (1-6)', 'Mulai Rp 350.000', 'Program lengkap untuk siswa. Kuasai English level menengah.', '/class6.svg', 'REGULAR', '2025-12-29 09:57:29', '2025-12-29 09:57:29'),
(7, 'Test Preparation (TOEFL & IELTS)', 'Contact for Pricing', 'Intensive preparation courses for TOEFL and IELTS exams to help you achieve your target scores.', '/class1.svg', 'INTENSIVE', '2026-03-07 12:49:05', '2026-03-07 12:49:05'),
(8, 'Conversation Class', 'Contact for Pricing', 'Improve your speaking skills with our intensive conversation classes led by experienced teachers.', '/class2.svg', 'INTENSIVE', '2026-03-07 12:49:05', '2026-03-07 12:49:05'),
(9, 'Private Class (offline/ online/ Home Visit)', 'Contact for Pricing', 'Personalized one-on-one intensive learning tailored to your specific needs and schedule.', '/class3.svg', 'INTENSIVE', '2026-03-07 12:49:05', '2026-03-07 12:49:05');

-- --------------------------------------------------------

--
-- Struktur dari tabel `program_schedules`
--

CREATE TABLE `program_schedules` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` varchar(255) NOT NULL,
  `status` enum('AVAILABLE','PENDING','BOOKED','ACCEPTED') NOT NULL DEFAULT 'AVAILABLE',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `programId` int(11) DEFAULT NULL,
  `maxSlots` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `program_schedules`
--

INSERT INTO `program_schedules` (`id`, `date`, `time`, `status`, `createdAt`, `updatedAt`, `programId`, `maxSlots`) VALUES
(36, '2026-03-19', '10:00', 'BOOKED', '2026-03-07 06:29:38', '2026-03-07 06:38:49', NULL, 3);

-- --------------------------------------------------------

--
-- Struktur dari tabel `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `gender` enum('Male','Female') NOT NULL,
  `address` text DEFAULT NULL,
  `fatherName` varchar(255) DEFAULT NULL,
  `motherName` varchar(255) DEFAULT NULL,
  `birthPlace` varchar(255) DEFAULT NULL,
  `birthDate` date DEFAULT NULL,
  `phoneNumber` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `course` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `students`
--

INSERT INTO `students` (`id`, `name`, `gender`, `address`, `fatherName`, `motherName`, `birthPlace`, `birthDate`, `phoneNumber`, `email`, `createdAt`, `updatedAt`, `userId`, `course`) VALUES
(28, 'Adit', 'Male', 'Bintaro', '-', '-', 'Jakarta', '2026-03-07', '62895337881781', 'fadhilaaditya@gmail.com', '2026-03-07 06:54:28', '2026-03-07 06:54:43', 22, 'Hi Kids! (1-3)'),
(29, 'b', 'Male', 'b', 'b', 'b', 'b', '2026-03-07', '4123141', 'b@gmail.com', '2026-03-07 07:42:08', '2026-03-07 07:42:08', 23, NULL),
(30, 'a', 'Male', 'a', 'a', 'a', 'a', '2026-03-07', '1231412', 'a@gmail.com', '2026-03-07 07:42:19', '2026-03-07 07:42:19', 24, NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `teachers`
--

CREATE TABLE `teachers` (
  `id` int(11) NOT NULL,
  `nip` varchar(255) DEFAULT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `gender` enum('Male','Female') DEFAULT NULL,
  `address` text DEFAULT NULL,
  `birthPlace` varchar(255) DEFAULT NULL,
  `birthDate` date DEFAULT NULL,
  `phoneNumber` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `teachers`
--

INSERT INTO `teachers` (`id`, `nip`, `specialization`, `bio`, `createdAt`, `updatedAt`, `userId`, `name`, `gender`, `address`, `birthPlace`, `birthDate`, `phoneNumber`, `email`) VALUES
(1, '20221022', 'bahasa inggris', 'ahli grammar', '2026-02-11 14:11:23', '2026-03-04 05:28:33', 14, 'Sodikin ali', 'Male', 'Bintaro', '-', '2026-03-04', '123123123', 'sodikin@gmail.com'),
(2, NULL, 'Jago bat dah', '', '2026-03-06 06:58:07', '2026-03-06 06:58:07', 19, 'Hassan', 'Male', 'Gang. taqwa', NULL, '2000-11-28', '08871701221', 'davinhassan769@gmail.com');

-- --------------------------------------------------------

--
-- Struktur dari tabel `teacher_schedules`
--

CREATE TABLE `teacher_schedules` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL,
  `teacherName` varchar(255) DEFAULT NULL,
  `className` varchar(255) DEFAULT NULL,
  `teacherId` int(11) DEFAULT NULL,
  `attendanceLink` varchar(255) DEFAULT NULL,
  `programId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `classroom` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data untuk tabel `teacher_schedules`
--

INSERT INTO `teacher_schedules` (`id`, `date`, `startTime`, `endTime`, `teacherName`, `className`, `teacherId`, `attendanceLink`, `programId`, `createdAt`, `updatedAt`, `classroom`) VALUES
(2, '2026-02-01', '11:00:00', '12:00:00', 'Sodikin ali', 'Funny Phonics', 1, NULL, 1, '2026-02-23 07:10:40', '2026-02-23 07:13:34', NULL),
(4, '2026-02-02', '08:00:00', '09:00:00', 'Sodikin ali', 'Funny Phonics', 1, NULL, 1, '2026-02-23 09:18:15', '2026-02-23 09:18:15', NULL),
(5, '2026-02-28', '08:00:00', '09:00:00', 'Sodikin ali', 'Funny Phonics', 1, NULL, 1, '2026-02-25 03:53:23', '2026-02-25 03:53:23', NULL),
(6, '2026-03-05', '08:00:00', '09:00:00', 'Sodikin ali', 'Funny Phonics', 1, '', 1, '2026-02-28 18:04:37', '2026-02-28 18:04:37', 'Room A-101'),
(7, '2026-03-06', '10:00:00', '12:00:00', 'Sodikin ali', 'Hi Kids!', 1, '', 2, '2026-02-28 18:05:46', '2026-02-28 18:05:46', 'Room A-101'),
(8, '2026-03-11', '10:00:00', '12:00:00', 'Sodikin ali', 'Funny Phonics', 1, 'https://docs.google.com/spreadsheets/d/1oyRXYts4e1wx-FZ01-skKEJPz8nZOUnF/edit?gid=1378204842#gid=1378204842', 1, '2026-02-28 18:11:45', '2026-02-28 18:11:45', 'Room B-205'),
(9, '2026-03-11', '16:00:00', '15:00:00', 'Sodikin ali', 'Funny Phonics', 1, 'https://docs.google.com/spreadsheets/d/1oyRXYts4e1wx-FZ01-skKEJPz8nZOUnF/edit?gid=1378204842#gid=1378204842', 1, '2026-02-28 18:18:01', '2026-02-28 18:18:01', 'Room B-205'),
(10, '2026-03-12', '11:00:00', '12:00:00', 'Hassan', 'Funny Phonics', 2, 'https://docs.google.com/spreadsheets/d/1R0SA4yucNsq4zmx9boOGSvm2Z5yvbjQpir1EFSdToeY/edit?gid=0#gid=0', 1, '2026-03-06 07:06:17', '2026-03-06 07:06:17', 'Room A-101');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `nama_lengkap` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `photo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `nama_lengkap`, `createdAt`, `updatedAt`, `photo`) VALUES
(1, 'admin', '$2b$08$M.fzbWNktSFbJDdYxBsquuhVD9Va5oH.2kGOjp93xGh43D5Tnpu4y', 'admin', 'System Administrator', '2025-12-16 06:59:11', '2025-12-19 04:17:06', NULL),
(14, 'teacher', '$2b$08$gUOQSWpIHjjQYsFAajdwPeKBwrhPwk7tNkXCZaUUoRQD2HAxlEvBa', 'teacher', 'Sodikin ali', '2026-01-29 14:00:15', '2026-03-04 05:28:33', 'https://res.cloudinary.com/dosfggbxu/image/upload/v1772602113/english-everywhere/thumbnails/ljfugvsb2p30x9jg8sij.jpg'),
(19, 'hassan', '$2b$08$e5ITSU8ZHaIqxsQqL91gHe57wbTb1nYke/Cx8lIk3y0.10B/1UaVK', 'teacher', 'Hassan', '2026-03-06 06:58:06', '2026-03-06 06:58:06', ''),
(22, 'aditya', '$2b$08$7v2w4bA.UgE3J9EVcGQzrebY.miSIGut/0JHVWs8gsyx0vxNGLOf2', 'student', 'Adit', '2026-03-07 06:54:28', '2026-03-07 06:54:28', NULL),
(23, 'usera', '$2b$08$n1rz2Zjw8dqB3OoPMi0NruwYJWOKMMda/sbnTyUqtD5I2AVoW9Bu6', 'student', 'b', '2026-03-07 07:42:08', '2026-03-07 07:42:08', NULL),
(24, 'userb', '$2b$08$Wt6yKTAtX13lpM7KfTdS/uCKbCRnaZtPr5fkoz4tyKzwJzdxM2mFW', 'student', 'a', '2026-03-07 07:42:19', '2026-03-07 07:42:19', NULL);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `appointment_bookings`
--
ALTER TABLE `appointment_bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `scheduleId` (`scheduleId`);

--
-- Indeks untuk tabel `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `classrooms`
--
ALTER TABLE `classrooms`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transactionId` (`transactionId`),
  ADD KEY `studentId` (`studentId`),
  ADD KEY `programId` (`programId`);

--
-- Indeks untuk tabel `payment_installments`
--
ALTER TABLE `payment_installments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paymentId` (`paymentId`);

--
-- Indeks untuk tabel `programs`
--
ALTER TABLE `programs`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `program_schedules`
--
ALTER TABLE `program_schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `programId` (`programId`);

--
-- Indeks untuk tabel `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indeks untuk tabel `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nip` (`nip`),
  ADD UNIQUE KEY `nip_2` (`nip`),
  ADD UNIQUE KEY `nip_3` (`nip`),
  ADD UNIQUE KEY `nip_4` (`nip`),
  ADD UNIQUE KEY `nip_5` (`nip`),
  ADD UNIQUE KEY `nip_6` (`nip`),
  ADD UNIQUE KEY `nip_7` (`nip`),
  ADD UNIQUE KEY `nip_8` (`nip`),
  ADD UNIQUE KEY `nip_9` (`nip`),
  ADD UNIQUE KEY `nip_10` (`nip`),
  ADD UNIQUE KEY `nip_11` (`nip`),
  ADD UNIQUE KEY `nip_12` (`nip`),
  ADD UNIQUE KEY `nip_13` (`nip`),
  ADD UNIQUE KEY `nip_14` (`nip`),
  ADD UNIQUE KEY `nip_15` (`nip`),
  ADD KEY `userId` (`userId`);

--
-- Indeks untuk tabel `teacher_schedules`
--
ALTER TABLE `teacher_schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `teacherId` (`teacherId`),
  ADD KEY `programId` (`programId`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `username_2` (`username`),
  ADD UNIQUE KEY `username_3` (`username`),
  ADD UNIQUE KEY `username_4` (`username`),
  ADD UNIQUE KEY `username_5` (`username`),
  ADD UNIQUE KEY `username_6` (`username`),
  ADD UNIQUE KEY `username_7` (`username`),
  ADD UNIQUE KEY `username_8` (`username`),
  ADD UNIQUE KEY `username_9` (`username`),
  ADD UNIQUE KEY `username_10` (`username`),
  ADD UNIQUE KEY `username_11` (`username`),
  ADD UNIQUE KEY `username_12` (`username`),
  ADD UNIQUE KEY `username_13` (`username`),
  ADD UNIQUE KEY `username_14` (`username`),
  ADD UNIQUE KEY `username_15` (`username`),
  ADD UNIQUE KEY `username_16` (`username`),
  ADD UNIQUE KEY `username_17` (`username`),
  ADD UNIQUE KEY `username_18` (`username`),
  ADD UNIQUE KEY `username_19` (`username`),
  ADD UNIQUE KEY `username_20` (`username`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `appointment_bookings`
--
ALTER TABLE `appointment_bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `articles`
--
ALTER TABLE `articles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `classrooms`
--
ALTER TABLE `classrooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT untuk tabel `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `payment_installments`
--
ALTER TABLE `payment_installments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `programs`
--
ALTER TABLE `programs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `program_schedules`
--
ALTER TABLE `program_schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT untuk tabel `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT untuk tabel `teachers`
--
ALTER TABLE `teachers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `teacher_schedules`
--
ALTER TABLE `teacher_schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `appointment_bookings`
--
ALTER TABLE `appointment_bookings`
  ADD CONSTRAINT `appointment_bookings_ibfk_1` FOREIGN KEY (`scheduleId`) REFERENCES `program_schedules` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `students` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`programId`) REFERENCES `programs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `payment_installments`
--
ALTER TABLE `payment_installments`
  ADD CONSTRAINT `payment_installments_ibfk_1` FOREIGN KEY (`paymentId`) REFERENCES `payments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `program_schedules`
--
ALTER TABLE `program_schedules`
  ADD CONSTRAINT `program_schedules_ibfk_1` FOREIGN KEY (`programId`) REFERENCES `programs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `teachers`
--
ALTER TABLE `teachers`
  ADD CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `teacher_schedules`
--
ALTER TABLE `teacher_schedules`
  ADD CONSTRAINT `teacher_schedules_ibfk_21` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `teacher_schedules_ibfk_22` FOREIGN KEY (`programId`) REFERENCES `programs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
