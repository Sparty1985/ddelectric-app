import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const RADAR_URL = "https://tile.openweathermap.org/map/precipitation_new";

/**
 * Fetch current weather, radar, and 5-day forecast.
 */
export const getWeatherData = async (lat, lon) => {
    try {
        // Fetch current weather
        const weatherResponse = await axios.get(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`);
        
        // Fetch 5-day forecast
        const forecastResponse = await axios.get(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`);
        
        // Process 5-day forecast (one reading per day at noon)
        const fiveDayForecast = forecastResponse.data.list.filter((reading) =>
            reading.dt_txt.includes("12:00:00")
        ).map((day) => ({
            date: day.dt_txt.split(" ")[0],
            temp: Math.round(day.main.temp),
            weather: day.weather[0].description,
            icon: `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`,
        }));

        return {
            city: weatherResponse.data.name,
            temp: Math.round(weatherResponse.data.main.temp),
            precip: weatherResponse.data.weather[0].description,
            radarUrl: `${RADAR_URL}/4/${Math.floor(lon)}/${Math.floor(lat)}.png?appid=${API_KEY}`,
            forecast: fiveDayForecast,
        };
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
};
