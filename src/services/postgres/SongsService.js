const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBToModel } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor(collaborationsService, cacheService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
    this._cacheService = cacheService;
  }

  /** Menambahkan lagu */
  async addSong(payload) {
    const songId = `song-${nanoid(16)}`;
    const insertedAt = new Date().toISOString();
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $7) RETURNING id',
      values: [songId, ...Object.values(payload), insertedAt],
    };
    const { rows } = await this._pool.query(query);
    if (!rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan.');
    }
    await this._cacheService.delete('songs');
    return rows[0].id;
  }

  /** Mendapatkan semua lagu */
  async getAllSongs() {
    try {
      const result = await this._cacheService.get('songs');
      return JSON.parse(result);
    } catch (error) {
      const { rows } = await this._pool.query('SELECT id, title, performer FROM songs');
      await this._cacheService.set('songs', JSON.stringify(rows));
      return rows;
    }
  }

  /** Mendapatkan detail lagu */
  async getSongById(songId) {
    try {
      const result = await this._cacheService.get(`songdetails:${songId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: 'SELECT * FROM songs WHERE id = $1',
        values: [songId],
      };
      const result = await this._pool.query(query);
      if (!result.rowCount) {
        throw new NotFoundError('Lagu tidak ditemukan.');
      }
      await this._cacheService.set(`songdetails:${songId}`, JSON.stringify(result.rows));
      return result.rows.map(mapDBToModel)[0];
    }
  }

  /** Mengubah data lagu */
  async editSongById(songId, payload) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
      values: [...Object.values(payload), updatedAt, songId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan.');
    }
    await this._cacheService.delete(`songdetails:${songId}`);
  }

  /** Menghapus lagu */
  async deleteSongById(songId) {
    const playlistIds = await this._collaborationsService.getCollaborator(songId);

    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [songId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan.');
    }
    await this._cacheService.delete('songs');
    await this._cacheService.delete(`songdetails:${songId}`);

    // Menghapus cache playlist yang berisi lagu yang dihapus
    if (playlistIds.length > 0) {
      const promise = [];
      for (let i = playlistIds.length; i > 0; i -= 1) {
        promise.push(this._cacheService.delete(`playlist:${playlistIds[i]}`));
      }
      await Promise.all(promise);
    }
  }
}

module.exports = SongsService;
