class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
    this.getUserByUsernameHandler = this.getUserByUsernameHandler.bind(this);
  }

  async postUserHandler({ payload }, h) {
    this._validator.validateUserPayload(payload);

    const userId = await this._service.addUser(payload);

    const response = h.response({
      status: 'success',
      message: 'Pengguna baru berhasil ditambahkan.',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  async getUserByIdHandler(request) {
    const { id } = request.params;

    const user = await this._service.getUserById(id);

    return {
      status: 'success',
      data: {
        user,
      },
    };
  }

  async getUserByUsernameHandler(request) {
    const { username = '' } = request.query;
    const users = await this._service.getUserByUsername(username);

    return {
      status: 'success',
      data: {
        users,
      },
    };
  }
}

module.exports = UsersHandler;
