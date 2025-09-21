---

### **📑 Spesifikasi Aplikasi Tiket Jahit – Full-Stack Web App**

**Versi: 1.0**

---

#### **1. Tujuan**

Menyediakan aplikasi web full-stack untuk admin dalam mengelola order pakaian (ukur, potong, jahit), mencetak tiket, dan menyimpan histori order secara online agar dapat diakses dari mana saja melalui browser.

---

#### **2. Tech Stack**

*   **Framework Inti:** **SvelteKit (Svelte 5)**
    *   Menangani frontend (UI reaktif) dan backend (logika server, API) dalam satu codebase terpadu.

*   **UI & Styling:** **TailwindCSS** + **shadcn-svelte**
    *   Styling modern dan cepat menggunakan utility-first classes dari TailwindCSS.
    *   Menggunakan `shadcn-svelte` untuk koleksi komponen UI yang aksesibel, dapat disesuaikan, dan siap pakai (seperti button, form, tabel, dialog).
    *   Menggunakan `@lucide/svelte` untuk ikon yang konsisten dan mudah digunakan.
*   **Manajemen Form:** **Superforms**
    *   Menangani validasi form yang andal dan progresif, baik di sisi klien maupun server, untuk pengalaman pengguna yang mulus.

*   **Database:** **Turso (via libSQL)** dengan **Drizzle ORM**
    *   Turso sebagai database SQLite terdistribusi untuk performa tinggi dan akses online yang cepat.
    *   Drizzle sebagai ORM modern (TypeScript-first) untuk interaksi database yang aman dan efisien.

*   **Autentikasi:** **Auth.js (SvelteKit Adapter)**
    *   Menangani proses login dan manajemen sesi admin secara aman dan terstandarisasi.

---

#### **3. Fitur Utama**

1.  **Dashboard Admin**
    *   Halaman utama setelah login yang menampilkan ringkasan data penting secara visual.
    *   Contoh metrik: Jumlah order baru, order dalam proses, total customer, dan order yang selesai bulan ini.

2.  **Login Admin**
    *   Hanya satu user admin (credential diset di awal via environment variables).
    *   Sesi login dikelola dengan aman oleh Auth.js.

3.  **Manajemen Measurement Label**
    *   Tambah, edit, hapus (soft delete via `is_active`).
    *   Bisa mengaktifkan kembali label yang sudah tidak aktif.
    *   Contoh: Lingkar Dada, Leher, Panjang Celana.

4.  **Manajemen Measurement Template**
    *   Buat template baru dengan memilih dari daftar `measurement_label` yang tersedia.
    *   Fitur **drag-drop** untuk mengatur urutan label dalam sebuah template.
    *   Fitur *clone* untuk menduplikasi template yang sudah ada sebagai dasar template baru.
    *   Contoh: Baju Seragam, Celana Panjang.

5.  **Manajemen Customer**
    *   Tambah, edit, dan lihat daftar customer (tipe: Individu atau Instansi).
    *   Instansi direpresentasikan sebagai satu customer, tanpa struktur divisi.
    *   Dilengkapi fitur **pencarian** berdasarkan nama customer.

6.  **Manajemen Order**
    *   Buat order baru dengan memilih customer dan template. Form ukuran akan digenerate secara otomatis.
    *   Admin mengisi nilai dan satuan (misal: 80 cm).
    *   Status order dapat diubah: `new`, `printed`, `in_progress`, `done`.
    *   Dilengkapi fitur **filter** berdasarkan status order dan **pencarian** berdasarkan nama customer.

7.  **Cetak Tiket**
    *   Order dapat dicetak langsung ke printer lokal menggunakan fungsi print dari browser.
    *   Tersedia layout khusus untuk halaman cetak yang rapi.
    *   Format tiket mencantumkan: nama customer, template yang digunakan, daftar ukuran, catatan khusus, dan tanggal cetak.

8.  **Tracking Progres Tukang**
    *   Di halaman detail order, admin bisa menandai progres pengerjaan dengan checkbox atau toggle.
    *   Status tracking: `Diterima Tukang Ukur`, `Diterima Tukang Potong`, `Diterima Tukang Jahit`.

---

#### **4. Struktur Database (Ringkas)**

Struktur inti tetap sama, sangat cocok untuk fitur yang ada. Auth.js mungkin akan menambahkan tabelnya sendiri (`users`, `sessions`, dll.), namun untuk logika aplikasi, skema ini adalah yang utama.

*   **customer**(id, name, type, institution_name, created_at)
*   **order**(id, customer_id, template_id, created_at, printed_at, status)
*   **measurement_label**(id, name, default_unit, is_active)
*   **measurement_template**(id, name, description, created_at)
*   **measurement_template_label**(id, template_id, label_id, order_index)
*   **measurement**(id, order_id, label_id, value, unit)

---

#### **5. Alur Aplikasi**

1.  Admin membuka URL aplikasi di browser dan melakukan **login**.
2.  Admin diarahkan ke **Dashboard** dan melihat ringkasan status bisnis.
3.  Admin mengelola *master data*: `measurement_label` & `measurement_template`.
4.  Admin mendaftarkan `customer` baru.
5.  Admin membuat `order` baru → memilih customer & template → mengisi detail ukuran.
6.  Admin **mencetak tiket** order untuk diberikan kepada tukang. Status order otomatis/manual berubah menjadi `printed`.
7.  Selama proses, admin **memperbarui status order** dan melacak progres pengerjaan tukang.
8.  Semua data tersimpan secara real-time di database online (Turso).

---

#### **6. Distribusi**

*   **Deployment:** Dideploy ke **Vercel**.
*   **Proses:** Terhubung dengan repository Git (misal: GitHub). Setiap `push` ke branch `main` akan secara otomatis mem-build dan men-deploy versi terbaru aplikasi.

---
