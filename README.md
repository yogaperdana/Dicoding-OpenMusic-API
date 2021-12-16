# OpenMusic API versi 3

[![Node 17.2.0](https://img.shields.io/badge/Node-17.2.0-brightgreen.svg?style=flat-square)](https://nodejs.org/en/download/)
[![PostgreSQL 14.1](https://img.shields.io/badge/PostgreSQL-14.1-blue.svg?style=flat-square)](https://www.postgresql.org/download/)
[![Hapi 20.2.1](https://img.shields.io/badge/Hapi-20.2.1-orange.svg?style=flat-square)](https://hapi.dev)
[![Node-Redis 4.0.1](https://img.shields.io/badge/Node--Redis-4.0.1-red.svg?style=flat-square)](https://github.com/redis/node-redis)

Repositori proyek untuk submisi tugas kelas [Belajar Fundamental Aplikasi Back-End](https://dicoding.com/academies/271) pada platform [Dicoding Academy](https://dicoding.com)

Dikerjakan oleh [Yoga Perdana Putra](https://github.com/yogaperdana)

## Kriteria Project

- Menggunakan Framework Node.js yaitu [Hapi Framework](https://hapi.dev).
- Menggunakan [Hapi Plugin](https://hapi.dev/plugins).
- Menggunakan [Joi](https://joi.dev) untuk proses validasi data.
- Menerapkan **CORS** pada seluruh _resource_ yang ada.
- Menggunakan [ESLint](https://eslint.org) dan salah satu _style guide_ (project ini menggunakan _style_ [airbnb-base](https://github.com/airbnb/javascript)).
- Data disimpan di dalam database menggunakan [PostgreSQL](https://postgresql.org).
- Menggunakan teknik _migrations_ dalam mengelola struktur tabel pada database.
- Menyimpan nilai _host_, _post_, maupun kredensial dalam mengakses database pada _environment variable_ dengan ketentuan:
  - `PGUSER` : menyimpan nilai _user_ untuk mengakses database.
  - `PGPASSWORD` : menyimpan nilai _password_ dari _user_ database.
  - `PGDATABASE` : menyimpan nilai nama _database_ yang digunakan.
  - `PGHOST` : menyimpan nilai _host_ yang digunakan oleh database.
  - `PGPORT` :  menyimpan nilai _port_ yang digunakan oleh database.
- Menggunakan package [dotenv](https://npmjs.com/package/dotenv) serta berkas `.env` dalam mengelola _environment variable_.
- Menerapkan _server-side caching_ pada _resource_ yang diperlukan.

## Kriteria API

Dokumentasi kriteria API dapat dilihat di berkas [API.md](./API.md)

## Program Konsumer

Pada aplikasi versi 3 ini terdapat fitur _message broker_. Diperlukan sebuah proses aplikasi terpisah sebagai _consumer_ untuk mengambil pesan yang masih berada di _queue_ lalu meneruskannya ke email yang dituju menggunakan [Nodemailer](https://nodemailer.com). Repositori dan dokumentasi program konsumer dapat dilihat pada _branch_ [consumer](https://github.com/yogaperdana/Dicoding-OpenMusic-API/tree/consumer).

## Aplikasi Tambahan

Pada aplikasi versi 3 ini terdapat fitur tambahan yang memerlukan perangkat lunak tambahan untuk menjalankannya. Install aplikasi berikut pada PC sebelum menggunakan API:

- [RabbitMQ](https://rabbitmq.com/download.html) untuk _Message Broker_
- [Redis](https://redis.io/download)/[Memurai](https://memurai.com/get-memurai) untuk _Server-Side Caching_

## Menjalankan Aplikasi

Buat dulu database dengan nama `openmusicapp` pada PostgreSQL dan berikan hak akses ke user yang digunakan dengan kueri berikut melalui `psql`:

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

Gunakan perintah berikut pada `node` untuk membuat ***token***:

```js
require('crypto').randomBytes(64).toString('hex');
```

## Pengujian

Pengujian API dilakukan dengan menggunakan _tools_ [Postman](https://www.postman.com). Berkas _test collection_ dan _environment_ dapat diunduh pada [tautan ini](https://github.com/dicodingacademy/a271-backend-menengah-labs/raw/099-shared-files/03-submission-content/03-open-music-api-v3/OpenMusic%20API%20V3%20Test.zip).

Untuk pengujian _upload files_ perlu dilakukan secara manual (tidak bisa secara otomasi). Pastikan juga untuk menyesuaikan _environment variables_ yang ada di Postman.

Jika ingin menghapus seluruh data yang ada pada tabel database, gunakan perintah berikut ini pada `psql`:

```sql
TRUNCATE users, authentications, songs, playlists, playlistsongs, collaborations;
```

## Hak Cipta dan Lisensi

Pembuatan aplikasi ini digunakan murni sebagai keperluan pembelajaran pada platform [Dicoding Indonesia](https://dicoding.com). Hak cipta materi/modul sepenuhnya dimiliki oleh platform.

Kode aplikasi pada repositori ini dibuat secara terbuka (_open source_) di bawah lisensi [ISC](https://isc.org/licenses), kecuali untuk _external packages_ memuat lisensi yang berbeda-beda.

Walaupun setiap peserta kelas akan mendapatkan tugas dengan kriteria yang sama, **mohon untuk tidak melakukan plagiasi penuh untuk tugas submisi Anda berdasarkan repositori ini.**
