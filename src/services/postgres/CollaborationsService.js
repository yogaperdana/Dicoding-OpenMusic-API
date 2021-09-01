const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class CollaborationsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  /** Menambahkan kolaborator pada playlist */
  async addCollaborator(playlistId, userId) {
    const collabId = `collab-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [collabId, playlistId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Kolaborator gagal ditambahkan.');
    }
    await this._cacheService.delete(`userplaylists:${userId}`);
    return result.rows[0].id;
  }

  /** Menghapus kolaborator pada playlist */
  async deleteCollaborator(playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Kolaborator gagal dihapus.');
    }
    await this._cacheService.delete(`userplaylists:${userId}`);
    await this._cacheService.delete(`playlists:${playlistId}`); // Supaya tidak dapat diakses lagi dari cache oleh user terkait
  }

  /** Verifikasi kolaborator */
  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Kolaborator gagal diverifikasi.');
    }
  }

  /** Mendapatkan daftar kolaborator playlist */
  async getCollaborator(playlistId) {
    const query = {
      text: 'SELECT user_id FROM collaborations WHERE playlist_id = $1',
      values: [playlistId],
    };
    const { rows } = await this._pool.query(query);
    return rows;
  }
}

module.exports = CollaborationsService;
