# Kriteria API

Catatan: Terdapat beberapa hasil keluaran pesan yang berbeda pada submisi ini, namun tidak menggagalkan pengujian dan kriteria utama.

---

## Lagu

### Menyimpan Data Lagu

API dapat menyimpan lagu melalui _route_:

* Method: **POST**
* URL: `/songs`
* Body Request: 
  ```json
  {
    "title": string,
    "year": number,
    "performer": string,
    "genre": string,
    "duration": number
  }
  ```

Contoh struktur objek:
```json
{
  "id": "song-Qbax5Oy7L8WKf74l",
  "title": "Kenangan Mantan",
  "year": 2021,
  "performer": "Dicoding",
  "genre": "Indie",
  "duration": 120,
  "insertedAt": "2021-03-04T09:11:44.598Z",
  "updatedAt": "2021-03-04T09:11:44.598Z"
}
```

Spesifikasi _Data Validation_ pada _Request Payload_:

* **title** : string, required.
* **year** : number, required.
* **performer** : string, required.
* **genre** : string.
* **duration**: number.

Respon yang harus dikembalikan:

* Status Code: **201**
* Response Body:
  ```json
  {
    "status": "success",
    "message": "Lagu berhasil ditambahkan",
    "data": {
      "songId": "song-Qbax5Oy7L8WKf74l"
    }
  }
  ```

### Menampilkan Seluruh Lagu

API dapat menampilkan seluruh lagu melalui _route_:

* Method: **GET**
* URL: `/songs`

Respon yang harus dikembalikan:

* Status Code: **200**
* Response Body:
  ```json
  {
    "status": "success",
    "data": {
      "songs": [
        {
          "id": "song-Qbax5Oy7L8WKf74l",
          "title": "Kenangan Mantan",
          "performer": "Dicoding"
        },
        {
          "id": "song-poax5Oy7L8WKllqw",
          "title": "Kau Terindah",
          "performer": "Dicoding"
        },
        {
          "id": "song-Qalokam7L8WKf74l",
          "title": "Tulus Padamu",
          "performer": "Dicoding"
        }
      ]
    }
  }
  ```
  Jika belum terdapat lagu yang dimasukkan, server bisa merespon dengan _array_ `songs` kosong.
  ```json
  {
    "status": "success",
    "data": {
      "songs": []
    }
  }
  ```

### Menampilkan Detail Lagu

API dapat menampilkan detail lagu berdasarkan id yang disimpan melalui _route_:

* Method: **GET**
* URL: `/songs/{songId}`

Respon yang harus dikembalikan:

* Status Code: **200**
* Response Body:
  ```json
  {
    "status": "success",
    "data": {
      "song": {
        "id": "song-Qbax5Oy7L8WKf74l",
        "title": "Kenangan Mantan",
        "year": 2021,
        "performer": "Dicoding",
        "genre": "Indie",
        "duration": 120,
        "insertedAt": "2021-03-05T06:14:28.930Z",
        "updatedAt": "2021-03-05T06:14:30.718Z"
      }
    }
  }
  ```

### Mengubah Data Lagu

API dapat mengubah data lagu berdasarkan id melalui _route_:

* Method: **PUT**
* URL: `/songs/{songId}`
* Body Request:
  ```json
  {
    "title": string,
    "year": number,
    "performer": string,
    "genre": string,
    "duration": number
  }
  ```

Spesifikasi _Data Validation_ pada _Request Payload_:

* **title** : string, required.
* **year** : number, required.
* **performer** : string, required.
* **genre** : string.
* **duration** : number.

Respon yang dikembalikan:

* Status Code: **200**
* Response Body:
  ```json
  {
    "status": "success",
    "message": "Lagu berhasil diperbarui"
  }
  ```

### Menghapus Data Lagu

API dapat menghapus data lagu berdasarkan id melalui _route_:

* Method: **DELETE**
* URL: `/songs/{songId}`

Respon yang harus dikembalikan:

* Status Code: **200**
* Response Body:
  ```json
  {
    "status": "success",
    "message": "Lagu berhasil dihapus"
  }
  ```

---

## _Error Handling_

- Ketika proses validasi data pada _request payload_ tidak sesuai (gagal), server harus mengembalikan respon:
  - Status code: **400 (*Bad Request*)**
  - Response body:
    - status: ***fail***
    - message: \<apa pun selama tidak kosong\>
- Ketika pengguna mengakses _resource_ yang tidak ditemukan, server harus mengembalikan respon:
  - Status code: **404 (*Not Found*)**
  - Response body:
    - status: ***fail***
    - message: \<apa pun selama tidak kosong\>
- Ketika terjadi server error, server harus mengembalikan respon:
  - Status code: **500 (*Internal Server Error*)**
  - Response body:
    - status: ***error***
    - message: \<apa pun selama tidak kosong\>
