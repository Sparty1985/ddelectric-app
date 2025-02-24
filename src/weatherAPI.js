import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export const getWeatherData = async (lat, lon) => {
    try {
        const response = await axios.get(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`);
        return {
            city: response.data.name,
            temp: response.data.main.temp,
            precip: response.data.weather[0].description,
        };
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
};
