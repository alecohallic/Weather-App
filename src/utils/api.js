const API_KEY = "5c8302e65a378be318c161f51bd0baee";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

async function fetchWeather(lat, lon) {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}` // Changed to imperial
    );
    if (!response.ok) throw new Error("Failed to fetch weather data");
    return response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

export default fetchWeather;
