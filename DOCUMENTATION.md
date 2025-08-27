# GERD Meal Reminder Bot - Panduan Lengkap

## 📋 Daftar Isi
- [Deskripsi](#deskripsi)
- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Struktur Proyek](#struktur-proyek)
- [Instalasi & Konfigurasi Lokal](#instalasi--konfigurasi-lokal)
- [Menjalankan Tes Lokal](#menjalankan-tes-lokal)
- [Deployment ke Vercel](#deployment-ke-vercel)
- [Konfigurasi Penjadwalan (Cron Job Eksternal)](#konfigurasi-penjadwalan-cron-job-eksternal)
- [Klasifikasi Cuaca yang Lebih Cerdas](#klasifikasi-cuaca-yang-lebih-cerdas)

## Deskripsi
Bot Discord yang mengingatkan penderita GERD untuk makan teratur dengan rekomendasi makanan berdasarkan cuaca dan waktu. Bot ini menggunakan Google Gemini API untuk membuat rekomendasi makanan yang personal dan pesan penyemangat yang hangat dengan gaya karakter Rangga dari film "Ada Apa Dengan Cinta?".

## Fitur Utama
- **Pengingat Terjadwal**: Mengirim pengingat makan 3x sehari secara otomatis.
- **Rekomendasi Cerdas**: Rekomendasi makanan disesuaikan dengan cuaca (panas/tidak panas) dan waktu (pagi/siang/malam).
- **Database Makanan GERD**: Database berisi 20 makanan nasi dan 20 makanan non-nasi untuk setiap waktu makan yang umum dimakan orang Indonesia, terjangkau, mudah didapat, dan ramah GERD.
- **Personalisasi AI**: Pesan dibuat seolah-olah dari orang terdekat menggunakan Google Gemini API dengan gaya karakter Rangga.
- **Optimasi Penggunaan API**: Menggabungkan pesan penyemangat dan pesan akhir dalam satu panggilan API.
- **Pemecahan Pesan Panjang**: Memecah pesan yang melebihi 2000 karakter menjadi beberapa bagian.
- **Siap Deploy**: Dioptimalkan untuk deployment mudah dan gratis di Vercel.

## Teknologi yang Digunakan
- **Runtime**: Node.js
- **Framework**: Express.js
- **Library Discord**: Discord.js v14
- **AI**: Google Gemini API (`gemini-1.5-flash`)
- **Data Cuaca**: OpenWeatherMap API
- **Deployment**: Vercel
- **Penjadwalan**: Cron Job Eksternal (misal: cron-job.org)

## Struktur Proyek
Proyek ini telah direfaktor untuk memiliki struktur yang lebih modular dan mudah dikelola:

```bash
.
├── index.js          # Entry point aplikasi dan webhook handler
├── bot.js            # Logika inti bot
├── gemini.js         # Interaksi dengan Google Gemini API
├── foods.js          # Database makanan GERD-friendly
├── utils.js          # Fungsi utilitas
├── test-reminder.js  # Script untuk testing pengiriman ke Discord
├── test-console.js   # Script untuk testing output di console
├── package.json      # Dependensi dan script
├── .env              # Konfigurasi environment (tidak termasuk dalam repo)
├── .env.example      # Contoh konfigurasi environment
├── README.md         # Dokumentasi utama
├── prompt.txt        # Dokumentasi teknis
└── vercel.json       # Konfigurasi deployment Vercel
```

### Penjelasan File:
1. **`index.js`**: Entry point aplikasi yang menjalankan server Express dan menangani webhook dari layanan cron eksternal.
2. **`bot.js`**: Berisi logika inti bot untuk mengambil data cuaca, menentukan waktu, memecah pesan panjang, dan mengirim pesan ke Discord.
3. **`gemini.js`**: Mengelola semua interaksi dengan Google Gemini API, termasuk pembuatan prompt dan pemrosesan respons. Telah dioptimalkan untuk menggabungkan pesan penyemangat dan pesan akhir dalam satu panggilan API.
4. **`foods.js`**: Database makanan GERD-friendly yang berisi 20 makanan nasi dan 20 makanan non-nasi untuk setiap waktu makan yang umum dimakan orang Indonesia, terjangkau, mudah didapat, dan ramah GERD.
5. **`utils.js`**: Kumpulan fungsi utilitas seperti penentuan waktu dan pemecahan pesan panjang.
6. **`test-reminder.js`**: Script untuk menguji pengiriman pesan langsung ke channel Discord.
7. **`test-console.js`**: Script untuk menguji output pesan di console tanpa perlu koneksi Discord.
8. **`.env.example`**: Template untuk file konfigurasi environment.

## Instalasi & Konfigurasi Lokal

Ikuti langkah-langkah ini untuk menjalankan bot di komputer Anda untuk development.

### 1. Clone Repositori
```bash
git clone https://github.com/username/nama-repo.git
cd nama-repo
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Buat file baru bernama `.env` di root proyek dan salin konten dari `.env.example`, lalu isi dengan nilai yang sesuai:

```env
# Token dari Discord Developer Portal
DISCORD_TOKEN="..."

# API Key dari Google AI Studio
GEMINI_API_KEY="..."

# API Key dari OpenWeatherMap
OPENWEATHER_API_KEY="..."

# ID Channel Discord tujuan pengingat
CHANNEL_ID="..."

# Lokasi untuk data cuaca (opsional)
LOCATION="Jatibarang, ID"
```

## Menjalankan Tes Lokal

Proyek ini menyediakan dua cara untuk menguji bot:

### 1. Tes Pengiriman ke Discord
Mengirim satu pesan pengingat secara manual ke channel Discord Anda:
```bash
npm run test-reminder
```

Script ini akan menjalankan bot, mengirim satu pesan, lalu otomatis berhenti. Sangat berguna untuk menguji koneksi dan format pesan.

### 2. Tes Output di Console
Menampilkan output pesan di console tanpa mengirim ke Discord:
```bash
npm run test:console
```

Script ini sangat berguna untuk menguji prompt AI dan melihat hasilnya dengan cepat tanpa perlu koneksi ke Discord.

## Deployment ke Vercel

Proyek ini dirancang untuk dideploy dengan mudah ke Vercel.

### 1. Push Kode ke GitHub
Pastikan semua perubahan terakhir sudah Anda `push` ke repositori GitHub Anda.

### 2. Impor Proyek di Vercel
- Buka dashboard Vercel Anda.
- Klik "Add New..." -> "Project".
- Pilih repositori bot Anda.

### 3. Atur Environment Variables
- Di halaman konfigurasi proyek Vercel, buka bagian "Environment Variables".
- Tambahkan semua variabel yang ada di file `.env` Anda.

### 4. Deploy
Klik tombol "Deploy". Vercel akan otomatis menginstal dependensi dan membangun proyek.

Setelah selesai, bot Anda akan aktif dan memiliki endpoint yang siap dipanggil.

## Konfigurasi Penjadwalan (Cron Job Eksternal)

Karena batasan paket gratis Vercel, penjadwalan tidak lagi menggunakan Vercel Cron. Anda harus menggunakan layanan **cron job eksternal** untuk memanggil bot secara berkala.

### 1. Dapatkan URL Webhook
Setelah deployment berhasil, URL webhook Anda akan terlihat seperti ini:
`https://<nama-proyek-anda>.vercel.app/gerd-reminder`
Ganti `<nama-proyek-anda>` dengan nama proyek Anda di Vercel.

### 2. Gunakan Layanan Cron Job Eksternal
- Daftar di layanan gratis seperti [cron-job.org](https://cron-job.org/) atau layanan serupa.
- Buat tiga cron job baru untuk jadwal pengingat yang Anda inginkan (pagi, siang, malam).
- Untuk setiap cron job, masukkan URL webhook Anda sebagai target yang harus dipanggil.
- Atur jadwal sesuai waktu yang Anda inginkan. Ingat untuk menyesuaikan zona waktu jika diperlukan.

Contoh jadwal (WIB):
- **Pagi**: `0 7 * * *`
- **Siang**: `0 12 * * *`
- **Malam**: `0 19 * * *`

Dengan cara ini, layanan eksternal akan memicu bot Anda untuk mengirim pengingat sesuai jadwal yang telah ditentukan.

## Klasifikasi Cuaca yang Lebih Cerdas

Bot ini menggunakan pendekatan yang lebih cerdas untuk menentukan apakah cuaca saat ini "panas" atau "tidak panas":

- **Berdasarkan suhu rata-rata Indonesia**: Menggunakan nilai suhu rata-rata untuk setiap fase waktu (pagi, siang, malam) sebagai acuan
- **Perbedaan suhu**: Mengklasifikasikan cuaca sebagai "panas" jika suhu saat ini 2°C atau lebih di atas suhu rata-rata untuk fase waktu tersebut
- **Disesuaikan dengan fase waktu**: Memiliki suhu rata-rata yang berbeda untuk pagi (26°C), siang (30°C), dan malam (27°C)

Pendekatan ini memungkinkan bot untuk memberikan rekomendasi makanan yang lebih tepat sesuai dengan kondisi cuaca relatif terhadap kebiasaan cuaca di Indonesia.

## Gaya Bahasa Bot

Bot ini menggunakan gaya bahasa yang terinspirasi dari karakter Rangga dalam film "Ada Apa Dengan Cinta?":
- **Dingin & Hemat Kata**: Berbicara seperlunya, tidak suka basa-basi
- **Sarkastis & Sinis Ringan**: Kadang ucapannya bernada menyindir dengan halus
- **Diam-diam menaruh perhatian**: Menunjukkan kepedulian secara halus
- **Puitis**: Bahasa yang penuh perasaan dan estetika
- **Introspektif**: Pemikiran yang dalam tentang cinta dan perhatian
- **Personal dan Intimate**: Pesan yang terasa seperti dari kekasih

## Database Makanan

Bot menggunakan database makanan yang berisi:
- **60 makanan berbasis nasi** (20 untuk setiap waktu: pagi, siang, malam)
- **60 makanan non-nasi** (20 untuk setiap waktu: pagi, siang, malam)

Setiap rekomendasi makanan dipilih secara acak dari database ini, dengan mempertimbangkan:
- Waktu makan (pagi/siang/malam)
- Kondisi cuaca (panas/tidak panas)
- Kebutuhan diet GERD (tidak pedas, tidak asam, tidak berlemak)
- **Kriteria tambahan**:
  - Umum dimakan orang Indonesia
  - Tidak terlalu mahal
  - Mudah didapatkan oleh pekerja kantoran
  - Umumnya tersedia di warung makan

## Optimasi Penggunaan API

Untuk menghemat penggunaan API Google Gemini, bot kini menggabungkan:
- Pembuatan pesan penyemangat
- Pembuatan pesan akhir

Dalam satu panggilan API, yang membuat bot lebih efisien dan mengurangi biaya penggunaan API.

## Pemecahan Pesan Panjang

Bot kini dapat memecah pesan yang melebihi 2000 karakter (batas maksimal pesan Discord) menjadi beberapa bagian:
- Memecah pesan berdasarkan paragraf terlebih dahulu
- Jika paragraf terlalu panjang, memecah berdasarkan kalimat
- Menambahkan jeda kecil antar pesan untuk menghindari rate limiting
- Menampilkan pesan sebagai serangkaian pesan terpisah di Discord