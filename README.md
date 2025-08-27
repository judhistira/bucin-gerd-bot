# GERD Meal Reminder Bot

Bot Discord sederhana yang dirancang untuk menjadi teman pengingat makan bagi penderita GERD. Bot ini memberikan rekomendasi makanan yang aman dan sesuai dengan kondisi cuaca, serta pesan penyemangat yang personal menggunakan AI dengan gaya karakter Rangga dari film "Ada Apa Dengan Cinta?".

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fusername%2Freponame) *<-- Ganti `username/reponame` dengan URL repo Anda untuk membuat tombol ini berfungsi!*

---

## ✨ Fitur Utama

- **Pengingat Terjadwal**: Mengirim pengingat makan 3x sehari secara otomatis.
- **Rekomendasi Cerdas**: Rekomendasi makanan disesuaikan dengan cuaca (panas/tidak panas) dan waktu (pagi/siang/malam) berdasarkan perbedaan suhu dengan rata-rata Indonesia.
- **Database Makanan GERD**: Database berisi 20 makanan nasi dan 20 makanan non-nasi untuk setiap waktu makan yang umum dimakan orang Indonesia, terjangkau, mudah didapat, dan ramah GERD.
- **Personalisasi AI**: Pesan dibuat seolah-olah dari orang terdekat menggunakan Google Gemini API dengan gaya karakter Rangga.
- **Optimasi Penggunaan API**: Menggabungkan pesan penyemangat dan pesan akhir dalam satu panggilan API.
- **Pemecahan Pesan Panjang**: Memecah pesan yang melebihi 2000 karakter menjadi beberapa bagian.
- **Siap Deploy**: Dioptimalkan untuk deployment mudah dan gratis di Vercel.

## 🚀 Teknologi

- **Runtime**: Node.js
- **Framework**: Express.js
- **Library Discord**: Discord.js v14
- **AI**: Google Gemini API (`gemini-1.5-flash`)
- **Data Cuaca**: OpenWeatherMap API
- **Deployment**: Vercel
- **Penjadwalan**: Cron Job Eksternal (misal: cron-job.org)

## 📁 Struktur Proyek

Proyek ini telah direfaktor untuk memiliki struktur yang lebih modular:

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
├── .env              # Konfigurasi environment
├── .env.example      # Contoh konfigurasi environment
├── README.md         # Dokumentasi
└── DOCUMENTATION.md  # Dokumentasi lengkap
```

## 📖 Dokumentasi Lengkap

Untuk informasi lebih detail tentang struktur proyek, cara kerja, dan penggunaan, silakan lihat [DOCUMENTATION.md](DOCUMENTATION.md).

## 🛠️ Instalasi & Konfigurasi Lokal

Ikuti langkah-langkah ini untuk menjalankan bot di komputer Anda untuk development.

1.  **Clone Repositori**
    ```bash
    git clone https://github.com/username/nama-repo.git
    cd nama-repo
    ```

2.  **Install Dependensi**
    ```bash
    npm install
    ```

3.  **Buat File `.env`**
    Buat file baru bernama `.env` di root proyek dan salin konten dari `.env.example` (jika ada) atau isi dengan variabel berikut:

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

## 🧪 Menjalankan Tes Lokal

Proyek ini menyediakan dua cara untuk menguji bot:

### 1. Tes Pengiriman ke Discord
Mengirim satu pesan pengingat secara manual ke channel Discord Anda:
```bash
npm run test-reminder
```

### 2. Tes Output di Console
Menampilkan output pesan di console tanpa mengirim ke Discord:
```bash
npm run test:console
```

## ☁️ Deployment ke Vercel

Proyek ini dirancang untuk dideploy dengan mudah ke Vercel.

1.  **Push Kode ke GitHub**: Pastikan semua perubahan terakhir sudah Anda `push` ke repositori GitHub Anda.
2.  **Impor Proyek di Vercel**: 
    - Buka dashboard Vercel Anda.
    - Klik "Add New..." -> "Project".
    - Pilih repositori bot Anda.
3.  **Atur Environment Variables**: 
    - Di halaman konfigurasi proyek Vercel, buka bagian "Environment Variables".
    - Tambahkan semua variabel yang ada di file `.env` Anda.
4.  **Deploy**: Klik tombol "Deploy". Vercel akan otomatis menginstal dependensi dan membangun proyek.

Setelah selesai, bot Anda akan aktif dan memiliki endpoint yang siap dipanggil.

## ⚙️ Konfigurasi Penjadwalan (Cron Job Eksternal)

Karena batasan paket gratis Vercel, penjadwalan tidak lagi menggunakan Vercel Cron. Anda harus menggunakan layanan **cron job eksternal** untuk memanggil bot secara berkala.

1.  **Dapatkan URL Webhook**: Setelah deployment berhasil, URL webhook Anda akan terlihat seperti ini:
    `https://<nama-proyek-anda>.vercel.app/gerd-reminder`
    Ganti `<nama-proyek-anda>` dengan nama proyek Anda di Vercel.

2.  **Gunakan Layanan Cron Job Eksternal**:
    - Daftar di layanan gratis seperti [cron-job.org](https://cron-job.org/) atau layanan serupa.
    - Buat tiga cron job baru untuk jadwal pengingat yang Anda inginkan (misal: pagi, siang, malam).
    - Untuk setiap cron job, masukkan URL webhook Anda sebagai target yang harus dipanggil.
    - Atur jadwal sesuai waktu yang Anda inginkan. Ingat untuk menyesuaikan zona waktu jika diperlukan.

    Contoh jadwal (WIB):
    - **Pagi**: `0 7 * * *`
    - **Siang**: `0 12 * * *`
    - **Malam**: `0 19 * * *`

Dengan cara ini, layanan eksternal akan memicu bot Anda untuk mengirim pengingat sesuai jadwal yang telah ditentukan.

## 🌡️ Klasifikasi Cuaca yang Lebih Cerdas

Bot ini sekarang menggunakan pendekatan yang lebih cerdas untuk menentukan apakah cuaca saat ini "panas" atau "tidak panas":

- **Berdasarkan suhu rata-rata Indonesia**: Menggunakan nilai suhu rata-rata untuk setiap fase waktu (pagi, siang, malam) sebagai acuan
- **Perbedaan suhu**: Mengklasifikasikan cuaca sebagai "panas" jika suhu saat ini 2°C atau lebih di atas suhu rata-rata untuk fase waktu tersebut
- **Disesuaikan dengan fase waktu**: Memiliki suhu rata-rata yang berbeda untuk pagi (26°C), siang (30°C), dan malam (27°C)

Pendekatan ini memungkinkan bot untuk memberikan rekomendasi makanan yang lebih tepat sesuai dengan kondisi cuaca relatif terhadap kebiasaan cuaca di Indonesia.

## 💖 Gaya Bahasa Bot

Bot ini menggunakan gaya bahasa yang terinspirasi dari karakter Rangga dalam film "Ada Apa Dengan Cinta?":
- **Dingin & Hemat Kata**: Berbicara seperlunya, tidak suka basa-basi
- **Sarkastis & Sinis Ringan**: Kadang ucapannya bernada menyindir dengan halus
- **Diam-diam menaruh perhatian**: Menunjukkan kepedulian secara halus
- **Puitis**: Bahasa yang penuh perasaan dan estetika
- **Introspektif**: Pemikiran yang dalam tentang cinta dan perhatian
- **Personal dan Intimate**: Pesan yang terasa seperti dari kekasih

## 🍽️ Database Makanan

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

## ⚡ Optimasi Penggunaan API

Untuk menghemat penggunaan API Google Gemini, bot kini menggabungkan:
- Pembuatan pesan penyemangat
- Pembuatan pesan akhir

Dalam satu panggilan API, yang membuat bot lebih efisien dan mengurangi biaya penggunaan API.

## 📝 Pemecahan Pesan Panjang

Bot kini dapat memecah pesan yang melebihi 2000 karakter (batas maksimal pesan Discord) menjadi beberapa bagian:
- Memecah pesan berdasarkan paragraf terlebih dahulu
- Jika paragraf terlalu panjang, memecah berdasarkan kalimat
- Menambahkan jeda kecil antar pesan untuk menghindari rate limiting
- Menampilkan pesan sebagai serangkaian pesan terpisah di Discord
