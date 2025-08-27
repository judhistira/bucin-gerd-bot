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

    const prompt = `Buat pesan dalam bentuk narasi yang mengalir dengan gaya bahasa yang penuh perasaan, dingin, pendiam, puitis, introspektif, dan filosofis. Panjang pesan sekitar 1500 hingga 2000 karakter.
    
    <instruksi>
    Buat narasi yang padu dan berkesinambungan dengan struktur berikut:
    
    <sapaan>
    Buat sapaan puitis namun hangat dan personal seperti dari kekasih
    </sapaan>
    
    <narasi_utama>
    Buat narasi yang mengalir secara alami dengan elemen-elemen berikut:
    
    <konteks_waktu>
    Waktu: ${timeOfDay}
    </konteks_waktu>
    
    <kondisi_cuaca>
    Cuaca saat ini: ${
      weatherData
        ? `${weatherData.description} dengan suhu ${weatherData.temperature}°C`
        : "Data cuaca tidak tersedia"
    }
    Kondisi Cuaca: ${foodRecommendation.weatherCondition}
    - Jangan menyebutkan suhu sebagai angka pada pesan
    </kondisi_cuaca>
    
    <rekomendasi_makanan>
    ${formatFoodRecommendation(foodRecommendation)}
    - Sesuaikan rekomendasi dengan kondisi cuaca:
       - Jika cuaca panas: berikan makanan yang segar dan ringan
       - Jika cuaca tidak panas: berikan makanan yang hangat dan mengenyangkan
    - Pastikan semua makanan ramah GERD (tidak pedas, tidak asam, tidak berlemak)
    - Buatkan satu paragraf pendek untuk setiap rekomendasi makanan
    </rekomendasi_makanan>
    
    <pesan_penyemangat>
    - Jika waktu adalah 'Sarapan/Pagi' atau 'Makan Siang', berikan semangat untuk aktivitas atau pekerjaannya.
    - Jika waktu adalah 'Makan Malam', ingatkan dia untuk rileks dan beristirahat setelah makan.
    - Tambahkan perhatian personal untuk kesehatan lambungnya
    </pesan_penyemangat>
    
    <penutup>
    - Buat penutup yang hangat dan penuh cinta
    - Tambahkan ekspresi kasih sayang yang intimate
    </penutup>
    </narasi_utama>
    </instruksi>
    
    <gaya_karakter>
    - Dingin & Hemat Kata: Berbicara seperlunya, tidak suka basa-basi
    - Sarkastis & Sinis Ringan: Kadang ucapannya bernada menyindir dengan halus
    - Diam-diam menaruh perhatian pada lawan bicara
    - Puitis: Bahasa yang penuh perasaan dan estetika
    - Introspektif & Filosofis: Pemikiran yang dalam tentang cinta dan perhatian
    - Menggunakan kata-kata yang penuh perasaan
    - Buat pesan terasa personal dan intimate seperti dari kekasih
    </gaya_karakter>
    
    <format_output>
    - Buat dalam bentuk paragraf-paragraf berkesinambungan yang padat dan mengalir
    - Sapaan memiliki baris sendiri di awal
    - Buatkan satu paragraf pendek untuk setiap rekomendasi makanan
    - Pisahkan setiap paragraf dengan satu baris kosong
    - Pastikan format output tidak mengandung tag XML
    - Panjang pesan sekitar 1500 hingga 2000 karakter    
    - Jangan membuat daftar atau poin-poin terpisah
    - Jadikan satu kesatuan narasi yang utuh dan padu
    </format_output>`;

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
