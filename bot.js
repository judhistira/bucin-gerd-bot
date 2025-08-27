const { getTimeInfo, splitMessageIntoChunks } = require("./utils.js");
const { getRandomFoodRecommendation, generateFinalMessage } = require("./gemini.js");
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
 * Send meal reminder to Discord channel
 * @param {import("discord.js").Client} client The Discord client instance
 */
async function sendMealReminder(client) {
  try {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    if (!channel) {
      console.error("Channel not found");
      return { success: false, error: "Channel not found" };
    }

    // Get time information
    const timeInfo = getTimeInfo();
    const timeOfDay = timeInfo.timeOfDay;

    // Get weather data
    const weatherData = await getWeatherData();
    
    // Get food recommendation from database
    const foodRecommendation = getRandomFoodRecommendation(timeOfDay, weatherData);

    // Generate final message (now includes motivational message)
    let finalMessage = await generateFinalMessage(
      timeOfDay,
      weatherData,
      foodRecommendation
    );

    // Split message into chunks if it's too long and send each chunk
    const messageChunks = splitMessageIntoChunks(finalMessage);

    for (let i = 0; i < messageChunks.length; i++) {
      let chunkToSend = messageChunks[i];
      if (i > 0) {
        // Add a zero-width space to prevent Discord from merging messages
        chunkToSend = "\u200b\n" + chunkToSend;
      }
      await channel.send(chunkToSend);
      // Add a small delay between messages to avoid rate limiting
      if (messageChunks.length > 1 && i < messageChunks.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log(
      `Meal reminder sent successfully in ${messageChunks.length} part(s)`
    );
    return {
      success: true,
      message: `Meal reminder sent successfully in ${messageChunks.length} part(s)`,
    };
  } catch (error) {
    console.error("Error sending meal reminder:", error.message);
    return { success: false, error: error.message };
  }
}

module.exports = { sendMealReminder };