const { Pool } = require('pg');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylist(playlistId) {
    // Mendapatkan detail playlist
    const queryPlaylist = {
      text: `SELECT A.id playlist_id, A.name playlist_name, 
      B.username owner_username, B.fullname owner_fullname 
      FROM playlists A LEFT JOIN users B ON B.id = A.owner WHERE A.id = $1`,
      values: [playlistId],
    };
    const resultPlaylist = await this._pool.query(queryPlaylist);

    // Mendapatkan informasi daftar lagu pada playlist
    const querySongs = {
      text: `SELECT A.* FROM songs A
      LEFT JOIN playlistsongs B ON B.song_id = A.id
      WHERE B.playlist_id = $1`,
      values: [playlistId],
    };
    const resultSongs = await this._pool.query(querySongs);

    const result = resultPlaylist.rows[0];
    result.songs = resultSongs.rows;
    return result;
  }
}

module.exports = PlaylistService;
