const pool = require("../config/db");

class MahasiswaRepository {
  async create({ nim, nama, email, jurusan, angkatan }) {
    const sql = `
      INSERT INTO mahasiswa
        (nim, nama, email, jurusan, angkatan)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;
    const values = [nim, nama, email, jurusan, angkatan];
    const { rows } = await pool.query(sql, values);
    return rows[0];
  }

  //  find all yang lama
  // async findAll() {
  //   const sql = "SELECT * FROM mahasiswa ORDER BY id";
  //   return (await pool.query(sql)).rows;
  // }

  //  find all yang baru, sembunyikan data terhapus dgn delete_at
  async findAll() {
    const sql = "SELECT * FROM mahasiswa WHERE deleted_at IS NULL ORDER BY id";
    return (await pool.query(sql)).rows;
  }

  //restore: kembalikan data yang terhapus
  async restore(id) {
    const sql =
      "UPDATE mahasiswa SET deleted_at = NULL WHERE id = $1 AND deleted_at IS NOT NULL RETURNING *";
    const { rows } = await pool.query(sql, [id]);
    return rows[0] || null;
  }
  // route: router.patch('/:id/restore', parseId, ctrl.restore);

  async findById(id) {
    const sql = "SELECT * FROM mahasiswa WHERE id = $1";
    const { rows } = await pool.query(sql, [id]);
    return rows[0] || null;
  }

  //endpoint patch
  async update(id, body) {
    const diizinkan = ["nim", "nama", "email", "jurusan", "angkatan"];
    const kunci = Object.keys(body).filter((k) => diizinkan.includes(k));

    const set = kunci.map((k, i) => `${k} = $${i + 1}`).join(", ");
    const values = [...kunci.map((k) => body[k]), id];

    const sql = `UPDATE mahasiswa SET ${set}
    WHERE id = $${kunci.length + 1} RETURNING *`;
    const { rows } = await pool.query(sql, values);
    return rows[0] || null;
  }

  //repository replace() untuk enpoint put
  async replace(id, { nim, nama, email, jurusan, angkatan }) {
    const sql =
      "UPDATE mahasiswa SET nim = $1, nama = $2, email = $3, jurusan = $4, angkatan = $5 WHERE id = $6 RETURNING *";
    const values = [nim, nama, email, jurusan, angkatan, id];
    const { rows } = await pool.query(sql, values);
    return rows[0] || null; //null jika id tidak ada
  }

  //untuk delete
  async remove(id) {
    const sql = "DELETE FROM mahasiswa WHERE id = $1";
    const { rowCount } = await pool.query(sql, [id]);
    return rowCount > 0;
  }

  //untuk soft delete, menandai colomn deleted_at dgn waktu di hapus
  async softDelete(id) {
    const sql =
      "UPDATE mahasiswa SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL";
    const { rowCount } = await pool.query(sql, [id]);
    return rowCount > 0;
  }
}

module.exports = new MahasiswaRepository();
