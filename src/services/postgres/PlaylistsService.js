const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor(collaborationsService, cacheService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
    this._cacheService = cacheService;
  }

  /** Menambahkan playlist baru */
  async addPlaylist(playlistName, ownerId) {
    const playlistId = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [playlistId, playlistName, ownerId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Playlist gagal ditambahkan.');
    }
    await this._cacheService.delete(`userplaylists:${ownerId}`);
    return result.rows[0].id;
  }

  /** Mendapatkan daftar playlist yang dimiliki pengguna */
  async getUserPlaylists(userId) {
    try {
      const result = await this._cacheService.get(`userplaylists:${userId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT A.id, A.name, B.username FROM playlists A
        LEFT JOIN users B ON B.id = A.owner
        LEFT JOIN collaborations C ON C.playlist_id = A.id
        WHERE A.owner = $1 OR C.user_id = $1`,
        values: [userId],
      };
      const { rows } = await this._pool.query(query);
      await this._cacheService.set(`userplaylists:${userId}`, JSON.stringify(rows));
      return rows;
    }
  }

  /** Menghapus playlist */
  async deletePlaylistById(playlistId) {
    const collabUserIds = await this._collaborationsService.getCollaborator(playlistId);

    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING owner',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Playlist gagal dihapus karena ID tidak ditemukan.');
    }
    const ownerId = result.rows[0].owner;
    await this._cacheService.delete(`userplaylists:${ownerId}`);
    await this._cacheService.delete(`playlist:${playlistId}`);

    // Menghapus cache untuk user kolaborasi pada playlist yang dihapus
    if (collabUserIds.length > 0) {
      const promise = [];
      for (let i = collabUserIds.length; i > 0; i -= 1) {
        promise.push(this._cacheService.delete(`userplaylists:${collabUserIds[i]}`));
      }
      await Promise.all(promise);
    }
  }

  /** Menambahkan lagu ke dalam playlist */
  async addSongOnPlaylist(songId, playlistId) {
    const playlistSongId = `plsong-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlistsongs (id, song_id, playlist_id) VALUES($1, $2, $3) RETURNING id',
      values: [playlistSongId, songId, playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist.');
    }
    await this._cacheService.delete(`playlist:${playlistId}`);
    return result.rows[0].id;
  }

  /** Mendapatkan daftar lagu pada playlist */
  async getSongsOnPlaylistById(playlistId) {
    try {
      const result = await this._cacheService.get(`playlist:${playlistId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT A.id, A.title, A.performer FROM songs A
        LEFT JOIN playlistsongs B ON B.song_id = A.id
        WHERE B.playlist_id = $1`,
        values: [playlistId],
      };
      const result = await this._pool.query(query);
      if (!result.rowCount) {
        throw new NotFoundError('Playlist tidak ditemukan.');
      }
      await this._cacheService.set(`playlist:${playlistId}`, JSON.stringify(result.rows));
      return result.rows;
    }
  }

  /** Menghapus lagu dari dalam playlist */
  async deleteSongOnPlaylist(songId, playlistId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE song_id = $1 AND playlist_id = $2 RETURNING id',
      values: [songId, playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal dihapus dari playlist karena ID tidak ditemukan.');
    }
    await this._cacheService.delete(`playlist:${playlistId}`);
  }

  /** Verifikasi pemilik playlist */
  async verifyPlaylistOwner(playlistId, ownerId) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan.');
    }
    const playlist = result.rows[0];
    if (playlist.owner !== ownerId) {
      throw new AuthorizationError('Anda tidak berhak mengakses sumber daya ini.');
    }
  }

  /** Verifikasi akses playlist */
  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationsService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }

  /** Mendapatkan daftar playlist yang berisi lagu yang sama */
  async getPlaylistsWithSongById(songId) {
    const query = {
      text: 'SELECT playlist_id FROM playlistsongs WHERE song_id = $1',
      values: [songId],
    };
    const { rows } = await this._pool.query(query);
    return rows;
  }
}

module.exports = PlaylistsService;
