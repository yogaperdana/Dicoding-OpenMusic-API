class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler({ payload }, h) {
    this._validator.validatePostAuthenticationPayload(payload);

    const { username, password } = payload;

    const id = await this._usersService.verifyUserCredential(username, password);

    const accessToken = this._tokenManager.generateAccessToken({ id });
    const refreshToken = this._tokenManager.generateRefreshToken({ id });

    await this._authenticationsService.addRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Otentikasi berhasil ditambahkan.',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler({ payload }) {
    this._validator.validatePutAuthenticationPayload(payload);

    await this._authenticationsService.verifyRefreshToken(payload);

    const { id } = this._tokenManager.verifyRefreshToken(payload);
    const accessToken = this._tokenManager.generateAccessToken({ id });

    return {
      status: 'success',
      message: 'Token akses berhasil diperbarui.',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler({ payload }) {
    this._validator.validateDeleteAuthenticationPayload(payload);

    await this._authenticationsService.verifyRefreshToken(payload);
    await this._authenticationsService.deleteRefreshToken(payload);

    return {
      status: 'success',
      message: 'Refresh token berhasil dihapus.',
    };
  }
}

module.exports = AuthenticationsHandler;
