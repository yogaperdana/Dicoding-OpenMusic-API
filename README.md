# OpenMusic API - _Message Broker Queue Consumer App_

![Node 14.17 LTS](https://img.shields.io/badge/Node-14.17_LTS-brightgreen.svg?style=flat-square)
![PostgreSQL 13.4](https://img.shields.io/badge/PostgreSQL-13.4-blue.svg?style=flat-square)
![Hapi 20.1.5](https://img.shields.io/badge/Hapi-20.1.5-orange.svg?style=flat-square)

Repositori proyek untuk submisi tugas kelas [Belajar Fundamental Aplikasi Back-End](dicoding.com/academies/271) pada platform [Dicoding Academy](dicoding.com)

## Program Konsumer

Pada aplikasi OpenMusic API versi 3 terdapat fitur _message broker_. Diperlukan sebuah proses aplikasi terpisah sebagai _consumer_ untuk mengambil pesan yang masih berada di _queue_ lalu meneruskannya ke email yang dituju.

Pastikan untuk install [RabbitMQ](rabbitmq.com/download.html) pada PC sebelum menggunakan aplikasi ini.

## Menjalankan Aplikasi

Sesuaikan nilai pada variabel yang ada pada berkas [.env](./.env) dengan pengaturan sistem. Lalu install _packages_ yang digunakan pada aplikasi ini dengan menggunakan perintah:

```sh
npm install
```

Untuk menjalankan aplikasi pada ***development*** *environment*, gunakan perintah berikut:

```sh
npm run start-dev
```

Untuk menjalankan aplikasi pada ***production*** *environment*, ubah _script_ pada [package.json](./package.json) dan variabel pada berkas [.env](./.env) dengan pengaturan _deployment_ sesuai server yang digunakan.

## Hak Cipta dan Lisensi

Pembuatan aplikasi ini digunakan murni sebagai keperluan pembelajaran pada platform [Dicoding Indonesia](dicoding.com). Hak cipta materi/modul sepenuhnya dimiliki oleh platform.

Kode aplikasi pada repositori ini dibuat secara terbuka (_open source_) di bawah lisensi [ISC](isc.org/licenses), kecuali untuk _external packages_ memuat lisensi yang berbeda-beda.

Walaupun setiap peserta kelas akan mendapatkan tugas dengan kriteria yang sama, **mohon untuk tidak melakukan plagiasi penuh untuk tugas submisi Anda berdasarkan repositori ini.**
