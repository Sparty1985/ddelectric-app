const API_KEY = f82af9907368c8dcd3bbd1fff43b3c9c; // Replace with your OpenWeather API key

export async function getWeatherData(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
    );
    const data = await response.json();

    return {
      city: data.city.name,
      temp: data.list[0].main.temp,
      precip: data.list[0].pop * 100, // Precipitation probability in %
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}
