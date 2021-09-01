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


## Pengguna & Otentikasi

### Menambahkan Pengguna (_User Register_)

API dapat menambahkan pengguna (_user_) melalui _route_:

* Method: **POST**
* URL: `/users`
* Body Request:
  ```json
  {
    "username": string,
    "password": string,
    "fullname": string
  }
  ```

Contoh struktur objek:
  ```json
  {
    "id": "user-Qbax5Oy7L8WKf74l",
    "username": "dicoding",
    "password": "encryptedpassword",
    "fullname": "Dicoding Indonesia"
  }
  ```

Ketentuan:

* _Username_ harus unik.

Spesifikasi _Data Validation_ pada _Request Payload_:

* **username**: string, required.
* **password**: string, required.
* **fullname**: string, required.

Respon yang harus dikembalikan:

* Status Code: **201**
* Response Body:
  ```json
  {
    "status": "success",
    "message": "User berhasil ditambahkan",
    "data": {
      "userId": "user-Qbax5Oy7L8WKf74l"
    }
  }
  ```

### Menambahkan Otentikasi (_User Login_)

API menyediakan fitur _user login_ melalui _route_:

* Method: **POST**
* URL: `/authentications`
* Body Request:
  ```json
  {
    "username": string,
    "password": string
  }
  ```

Ketentuan:

* Authentication menggunakan JWT token.
* JWT token mengandung _payload_ berisi `userId` yang merupakan id dari user autentik.
* Nilai _secret key_ token JWT baik _access token_ ataupun _refresh token_ menggunakan _environment variable_ `ACCESS_TOKEN_KEY` dan `REFRESH_TOKEN_KEY`.

Spesifikasi _Data Validation_ pada _Request Payload_:

* **username**: string, required.
* **password**: string, required.

Respon yang harus dikembalikan:

* Status Code: **201**
* Response Body:
  ```json
  {
    "status": "success",
    "message": "Authentication berhasil ditambahkan",
    "data": {
      "accessToken": "jwt.access.token",
      "refreshToken": "jwt.refresh.token"
    }
  }
  ```

### Memperbarui Otentikasi

API menyediakan fitur _User Refresh Access Token_ melalui _route_:

* Method: **PUT**
* URL: `/authentications`
* Body Request:
  ```json
  {
    "refreshToken": "jwt.refresh.token"
  }
  ```

Ketentuan:

* _Refresh token_ memiliki _signature_ yang benar serta terdaftar di _database_.

Spesifikasi _Data Validation_ pada _Request Payload_:

* **refreshToken**: string, required.

Respon yang harus dikembalikan:

* Status Code: **200**
* Response Body:
  ```json
  {
    "status": "success",
    "message": "Authentication berhasil diperbarui",
    "data": {
      "accessToken": "jwt.access.token"
    }
  }
  ```

### Menghapus Otentikasi (_User Logout_)

API menyediakan fitur _user logout_ melalui _route_:

* Method: **DELETE**
* URL: `/authentications`
* Body Request:
  ```json
  {
    "refreshToken": "jwt.refresh.token"
  }
  ```

Ketentuan:

* _Refresh token_ terdaftar di _database_.

Spesifikasi _Data Validation_ pada _Request Payload_:

* **refreshToken**: string, required.

Respon yang harus dikembalikan:

* Status Code: **200**
* Response Body:
  ```json
  {
    "status": "success",
    "message": "Refresh token berhasil dihapus"
  }
  ```

## Playlist

### Menambahkan Playlist

API dapat menambahkan _playlist_ melalui _route_:

* Method: **POST**
* URL: `/playlists`
* Body Request:
  ```json
  {
    "name": string
  }
  ```

Contoh struktur objek:

```json
{
  "id": "playlist-Qbax5Oy7L8WKf74l",
  "name": "Lagu Indie Hits Indonesia",
  "owner": "user-Qbax5Oy7L8WKf74l",
}
```

Ketentuan:

* Playlist merupakan _resource_ yang dibatasi (_restrict_). Untuk mengaksesnya membutuhkan _access token_.
* Properti `owner` merupakan _user id_ dari pembuat _playlist_. Nilainya didapatkan melalui _artifacts payload_ JWT.

Spesifikasi _Data Validation_ pada _Request Payload_:

* **name**: string, required.

Respon yang harus dikembalikan:

* Status Code: **201**
* Response Body:
  ```json
  {
    "status": "success",
    "message": "Playlist berhasil ditambahkan",
    "data": {
      "playlistId": "playlist-Qbax5Oy7L8WKf74l"
    }
  }
  ```

### Menampilkan Daftar Playlist

API dapat menampilkan daftar _playlist_ yang dimiliki pengguna melalui _route_:

* Method: **GET**
* URL: `/playlists`

Respon yang harus dikembalikan:

* Status Code: **200**
* Response Body:
  ```json
  {
    "status": "success",
    "data": {
      "playlists": [
        {
          "id": "playlist-Qbax5Oy7L8WKf74l",
          "name": "Lagu Indie Hits Indonesia",
          "username": "dicoding"
        },
        {
          "id": "playlist-lmA4PkM3LseKlkmn",
          "name": "Lagu Untuk Membaca",
          "username": "dicoding"
        }
      ]
    }
  }
  ```

Ketentuan:

* Playlist yang muncul hanya yang ia (pengguna) miliki saja.

### Menghapus Playlist

API dapat menghapus _playlist_ melalui _route_:

* Method: **DELETE**
* URL: `/playlists/{playlistId}`

Ketentuan:

* Hanya pemilik (_owner_) yang dapat menghapus _playlist_.

Respon yang harus dikembalikan:

* Status Code: **200**
* Response Body:
  ```json
  {
    "status": "success",
    "message": "Playlist berhasil dihapus",
  }
  ```

### Menambahkan Lagu Ke Playlist

API dapat menambahkan lagu ke _playlist_ melalui _route_:

* Method: **POST**
* URL: `/playlists/{playlistId}/songs`
* Body Request:
  ```json
  {
    "songId": string
  }
  ```

Ketentuan:

* Hanya pemilik _playlist_ (atau kolabolator) yang dapat menambahkan lagu ke _playlist_.
* `songId` wajib bernilai id lagu yang valid.

Spesifikasi _Data Validation_ pada _Request Payload_:

* **songId**: string, required.

Respon yang harus dikembalikan:

* Status Code: **201**
* Response Body:
  ```json
  {
    "status": "success",
    "message": "Lagu berhasil ditambahkan ke playlist",
  }
  ```

### Menampilkan Daftar Lagu Pada Playlist

API dapat melihat daftar lagu pada _playlist_ melalui _route_:

* Method: **GET**
* URL: `/playlists/{playlistId}/songs`

Ketentuan:

* Hanya pemilik (dan kolabolator) _playlist_ yang dapat melihat daftar lagu pada _playlist_.

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
        }
      ]
    }
  }
  ```

### Menghapus Lagu Dari Playlist

API dapat menghapus lagu dari _playlist_ melalui _route_:

* Method: **DELETE**
* URL: `/playlists/{playlistId}/songs`
* Body Request:
  ```json
  {
    "songId": string
  }
  ```

Ketentuan:

* Hanya pemilik _playlist_ (atau kolabolator) yang dapat menghapus lagu dari _playlist_.
* `songId` wajib bernilai id lagu yang valid.

Respon yang harus dikembalikan:

* Status Code: **200**
* Response Body:
  ```json
  {
    "status": "success",
    "message": "Lagu berhasil dihapus dari playlist",
  }
  ```

## Kolaborator

### Menambahkan Kolaborator

Terdapat fitur menambahkan kolaborator pada _playlist_ melalui _route_:

* Method: **POST**
* URL: `/collaborations`
* Body Request:
  ```json
  {
    "playlistId": string,
    "userId": string,
  }
  ```

Objek _collaboration_ yang disimpan pada server memiliki struktur seperti contoh di bawah ini:

```json
{
  "id": "collab-Qbax5Oy7L8WKf74l",
  "playlistId": "playlist-Qbax5Oy7L8WKf74l",
  "userId": "user-Qbax5Oy7L8WKf74l"
}
```

Ketentuan:

* Hanya pemilik _playlist_ yang dapat menambahkan kolaborator.

Respon yang harus dikembalikan:

* Status Code: **201**
* Response Body:
  ```json
  {
    "status": "success",
    "message": "Kolaborator berhasil ditambahkan",
    "data": {
      "collaborationId": "collab-Qbax5Oy7L8WKf74l"
    }
  }
  ```

### Menghapus Kolaborator

Terdapat fitur menghapus kolaborator pada _playlist_ melalui _route_:

* Method: **DELETE**
* URL: `/collaborations`
* Body Request:
  ```json
  {
    "playlistId": string,
    "userId": string,
  }
  ```

Ketentuan:

* Hanya pemilik _playlist_ yang dapat menghapus kolaborator.

Respon yang harus dikembalikan:

* Status Code: **200**
* Response Body:
  ```json
  {
    "status": "success",
    "message": "Kolaborator berhasil dihapus"
  }
  ```

### Hak Akses Kolaborator

Ketika pengguna ditambahkan sebagai kolaborator _playlist_ oleh pemilik _playlist_. Maka hak akses pengguna tersebut terhadap _playlist_ adalah:

* _Playlist_ tampil pada permintaan **GET /playlists**.
* Dapat menambahkan lagu ke dalam _playlist_.
* Dapat menghapus lagu dari _playlist_.
* Dapat melihat daftar lagu yang ada di _playlist_.

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
- Ketika pengguna mengakses _resource_ yang dibatasi tanpa _access token_, server harus mengembalikan respon:
  - Status code: **401 (*Unauthorized*)**
  - Response body:
    - status: ***fail***
    - message: \<apa pun selama tidak kosong\>
- Ketika pengguna memperbarui access token menggunakan refresh token yang tidak valid, server harus mengembalikan response:
  - Status code: **400 (*Bad Request*)**
  - Response body:
    - status: ***fail***
    - message: \<apa pun selama tidak kosong\>
- Ketika pengguna mengakses resource yang bukan haknya, server harus mengembalikan response:
  - Status code: **403 (*Forbidden*)**
  - Response body:
    - status: ***fail***
    - message: \<apa pun selama tidak kosong\>
