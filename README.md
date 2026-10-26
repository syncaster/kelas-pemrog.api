# Pemrograman API

Repositori ini berisi materi dan contoh source code untuk mata kuliah **Pemrograman API**. Mata kuliah ini membahas cara merancang, membuat, menguji, dan mengintegrasikan API agar aplikasi dapat bertukar data dengan aplikasi atau layanan lain.

## Tujuan pembelajaran

Setelah mengikuti materi, mahasiswa diharapkan mampu:

- memahami konsep API dan arsitektur REST;
- merancang resource, endpoint, HTTP method, serta format request dan response;
- membuat API menggunakan Node.js dan Express;
- mengimplementasikan operasi CRUD, validasi input, dan kode status HTTP;
- menguji endpoint dan memeriksa respons menggunakan Postman;
- memahami alur integrasi payment gateway Midtrans dengan memperhatikan keamanan transaksi.

## Membuat dan mengimplementasikan API

Pembuatan API dimulai dengan mengenali kebutuhan aplikasi dan data yang akan dikelola. Setelah itu, tentukan resource dan endpoint, pilih HTTP method yang sesuai, lalu tetapkan bentuk request, response, dan status HTTP.

Contoh API mahasiswa menggunakan resource `/mahasiswa`:

| Method | Endpoint | Kegunaan |
| --- | --- | --- |
| `GET` | `/mahasiswa` | Mengambil daftar mahasiswa |
| `GET` | `/mahasiswa/:id` | Mengambil mahasiswa berdasarkan ID |
| `POST` | `/mahasiswa` | Menambahkan mahasiswa |
| `PUT` | `/mahasiswa/:id` | Mengganti seluruh data mahasiswa |
| `PATCH` | `/mahasiswa/:id` | Mengubah sebagian data mahasiswa |
| `DELETE` | `/mahasiswa/:id` | Menghapus mahasiswa |

Implementasi endpoint mencakup penerimaan request, validasi data, pemrosesan operasi, dan pengiriman response JSON dengan status HTTP yang tepat. Contoh implementasi dapat dilihat di [01.rest-mahasiswa](./01.rest-mahasiswa/README.md). Jalankan server dan coba endpoint-nya menggunakan Postman sesuai petunjuk pada README tersebut.

## Integrasi payment gateway Midtrans

Midtrans digunakan sebagai layanan perantara untuk memproses pembayaran. Pada integrasi API, aplikasi backend umumnya membuat transaksi melalui Midtrans menggunakan **Server Key**, lalu mengirim informasi pembayaran yang diperlukan ke aplikasi klien. Klien menampilkan pilihan atau instruksi pembayaran kepada pengguna. Setelah status transaksi berubah, backend menerima notifikasi (webhook) dari Midtrans dan memperbarui status pesanan.

Alur umumnya:

1. Klien meminta backend membuat transaksi untuk suatu pesanan.
2. Backend memvalidasi pesanan dan nominal pembayaran, kemudian meminta transaksi ke Midtrans menggunakan kredensial server.
3. Backend mengirim informasi transaksi yang aman untuk klien, misalnya token atau URL pembayaran sesuai metode integrasi.
4. Pengguna menyelesaikan pembayaran melalui alur Midtrans.
5. Backend memverifikasi notifikasi transaksi dari Midtrans sebelum memperbarui status pesanan.

**Catatan keamanan:** simpan Server Key hanya di backend, misalnya melalui environment variable; jangan pernah menaruhnya di kode frontend atau mengirimkannya ke klien. Jangan menetapkan pesanan sebagai lunas hanya berdasarkan respons dari browser atau klien. Verifikasi notifikasi dan status transaksi di backend, serta gunakan lingkungan sandbox saat pengembangan dan pengujian.

Detail implementasi Midtrans bergantung pada metode pembayaran, SDK, serta konfigurasi akun dan lingkungan yang digunakan. Ikuti dokumentasi resmi Midtrans untuk parameter, verifikasi notifikasi, dan prosedur integrasi yang sesuai.
