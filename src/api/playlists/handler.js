class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getUserPlaylistsHandler = this.getUserPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postSongOnPlaylistHandler = this.postSongOnPlaylistHandler.bind(this);
    this.getSongsOnPlaylistHandler = this.getSongsOnPlaylistHandler.bind(this);
    this.deleteSongOnPlaylistHandler = this.deleteSongOnPlaylistHandler.bind(this);
  }

  /** Menambahkan playlist baru */
  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);

    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist(name, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan.',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  /** Mendapatkan daftar playlist yang dimiliki pengguna */
  async getUserPlaylistsHandler(request) {
    const { id: credentialId } = request.auth.credentials;

    const playlists = await this._service.getUserPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  /** Menghapus playlist */
  async deletePlaylistByIdHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deletePlaylistById(playlistId);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus.',
    };
  }

  /** Menambahkan lagu ke dalam playlist */
  async postSongOnPlaylistHandler(request, h) {
    this._validator.validateSongOnPlaylistPayload(request.payload);

    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.addSongOnPlaylist(songId, playlistId);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist.',
    });
    response.code(201);
    return response;
  }

  /** Mendapatkan daftar lagu pada playlist */
  async getSongsOnPlaylistHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    const songs = await this._service.getSongsOnPlaylistById(playlistId);

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  /** Menghapus lagu dari dalam playlist */
  async deleteSongOnPlaylistHandler(request) {
    this._validator.validateSongOnPlaylistPayload(request.payload);

    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.deleteSongOnPlaylist(songId, playlistId);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistsHandler;
