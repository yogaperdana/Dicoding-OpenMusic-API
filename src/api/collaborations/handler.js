class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postCollaboratorHandler = this.postCollaboratorHandler.bind(this);
    this.deleteCollaboratorHandler = this.deleteCollaboratorHandler.bind(this);
  }

  /** Menambahkan kolaborator pada playlist */
  async postCollaboratorHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    const collaborationId = await this._collaborationsService.addCollaborator(playlistId, userId);

    const response = h.response({
      status: 'success',
      message: 'Kolaborator berhasil ditambahkan.',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  /** Menghapus kolaborator pada playlist */
  async deleteCollaboratorHandler(request) {
    this._validator.validateCollaborationPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationsService.deleteCollaborator(playlistId, userId);

    return {
      status: 'success',
      message: 'Kolaborator berhasil dihapus.',
    };
  }
}

module.exports = CollaborationsHandler;
