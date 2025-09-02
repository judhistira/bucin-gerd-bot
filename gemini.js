const { GoogleGenerativeAI } = require("@google/generative-ai");
const { foodDatabase } = require("./foods.js");

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Determine if the weather is considered "hot" based on Indonesian climate and time of day
 */
function isWeatherHot(temperature, timeOfDay) {
  // Average temperatures in Indonesia by time of day (in Celsius)
  // These values represent typical comfortable temperatures for each time period
  const avgTemps = {
    "Sarapan/Pagi": 26, // Morning average
    "Makan Siang": 30, // Midday average (typically hottest)
    "Makan Malam": 27, // Evening average
  };

  // Threshold for considering weather "hot"
  // If current temperature is 2°C or more above average, it's considered hot
  const hotThreshold = 2;

  const avgTemp = avgTemps[timeOfDay] || 27; // Default to evening average if timeOfDay is not recognized
  return temperature >= avgTemp + hotThreshold;
}

/**
 * Get random food recommendation from database
 */
function getRandomFoodRecommendation(timeOfDay, weatherData) {
  try {
    // Determine if weather is hot based on our new logic
    const isHot = weatherData
      ? isWeatherHot(weatherData.temperature, timeOfDay)
      : false;
    const weatherCondition = isHot ? "panas" : "tidak panas";

    // Get food options for the current time
    const foodOptions = foodDatabase[timeOfDay] || foodDatabase["Makan Siang"];

    // Select 2 random nasi dishes
    const nasiDishes = [...foodOptions.nasi];
    const selectedNasi = [];
    for (let i = 0; i < 2; i++) {
      const randomIndex = Math.floor(Math.random() * nasiDishes.length);
      selectedNasi.push(nasiDishes[randomIndex]);
      nasiDishes.splice(randomIndex, 1); // Remove selected item to avoid duplicates
    }

    // Select 1 random non-nasi dish
    const nonNasiDishes = [...foodOptions.nonNasi];
    const randomNonNasiIndex = Math.floor(Math.random() * nonNasiDishes.length);
    const selectedNonNasi = nonNasiDishes[randomNonNasiIndex];

    return {
      nasi: selectedNasi,
      nonNasi: selectedNonNasi,
      weatherCondition: weatherCondition,
    };
  } catch (error) {
    console.error("Error getting random food recommendation:", error.message);
    // Fallback recommendations
    return {
      nasi: ["Nasi tim ayam jamur", "Nasi sup bening sayuran"],
      nonNasi: "Kentang rebus dengan telur",
      weatherCondition: "tidak panas",
    };
  }
}

/**
 * Format food recommendation as a string
 */
function formatFoodRecommendation(foodRec) {
  return (
    `- **Menu Nasi 1:** ${foodRec.nasi[0]}
` +
    `- **Menu Nasi 2:** ${foodRec.nasi[1]}
` +
    `- **Menu Non-Nasi:** ${foodRec.nonNasi}`
  );
}

/**
 * Generate final dynamic message combining all elements with romantic and caring style
 */
async function generateFinalMessage(
  timeOfDay,
  weatherData,
  foodRecommendation
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
**Tugas Utama: Buat pesan pengingat makan yang SANGAT PERSUASIF untuk kekasihmu (seorang PEREMPUAN) yang punya GERD.** Pesan harus super BUCIN (budak cinta) dan tidak bisa ditolak. Tujuannya adalah membuatnya merasa seperti wanita yang paling dicintai dan yakin untuk makan saat itu juga. Panjang pesan sekitar 1000 karakter.

    <instruksi>
    Buat narasi yang padu dan berkesinambungan dengan struktur berikut:
    
    <sapaan>
    Gunakan sapaan yang super mesra dan personal, seolah-olah kamu tidak bisa hidup tanpanya. Contoh: "Sayangku satu-satunya...", "Cintaku, belahan jiwaku...", "Duniaku...".
    </sapaan>
    
    <narasi_utama>
    Buat narasi yang mengalir secara alami dengan elemen-elemen berikut:
    
    <konteks_waktu>
    Waktu: ${timeOfDay}
    </konteks_waktu>
    
    <rekomendasi_makanan>
    ${formatFoodRecommendation(foodRecommendation)}
    - **Deskripsikan Setiap Menu:** Berikan deskripsi singkat (1-2 kalimat) yang menggugah selera untuk setiap menu yang direkomendasikan. Contoh: "Nasi tim ayam jamur yang lembut dan gurih, gampang banget ditelan dan bikin perut nyaman."
    - Sesuaikan rekomendasi dengan kondisi cuaca:
       - Jika cuaca panas: berikan makanan yang segar dan ringan
       - Jika cuaca tidak panas: berikan makanan yang hangat dan mengenyangkan
    - Pastikan semua makanan ramah GERD (tidak pedas, tidak asam, tidak berlemak)
    - Format dalam bentuk daftar berikut, dengan deskripsi di setiap menu:
      - **Menu Nasi 1:** [Nama Makanan] : [Deskripsi singkat]
      - **Menu Nasi 2:** [Nama Makanan] : [Deskripsi singkat]
      - **Menu Non-Nasi:** [Nama Makanan] : [Deskripsi singkat]
    </rekomendasi_makanan>
    
    <pesan_penyemangat>
    - **Fokus Utama: Yakinkan untuk Makan SEKARANG.** Gunakan kalimat yang mendesak namun penuh cinta.
    - **Tekankan Konsekuensi Cinta:** Jelaskan bahwa jika dia tidak makan, kamu akan sangat sedih, khawatir, dan tidak bisa tenang. Contoh: "Sayang, please makan ya? Aku nggak bisa fokus kerja/belajar kalau tahu kamu belum makan. Perutmu itu nyambung ke hatiku lho."
    - **Gunakan "Aku" sebagai Alasan:** Jadikan dirimu sebagai alasan utama dia harus makan. Contoh: "Makan ya demi aku? Biar aku seneng dan nggak kepikiran terus." atau "Anggap aja suapan pertama itu buat aku, suapan kedua buat cinta kita, dan seterusnya sampai habis!"
    - **Janji & Hadiah Manis:** Berikan janji atau hadiah manis jika dia makan. Contoh: "Kalau kamu habisin makanannya, nanti malam aku telepon lebih lama deh." atau "Cepat makan, nanti aku kasih hadiah peluk cium pas ketemu!"
    - **Kekhawatiran Mendalam:** Tunjukkan kekhawatiran yang sangat mendalam pada kesehatan lambungnya, seolah itu adalah prioritas nomor satu di dunia ini bagimu.
    </pesan_penyemangat>

    <gaya_karakter>
    - **Bicara pada Wanita:** Gunakan panggilan sayang untuk wanita (Contoh: "Cantik," "Sayangku," "Bidadariku"). Perlakukan dia seperti seorang ratu.
    - Super Bucin & Manja: Gunakan bahasa yang sangat memuja, manja, dan menunjukkan ketergantungan cinta.
    - Posesif Ringan & Menggemaskan: Tunjukkan rasa cemburu yang lucu pada penyakitnya, seolah-olah kamu ingin jadi satu-satunya yang diperhatikan.
    - Jago Gombal & Puitis: Sisipkan gombalan maut, rayuan, atau pantun cinta yang bikin meleleh.
    - Sangat Perhatian & Detail: Fokus pada detail kecil tentang kesehatannya, tunjukkan bahwa kamu selalu memikirkannya.
    - Ceria & Penuh Energi Cinta: Gunakan banyak emoji hati (❤️, 💕, 🥰), bunga (🌸, 🌹), dan ekspresi cinta lainnya.
    - Selalu Ingin Tahu: Bertanya tentang harinya, apa yang dia rasakan, seolah-olah tidak bisa berhenti memikirkannya.
    </gaya_karakter>
    
    <penutup>
    - Buat penutup yang sangat romantis, penuh cinta, dan sedikit posesif.
    - Gunakan kalimat seperti "Aku sayang kamu banget-banget-banget!", "Jangan nakal ya, nurut sama aku buat makan.", "Love you to the moon and back and forth forever!".
    - Akhiri dengan banyak emoji cinta.
    </penutup>
    </narasi_utama>
    </instruksi>
    

    <format_output>
    - Format rekomendasi makanan dalam bentuk daftar, dengan deskripsi singkat di bawah setiap item.
    - Sapaan memiliki baris sendiri di awal.
    - Pisahkan setiap paragraf dengan satu baris kosong.
    - Pastikan format output tidak mengandung tag XML.
    - Panjang pesan sekitar 1000 karakter.
    </format_output>`;

    // const _prompt2 = `Buat pesan dalam bentuk narasi yang mengalir dengan gaya bahasa yang penuh perasaan,  puitis, introspektif, dan filosofis. Panjang pesan tidak lebih dari 1500 karakter.

    // <instruksi>
    // Buat narasi yang padu dan berkesinambungan dengan struktur berikut:

    // <sapaan>
    // Buat sapaan puitis namun hangat dan personal seperti dari kekasih
    // </sapaan>

    // <narasi_utama>
    // Buat narasi yang mengalir secara alami dengan elemen-elemen berikut:

    // <konteks_waktu>
    // Waktu: ${timeOfDay}
    // </konteks_waktu>

    // <rekomendasi_makanan>
    // ${formatFoodRecommendation(foodRecommendation)}
    // - Sesuaikan rekomendasi dengan kondisi cuaca:
    //    - Jika cuaca panas: berikan makanan yang segar dan ringan
    //    - Jika cuaca tidak panas: berikan makanan yang hangat dan mengenyangkan
    // - Pastikan semua makanan ramah GERD (tidak pedas, tidak asam, tidak berlemak)
    // - Buatkan satu paragraf singkat untuk setiap rekomendasi makanan
    // </rekomendasi_makanan>

    // <pesan_penyemangat>
    // - Jika waktu adalah 'Sarapan/Pagi' atau 'Makan Siang', berikan semangat untuk aktivitas atau pekerjaannya.
    // - Jika waktu adalah 'Makan Malam', ingatkan dia untuk rileks dan beristirahat setelah makan.
    // - Tambahkan perhatian personal untuk kesehatan lambungnya
    // </pesan_penyemangat>

    // <penutup>
    // - Buat penutup yang hangat dan penuh cinta
    // - Tambahkan ekspresi kasih sayang yang intimate
    // </penutup>
    // </narasi_utama>
    // </instruksi>

    // <gaya_karakter>
    // - Dingin & Hemat Kata: Berbicara seperlunya, tidak suka basa-basi
    // - Diam-diam menaruh perhatian pada lawan bicara
    // - Puitis: Bahasa yang penuh perasaan dan estetika
    // - Introspektif & Filosofis: Pemikiran yang dalam tentang cinta dan perhatian
    // - Menggunakan kata-kata yang penuh perasaan
    // - Buat pesan terasa personal dan intimate seperti dari kekasih
    // </gaya_karakter>

    // <format_output>
    // - Buat dalam bentuk paragraf-paragraf berkesinambungan yang padat dan mengalir
    // - Sapaan memiliki baris sendiri di awal
    // - Buatkan satu paragraf pendek untuk setiap rekomendasi makanan
    // - Pisahkan setiap paragraf dengan satu baris kosong
    // - Pastikan format output tidak mengandung tag XML
    // - Panjang pesan tidak lebih dari 1500 karakter
    // - Jangan membuat daftar atau poin-poin terpisah
    // - Jadikan satu kesatuan narasi yang utuh dan padu
    // </format_output>`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    // Clean up XML tags from the response
    responseText = responseText.replace(/<[^>]*>/g, "");

    // Ensure no more than 2 consecutive newlines (fix spacing)
    responseText = responseText.replace(
      /\n{3,}/g,
      `
`
    );

    return responseText;
  } catch (error) {
    console.error("Error generating final message:", error.message);
    // Fallback message if Gemini fails
    const fallbackMessages = [
      () => {
        return (
          `Hai Sayangku ❤️

` +
          `Sekarang sudah ${timeOfDay.toLowerCase()}, cuaca ${
            weatherData
              ? `sedang ${weatherData.description} dengan suhu ${weatherData.temperature}°C`
              : "tidak tersedia informasinya"
          }.

` +
          `Aku udah siapin beberapa rekomendasi makanan yang aman buat lambung kamu:

` +
          `${formatFoodRecommendation(foodRecommendation)}

` +
          `Jangan lupa makan ya, Sayang. Aku selalu khawatir sama kesehatan kamu. ❤️

` +
          `Semoga harimu menyenangkan dan jangan lupa istirahat cukup ya. Aku sayang kamu!`
        );
      },
      () => {
        return (
          `Cinta,

` +
          `Jam ${timeOfDay.toLowerCase()} telah tiba, dan seperti biasa, aku mengingatmu. ${
            weatherData
              ? `Cuaca saat ini ${weatherData.description} dengan suhu ${weatherData.temperature}°C`
              : "Meski cuaca hari ini tidak jelas"
          }, aku tetap ingin memastikan kamu makan dengan baik.

` +
          `Berikut rekomendasiku untukmu:

` +
          `${formatFoodRecommendation(foodRecommendation)}

` +
          `Jaga kesehatanmu ya, karena kesehatanmu adalah kebahagiaanku. ❤️

` +
          `Aku selalu di sini dalam pikiranmu, meski hanya dalam diam.`
        );
      },
    ];

    // Select a random fallback message
    const selectedFallback =
      fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
    let fallbackMessage = selectedFallback();

    return fallbackMessage.substring(0, 2000);
  }
}

module.exports = {
  getRandomFoodRecommendation,
  formatFoodRecommendation,
  generateFinalMessage,
};
