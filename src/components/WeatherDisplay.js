import React, { useState, useEffect } from 'react';
import fetchWeather from '../utils/api';
import '../assets/styles/WeatherDisplay.css';

// Updated fetchForecast function using Fahrenheit
async function fetchForecast(lat, lon) {
  const API_KEY = "5c8302e65a378be318c161f51bd0baee"; // Replace with your valid API key
  const BASE_URL = "https://api.openweathermap.org/data/2.5";

  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}` // Changed units to imperial
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    return null;
  }
}

function WeatherDisplay({ lat, lon }) {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null); // State for grouped forecast data
  const [background, setBackground] = useState("default-background"); // Dynamic background state

  useEffect(() => {
    if (lat && lon) {
      // Fetch current weather
      fetchWeather(lat, lon)
        .then((data) => {
          console.log("Current weather data:", data);
          setWeather(data);

          // Set dynamic background based on weather condition
          if (data && data.weather) {
            const condition = data.weather[0].main.toLowerCase();
            if (condition.includes("clear")) setBackground("clear-background");
            else if (condition.includes("rain")) setBackground("rain-background");
            else if (condition.includes("cloud")) setBackground("cloud-background");
            else setBackground("default-background");
          }
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        });

      // Fetch 5-day forecast
      fetchForecast(lat, lon)
        .then((data) => {
          console.log("Forecast data received:", data); // Log full forecast data
          if (data && data.list) {
            // Group forecast data by day
            const dailyData = [];
            data.list.forEach((entry) => {
              const date = new Date(entry.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
              if (!dailyData.some((day) => day.date === date)) {
                dailyData.push({
                  date,
                  max: entry.main.temp_max,
                  min: entry.main.temp_min,
                  description: entry.weather[0].description,
                  icon: entry.weather[0].icon,
                  rainChance: entry.pop || 0, // Rain probability (optional)
                });
              }
            });
            console.log("Processed daily forecast data:", dailyData);
            setForecast(dailyData.slice(0, 5)); // Limit to 5 days
          } else {
            console.error("Invalid forecast data:", data);
          }
        })
        .catch((error) => {
          console.error("Error fetching forecast data:", error);
        });
    }
  }, [lat, lon]);

  if (!weather) {
    return <p>Loading weather...</p>;
  }

  return (
    <div className={`weather-display ${background}`}>
      {/* Current Weather */}
      <div
        className={`current-weather-card ${
          weather.weather[0].main.toLowerCase().includes('clear')
            ? 'clear-card'
            : weather.weather[0].main.toLowerCase().includes('rain')
            ? 'rain-card'
            : 'cloud-card'
        }`}
      >
        <div className="current-weather-content">
          <h2>{weather.name}</h2>
          <div className="weather-visual">
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
              alt={weather.weather[0].description}
            />
            <p>{weather.weather[0].description}</p>
          </div>
        </div>
        <p className="temperature">{Math.round(weather.main.temp)}°F</p>
      </div>

      {/* 5-Day Forecast */}
      {forecast && (
        <div className="forecast-container">
          {forecast.map((day, index) => (
            <div
              key={index}
              className={`forecast-card ${
                day.description.toLowerCase().includes('clear')
                  ? 'clear-card'
                  : day.description.toLowerCase().includes('rain')
                  ? 'rain-card'
                  : 'cloud-card'
              }`}
            >
              <h4>{day.date}</h4>
              <img
                src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt={day.description}
              />
              <p>High: {Math.round(day.max)}°F</p>
              <p>Low: {Math.round(day.min)}°F</p>
              <p>Conditions: {day.description}</p>
              <p>Rain: {Math.round(day.rainChance * 100)}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WeatherDisplay;
