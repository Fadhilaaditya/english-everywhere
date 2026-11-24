# AI Tools — English Everywhere

Sumber agent, skills, perintah, dan aturan AI khusus project ini. Target generator saat ini adalah **OpenCode**. Semua script memakai modul bawaan Node.js; tidak perlu `npm install` untuk tooling ini.

## Penggunaan

Jalankan dari root repository, dengan Node.js yang memenuhi kebutuhan frontend (`^20.19.0 || >=22.12.0`):

```sh
npm --prefix tools/ai run generate
npm --prefix tools/ai run check
npm --prefix tools/ai test
```

Setelah generate, tutup lalu buka kembali OpenCode dari root project agar konfigurasi, agent, command dan skill dimuat ulang. Model/provider mengikuti konfigurasi OpenCode pribadi yang tersedia.

## Struktur

```text
tools/ai/
├── agents/              # Definisi agent OpenCode (Markdown + YAML frontmatter)
├── commands/            # Slash commands
├── skills/              # Satu folder per skill, berisi SKILL.md
├── opencode.json        # Template konfigurasi project
├── RULES.md             # Peta project, konvensi, domain dan verifikasi
├── sync-config.mjs      # Generator tanpa dependency
├── sync-config.test.mjs # Uji drift, ownership, sinkronisasi dan metadata
├── package.json
└── README.md
```

Hasil generate:

- `opencode.json` di root: konfigurasi project, termasuk instruksi `tools/ai/RULES.md`.
- `.opencode/agents/`, `.opencode/commands/`, `.opencode/skills/`: salinan sumber yang ditemukan otomatis oleh OpenCode.
- `.opencode/.tools-ai-manifest.json`: hash file yang dikelola generator.

Sumber di `tools/ai` dilacak Git. Output generator diabaikan Git dan dibuat ulang setelah clone. Folder dependency mengikuti `.gitignore` yang sudah ada.

## Agent

| Agent | Tugas |
| --- | --- |
| `ee-fullstack` | Agent utama: fitur lengkap Vue → Express → Sequelize |
| `ee-frontend` | Vue SFC, komponen, Tailwind, routing, integrasi API |
| `ee-backend` | Route/controller, JWT, ownership, query dan transaksi |
| `ee-reviewer` | Review baca-saja, tanpa edit maupun shell |
| `ee-verifier` | Jalankan pemeriksaan relevan; tanpa edit source aplikasi |

Panggil specialist dengan `@ee-frontend`, `@ee-backend`, `@ee-reviewer`, atau `@ee-verifier`. Agent utama tidak otomatis mendelegasikan pekerjaan kecuali diminta.

## Skills

| Skill | Kapan dipakai |
| --- | --- |
| `ee-vue-frontend` | Halaman public/student, admin, teacher, state dan API client |
| `ee-express-api` | Endpoint, kontrak respons, validasi dan akses JWT |
| `ee-sequelize-data` | Model, alias relasi, MySQL, transaksi dan perubahan skema |
| `ee-school-workflows` | Appointment, pendaftar, jadwal guru, tagihan dan cicilan |
| `ee-verification` | Type-check, build, syntax, skenario per role dan kompatibilitas cPanel |

Skills berisi instruksi kontekstual yang dimuat AI sesuai tugas, bukan implementasi fitur aplikasi.

## Perintah OpenCode

```text
/ee-feature Tambahkan filter status pembayaran di halaman admin
/ee-review frontend/src/services/PaymentService.ts dan backend/src/controllers/paymentController.js
/ee-verify perubahan pada fitur appointment
```

## Mengubah konfigurasi

1. Edit sumber di `tools/ai/agents/`, `commands/`, `skills/`, `RULES.md`, atau template `opencode.json`.
2. Jalankan `npm --prefix tools/ai test` dan `npm --prefix tools/ai run generate`.
3. Jalankan `npm --prefix tools/ai run check` untuk mendeteksi output yang belum sinkron. Mode check tidak menulis file.
4. Restart OpenCode.

Generator menolak menimpa file output yang diedit manual atau belum tercatat di manifest. Jika menemui konflik, simpan perubahan itu ke sumber yang sesuai, lalu pindahkan file output yang konflik ke lokasi cadangan di luar path output dan generate ulang. Jangan menghapus seluruh `.opencode/`: file custom yang tidak dikelola generator dapat berada di sana.

File sumber yang dihapus akan menghapus salinan output lamanya hanya jika hash output masih cocok dengan manifest. File custom di luar daftar manifest tetap dipertahankan. Hindari beberapa proses generate bersamaan.

Untuk menambah agent/command, ikuti frontmatter file yang sudah ada. Untuk skill, gunakan nama lowercase-hyphen yang sama antara folder dan `name`, dengan file `SKILL.md` serta `description` yang menjelaskan pemicunya. Resource skill saat ini disalin sebagai teks UTF-8.

## Pemeriksaan kualitas instruksi

Gunakan contoh berikut untuk review manual saat mengganti instruksi:

1. “Perbaiki cicilan agar approval terakhir memperbarui status tagihan.” Ekspektasi: telusuri payment/installment/service/UI, bedakan ID, cek status aktual, ownership, transaksi dan approval berulang.
2. “Tambah filter guru di jadwal admin.” Ekspektasi: gunakan Vue dan service yang ada, bedakan TeacherSchedule dari ProgramSchedule, pertahankan kontrak API dan cek type/build.
3. “Review akses tagihan siswa lain.” Ekspektasi: cek relasi User→Student dan otorisasi backend, temuan disertai bukti, tanpa mengedit source.

Unit test generator memeriksa integritas file dan sinkronisasi; kualitas respons agent untuk skenario di atas tetap perlu dinilai saat dipakai.
