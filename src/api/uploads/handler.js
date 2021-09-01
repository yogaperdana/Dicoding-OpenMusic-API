class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    const { data } = request.payload;
    this._validator.validateImageHeaders(data.hapi.headers);

    // Local Storage:
    const filename = await this._service.writeFile(data, data.hapi);
    // Amazon S3 Bucket:
    // const pictureUrl = await this._service.writeFile(data, data.hapi);

    const response = h.response({
      status: 'success',
      message: 'Gambar berhasil diunggah.',
      data: {
        // Local Storage:
        pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/pictures/${filename}`,
        // Amazon S3 Bucket:
        // pictureUrl,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
