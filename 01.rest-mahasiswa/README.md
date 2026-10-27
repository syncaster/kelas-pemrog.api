# REST API Mahasiswa

Contoh REST API sederhana menggunakan Node.js dan Express. Data mahasiswa disimpan sementara di memori, jadi data yang ditambahkan atau diubah akan kembali seperti semula ketika server dijalankan ulang.

## Persiapan

Pastikan Node.js dan npm sudah terpasang. Buka terminal di folder `01.rest-mahasiswa`, lalu pasang Express:

```bash
npm init -y
npm install express
```

> Perintah `npm init -y` hanya perlu dijalankan sekali untuk membuat `package.json`.

## Menjalankan server

Dari folder `01.rest-mahasiswa`, jalankan:

```bash
node server.js
```

Jika berhasil, terminal menampilkan pesan bahwa REST API berjalan di `http://localhost:3000`. Biarkan terminal tetap terbuka selama API digunakan. Hentikan server dengan `Ctrl+C`.

## Mencoba API menggunakan Postman

Buat request baru di Postman dengan alamat dasar:

```text
http://localhost:3000/mahasiswa
```

Untuk request yang mengirim data, pilih tab **Body** → **raw** → **JSON**, lalu gunakan contoh berikut.

| Method | URL | Kegunaan |
| --- | --- | --- |
| `GET` | `http://localhost:3000/mahasiswa` | Melihat semua mahasiswa |
| `GET` | `http://localhost:3000/mahasiswa/1` | Melihat mahasiswa dengan ID 1 |
| `POST` | `http://localhost:3000/mahasiswa` | Menambahkan mahasiswa |
| `PUT` | `http://localhost:3000/mahasiswa/1` | Mengganti seluruh data mahasiswa dengan ID 1 |
| `PATCH` | `http://localhost:3000/mahasiswa/1` | Mengubah sebagian data mahasiswa dengan ID 1 |
| `DELETE` | `http://localhost:3000/mahasiswa/1` | Menghapus mahasiswa dengan ID 1 |

### Contoh body request

**POST** — tambahkan mahasiswa baru:

```json
{
  "nama": "Andi",
  "nim": "23104416"
}
```

Respons yang diharapkan adalah `201 Created`. Respons menyertakan data mahasiswa baru dan header `Location` yang menunjukkan alamat data tersebut.

**PUT** — ganti seluruh data untuk ID 1:

```json
{
  "nama": "Budi Santoso",
  "nim": "23104414"
}
```

Kedua properti, `nama` dan `nim`, wajib diisi.

**PATCH** — ubah sebagian data untuk ID 1:

```json
{
  "nama": "Budi Santoso"
}
```

Properti yang tidak dikirim tidak diubah.

## Debug dan pemeriksaan respons

- Klik **Send** untuk menjalankan request. Periksa status HTTP, body respons, dan header pada panel respons Postman.
- Jika server berjalan, tetapi request tidak berhasil, pastikan URL dan method benar serta terminal server masih aktif.
- `GET /mahasiswa` mengembalikan `200 OK` dan daftar mahasiswa. Data awal memiliki ID `1` dan `2`.
- `GET`, `PUT`, `PATCH`, atau `DELETE` dengan ID yang tidak ditemukan mengembalikan `404 Not Found`.
- `POST` tanpa `nama` atau `nim` mengembalikan `422 Unprocessable Entity`. `PUT` juga membutuhkan keduanya.
- `DELETE` yang berhasil mengembalikan `204 No Content`; responsnya memang tidak memiliki body.
- Pesan request dan error dari Node.js dapat dilihat di terminal tempat server dijalankan. Untuk melihat perubahan data, kirim request `GET /mahasiswa` setelah operasi `POST`, `PUT`, `PATCH`, atau `DELETE`.

## Debug API menggunakan Google Chrome DevTools

Request API juga dapat dicoba langsung dari **Console** di Google Chrome DevTools menggunakan `fetch`.

1. Pastikan server berjalan dengan perintah `node server.js` di terminal.
2. Buka `http://localhost:3000/mahasiswa` di Google Chrome. Halaman akan menampilkan respons daftar mahasiswa.
3. Buka DevTools dengan menekan **F12** atau **Ctrl+Shift+I** (Windows/Linux), lalu pilih tab **Console**.
4. Salin salah satu contoh request di bawah, tempelkan di Console, lalu tekan **Enter**.
5. Periksa hasilnya di Console. Untuk melihat data terbaru, muat ulang halaman atau jalankan `fetch("/mahasiswa").then(res => res.json()).then(console.log)` di Console.

Contoh berikut menggunakan URL relatif seperti `/mahasiswa`. Karena itu, Console harus berasal dari halaman di `http://localhost:3000` agar request dikirim ke server API ini.

### POST — menambahkan mahasiswa

```javascript
fetch("/mahasiswa", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ nama: "Dewi", nim: "23104417" })
}).then(res => { console.log(res.status); return res.json(); }).then(console.log);
```

Jika berhasil, status `201` dan data mahasiswa baru akan tampil. ID mahasiswa baru akan bertambah otomatis.

### PUT — mengganti seluruh data mahasiswa dengan ID 1

```javascript
fetch("/mahasiswa/1", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ nama: "Budiman Santoso", nim: "23104414" })
}).then(res => res.json()).then(console.log);
```

Kirim `nama` dan `nim` karena `PUT` mengganti seluruh data. Jika ID tidak ditemukan, API mengembalikan status `404`.

### PATCH — mengubah sebagian data mahasiswa dengan ID 1

```javascript
fetch("/mahasiswa/1", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ nama: "Budiman S." })
}).then(res => res.json()).then(console.log);
```

Properti yang tidak dikirim, seperti `nim`, tidak berubah.

### DELETE — menghapus mahasiswa dengan ID 2

```javascript
fetch("/mahasiswa/2", { method: "DELETE" }).then(res => console.log(res.status));
```

Jika berhasil, Console menampilkan status `204`. Respons `204 No Content` memang tidak memiliki body.
