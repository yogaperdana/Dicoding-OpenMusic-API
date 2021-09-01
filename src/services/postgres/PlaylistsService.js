const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  /** Menambahkan playlist baru */
  async addPlaylist(name, owner) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Playlist gagal ditambahkan.');
    }
    return result.rows[0].id;
  }

  /** Mendapatkan daftar playlist yang dimiliki pengguna */
  async getUserPlaylists(user) {
    const query = {
      text: `SELECT A.id, A.name, B.username FROM playlists A
      LEFT JOIN users B ON B.id = A.owner
      LEFT JOIN collaborations C ON C.playlist_id = A.id
      WHERE A.owner = $1 OR C.user_id = $1`,
      values: [user],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  /** Menghapus playlist */
  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Playlist gagal dihapus karena ID tidak ditemukan.');
    }
  }

  /** Menambahkan lagu ke dalam playlist */
  async addSongOnPlaylist(songId, playlistId) {
    const id = `plsong-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlistsongs (id, song_id, playlist_id) VALUES($1, $2, $3) RETURNING id',
      values: [id, songId, playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist.');
    }
    return result.rows[0].id;
  }

  /** Mendapatkan daftar lagu pada playlist */
  async getSongsOnPlaylistById(id) {
    const query = {
      text: `SELECT A.id, A.title, A.performer FROM songs A
      LEFT JOIN playlistsongs B ON B.song_id = A.id
      WHERE B.playlist_id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan.');
    }
    return result.rows;
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
  }

  /** Verifikasi pemilik playlist */
  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan.');
    }

    const playlist = result.rows[0];
    if (playlist.owner !== owner) {
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
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
