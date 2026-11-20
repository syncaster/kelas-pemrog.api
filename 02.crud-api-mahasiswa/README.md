# CRUD API Mahasiswa

Contoh REST API untuk mengelola data mahasiswa menggunakan Node.js, Express, dan PostgreSQL.

## Teknologi dan package

- **Node.js**: menjalankan aplikasi JavaScript di sisi server.
- **Express** (`express`): membuat server HTTP dan routing API.
- **node-postgres** (`pg`): menghubungkan aplikasi ke PostgreSQL.
- **dotenv**: membaca konfigurasi dari file `.env`.
- **nodemon** (`devDependency`): menjalankan ulang server otomatis saat kode berubah.

Instal Node.js dan PostgreSQL terlebih dahulu. Dari folder `02.crud-api-mahasiswa`, install package yang tercatat di `package.json`:

```bash
npm install
```

Perintah tersebut memasang `express`, `pg`, `dotenv`, dan `nodemon`. Jika ingin memasang package satu per satu:

```bash
npm install express pg dotenv
npm install --save-dev nodemon
```

## Struktur directory

```text
02.crud-api-mahasiswa/
├── .env
├── package.json
├── package-lock.json
└── src/
    ├── app.js
    ├── server.js
    ├── testConnection.js
    ├── config/
    │   └── db.js
    ├── controllers/
    │   └── mahasiswaController.js
    ├── middlewares/
    │   ├── parseId.js
    │   └── validateMahasiswa.js
    ├── repositories/
    │   └── mahasiswaRepository.js
    └── routes/
        └── mahasiswaRoutes.js
```

- `.env`: konfigurasi port server dan koneksi PostgreSQL. Jangan masukkan kredensial asli ke Git.
- `package.json`: metadata project, daftar package, dan perintah `npm`.
- `package-lock.json`: mengunci versi dependency yang terpasang.
- `src/app.js`: membuat Express app, memasang JSON parser dan route `/api/mahasiswa`, serta menangani error.
- `src/server.js`: membaca konfigurasi dan menjalankan server HTTP.
- `src/testConnection.js`: mencoba koneksi PostgreSQL dengan query sederhana.
- `src/config/db.js`: membuat dan mengekspor connection pool PostgreSQL.
- `src/routes/mahasiswaRoutes.js`: memetakan URL dan HTTP method ke middleware serta controller.
- `src/controllers/mahasiswaController.js`: menangani request, memanggil repository, dan membentuk response.
- `src/middlewares/parseId.js`: memvalidasi `:id` sebagai bilangan bulat positif.
- `src/middlewares/validateMahasiswa.js`: memvalidasi semua field untuk POST/PUT dan field yang dikirim untuk PATCH.
- `src/repositories/mahasiswaRepository.js`: menjalankan query SQL untuk membaca, menambah, mengubah, dan menghapus data.

## Konfigurasi `.env`

Buat atau lengkapi file `.env` di folder project:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password_postgres_anda
DB_NAME=nama_database
```

Sesuaikan `DB_USER`, `DB_PASSWORD`, dan `DB_NAME` dengan PostgreSQL lokal Anda. `PORT` bersifat opsional; jika tidak diisi, aplikasi menggunakan port `3000`. Jangan mengunggah `.env` yang berisi kredensial ke repository.

### Menyiapkan database

Buat database sesuai `DB_NAME`, lalu jalankan SQL berikut di database tersebut. Struktur ini mengikuti field yang digunakan aplikasi:

```sql
CREATE TABLE mahasiswa (
  id SERIAL PRIMARY KEY,
  nim VARCHAR(30) NOT NULL UNIQUE,
  nama VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  jurusan VARCHAR(150) NOT NULL,
  angkatan INTEGER NOT NULL CHECK (angkatan >= 2000),
  deleted_at TIMESTAMPTZ NULL
);
```

Uji koneksi (opsional), lalu jalankan server:

```bash
node src/testConnection.js
npm run dev
```

Untuk menjalankan tanpa nodemon, gunakan `npm start`. Server mencetak port yang digunakan ketika berhasil mulai.

## Routing API

Semua route menggunakan prefix `/api/mahasiswa`. Dengan port default, base URL Postman adalah `http://localhost:3000/api/mahasiswa`.

| Method | Path | Kegunaan |
| --- | --- | --- |
| `GET` | `/` | Mengambil daftar mahasiswa yang belum di-soft-delete. |
| `GET` | `/:id` | Mengambil satu mahasiswa berdasarkan ID. |
| `POST` | `/` | Menambahkan mahasiswa baru. |
| `PUT` | `/:id` | Mengganti seluruh field mahasiswa; semua field wajib dikirim. |
| `PATCH` | `/:id` | Mengubah satu atau lebih field mahasiswa. |
| `DELETE` | `/:id` | Menghapus mahasiswa secara permanen (hard delete). |

`:` pada `:id` berarti bagian URL tersebut harus diganti dengan ID angka, misalnya `/1`. Istilah `path /:id` di atas adalah route PATCH.

Data mahasiswa yang digunakan oleh POST dan PUT berbentuk JSON:

```json
{
  "nim": "2024001",
  "nama": "Siti Aminah",
  "email": "siti@example.com",
  "jurusan": "Teknik Informatika",
  "angkatan": 2024
}
```

`nim`, `nama`, dan `jurusan` harus diisi; email harus memiliki format email; `angkatan` harus berupa angka bulat minimal 2000. `nim` dan `email` harus unik.

## Soft delete dan hard delete

- **Hard delete** menghapus baris dari tabel secara permanen. Repository menjalankan SQL `DELETE FROM mahasiswa`; inilah perilaku route `DELETE /:id` saat ini. Data yang sudah dihapus tidak dapat dipulihkan dari aplikasi.
- **Soft delete** mempertahankan baris, tetapi mengisi kolom `deleted_at` dengan waktu penghapusan. Repository sudah memiliki method `softDelete`, dan daftar mahasiswa menyaring baris dengan `deleted_at IS NULL`. Namun, controller saat ini memanggil method `remove` (hard delete), bukan `softDelete`; belum ada route restore yang aktif.

Jadi, jangan menganggap permintaan DELETE saat ini sebagai soft delete. Jika soft delete diaktifkan, route/controller perlu diarahkan ke `softDelete`; perilaku pencarian berdasarkan ID dan kebutuhan restore juga perlu ditentukan. Dengan skema unique constraint di atas, NIM/email pada baris yang di-soft-delete tetap dianggap terpakai.

## Pengujian menggunakan Postman

Jalankan server (`npm run dev`), lalu buat request dengan base URL `http://localhost:3000/api/mahasiswa`. Untuk POST, PUT, dan PATCH pilih **Body → raw → JSON** serta header `Content-Type: application/json`.

1. **GET `/` — daftar mahasiswa**
   - Method: `GET`
   - URL: `http://localhost:3000/api/mahasiswa/`
   - Hasil berhasil: `200 OK`, response memiliki `status`, `count`, dan array `data`.

2. **POST `/` — tambah mahasiswa**
   - Method: `POST`
   - URL: `http://localhost:3000/api/mahasiswa/`
   - Body: gunakan JSON contoh di atas.
   - Hasil berhasil: `201 Created`. Catat nilai `data.id` dari response untuk langkah berikutnya.

3. **GET `/:id` — cari berdasarkan ID**
   - Method: `GET`
   - URL: `http://localhost:3000/api/mahasiswa/1`
   - Ganti `1` dengan ID dari langkah POST.
   - Hasil berhasil: `200 OK` dengan object mahasiswa pada `data`; ID yang tidak ditemukan menghasilkan `404 Not Found`.

4. **PUT `/:id` — ganti seluruh data**
   - Method: `PUT`
   - URL: `http://localhost:3000/api/mahasiswa/1`
   - Body: kirim ulang semua field (`nim`, `nama`, `email`, `jurusan`, `angkatan`) dengan nilai yang ingin disimpan.
   - Hasil berhasil: `200 OK`. Karena PUT mengganti seluruh data, jangan menghilangkan field wajib.

5. **PATCH `/:id` — ubah sebagian data**
   - Method: `PATCH`
   - URL: `http://localhost:3000/api/mahasiswa/1`
   - Body contoh:

     ```json
     {
       "jurusan": "Sistem Informasi"
     }
     ```

   - Hasil berhasil: `200 OK`; kirim minimal satu field. Field yang dikirim tetap harus valid.

6. **DELETE `/:id` — hapus data**
   - Method: `DELETE`
   - URL: `http://localhost:3000/api/mahasiswa/1`
   - Hasil berhasil: `204 No Content` tanpa response body. Saat ini operasi ini adalah hard delete.

Untuk menguji perubahan dan penghapusan, lakukan GET `/:id` atau GET `/` setelah request tersebut. ID harus bilangan bulat positif; ID tidak valid menghasilkan `400 Bad Request`. NIM atau email duplikat menghasilkan `409 Conflict`.
