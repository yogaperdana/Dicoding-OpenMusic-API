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
    const id = `collab-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Kolaborator gagal ditambahkan.');
    }
    // Hapus dari cache
    await this._cacheService.delete(`playlists:${playlistId}`);
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

    // Hapus dari cache
    await this._cacheService.delete(`playlists:${playlistId}`);
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
}

module.exports = CollaborationsService;
