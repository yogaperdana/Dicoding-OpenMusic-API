# OpenMusic API versi 2

![Node 14.17 LTS](https://img.shields.io/badge/Node-14.17_LTS-brightgreen.svg?style=flat-square)
![PostgreSQL 13.4](https://img.shields.io/badge/PostgreSQL-13.4-blue.svg?style=flat-square)
![Hapi 20.1.5](https://img.shields.io/badge/Hapi-20.1.5-orange.svg?style=flat-square)

Repositori proyek untuk submisi tugas kelas [Belajar Fundamental Aplikasi Back-End](dicoding.com/academies/271) pada platform [Dicoding Academy](dicoding.com)

## Kriteria Project

- Menggunakan Framework Node.js yaitu [Hapi Framework](hapi.dev).
- Menggunakan [Hapi Plugin](hapi.dev/plugins).
- Menggunakan [Joi](joi.dev) untuk proses validasi data.
- Menerapkan **CORS** pada seluruh _resource_ yang ada.
- Menggunakan [ESLint](eslint.org) dan salah satu _style guide_ (project ini menggunakan _style_ airbnb-base).
- Data disimpan di dalam database menggunakan [PostgreSQL](postgresql.org).
- Menggunakan teknik _migrations_ dalam mengelola struktur tabel pada database.
- Menyimpan nilai _host_, _post_, maupun kredensial dalam mengakses database pada _environment variable_ dengan ketentuan:
  - `PGUSER` : menyimpan nilai _user_ untuk mengakses database.
  - `PGPASSWORD` : menyimpan nilai _password_ dari _user_ database.
  - `PGDATABASE` : menyimpan nilai nama _database_ yang digunakan.
  - `PGHOST` : menyimpan nilai _host_ yang digunakan oleh database.
  - `PGPORT` :  menyimpan nilai _port_ yang digunakan oleh database.
- Menggunakan package [dotenv](npmjs.com/package/dotenv) serta berkas `.env` dalam mengelola _environment variable_.

## Kriteria API

Dokumentasi kriteria API dapat dilihat di berkas [API.md](./API.md)

## Menjalankan Aplikasi

Buat dulu database dengan nama **openmusicapp** pada PostgreSQL dan berikan hak akses ke user yang digunakan dengan kueri berikut melalui **psql**:

```sql
CREATE DATABASE openmusicapp;
GRANT ALL PRIVILEGES ON DATABASE openmusicapp TO <username>;
```

Lalu sesuaikan nilai pada variabel yang ada pada berkas [.env](./.env) dengan pengaturan sistem (baca kriteria project).

Berikutnya, install terlebih dahulu _packages_ yang digunakan pada aplikasi ini dengan menggunakan perintah:

```sh
npm install
```

Kemudian lakukan _database migration_ dengan menggunakan perintah:

```sh
npm run migrate up
```

Untuk menjalankan aplikasi pada ***development*** *environment*, gunakan perintah berikut:

```sh
npm run start-dev
```

Untuk menjalankan aplikasi pada ***production*** *environment*, ubah _script_ pada [package.json](./package.json) dan variabel pada berkas [.env](./.env) dengan pengaturan _deployment_ sesuai server yang digunakan.

## Pengujian

Pengujian API dilakukan dengan menggunakan _tools_ [Postman](https://www.postman.com). Berkas _test collection_ dan _environment_ dapat diunduh pada [tautan ini](https://github.com/dicodingacademy/a271-backend-menengah-labs/raw/099-shared-files/03-submission-content/02-open-music-api-v2/OpenMusic%20API%20V2%20Test.zip).

## Hak Cipta dan Lisensi

Pembuatan aplikasi ini digunakan murni sebagai keperluan pembelajaran pada platform [Dicoding Indonesia](dicoding.com). Hak cipta materi/modul sepenuhnya dimiliki oleh platform.

Kode aplikasi pada repositori ini dibuat secara terbuka (_open source_) di bawah lisensi [ISC](isc.org/licenses), kecuali untuk _external packages_ memuat lisensi yang berbeda-beda.

Walaupun setiap peserta kelas akan mendapatkan tugas dengan kriteria yang sama, **mohon untuk tidak melakukan plagiasi penuh untuk tugas submisi Anda berdasarkan repositori ini.**
