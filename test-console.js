require("dotenv").config();
const { getTimeInfo, splitMessageIntoChunks } = require("./utils.js");
const { getRandomFoodRecommendation, formatFoodRecommendation, generateFinalMessage } = require("./gemini.js");
const axios = require("axios");

// Weather API configuration
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const LOCATION = process.env.LOCATION || "Jatibarang, ID";

/**
 * Get current weather data for the configured location
 */
async function getWeatherData() {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${LOCATION}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=id`
    );
    return {
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    return null;
  }
}

/**
 * Test function to generate and display message in console
 */
async function testConsoleOutput() {
  console.log("=== Test Console Output for GERD Bot ===\n");

  try {
    // Get time information
    const timeInfo = getTimeInfo();
    console.log(`Waktu saat ini: ${timeInfo.timeOfDay}\n`);

    // Get weather data
    const weatherData = await getWeatherData();
    console.log(`Cuaca saat ini: ${weatherData ? `${weatherData.description} dengan suhu ${weatherData.temperature}°C` : "Data cuaca tidak tersedia"}\n`);

    // Get food recommendation from database
    const foodRecommendation = getRandomFoodRecommendation(timeInfo.timeOfDay, weatherData);
    console.log(`Rekomendasi Makanan:\n${formatFoodRecommendation(foodRecommendation)}\n`);

    // Generate final message (now includes motivational message)
    console.log("Menghasilkan pesan utama...\n");
    const finalMessage = await generateFinalMessage(
      timeInfo.timeOfDay,
      weatherData,
      foodRecommendation
    );

    // Split message into chunks if it's too long
    const messageChunks = splitMessageIntoChunks(finalMessage);

    console.log("=== PESAN YANG DIHASILKAN ===\n");
    for (let i = 0; i < messageChunks.length; i++) {
      console.log(`--- Bagian ${i + 1} dari ${messageChunks.length} ---`);
      console.log(messageChunks[i]);
      console.log("\n" + "=".repeat(50) + "\n");
    }

    console.log(`Total karakter: ${finalMessage.length}`);
    console.log(`Jumlah bagian: ${messageChunks.length}`);

    console.log("\n=== Test Selesai ===");
  } catch (error) {
    console.error("Error during test:", error.message);
  }
}

// Run the test
testConsoleOutput();