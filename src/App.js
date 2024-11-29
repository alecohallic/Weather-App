import React, { useState, useEffect } from 'react';
import WeatherDisplay from './components/WeatherDisplay';
import './assets/styles/App.css';

function App() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error fetching geolocation: ", error);
        setLocation({ lat: 0, lon: 0 }); // Default to a neutral location
      }
    );
  }, []);

  return (
    <div className="App">
      <h1>Weather App</h1>
      {location ? (
        <WeatherDisplay lat={location.lat} lon={location.lon} />
      ) : (
        <p>Loading location...</p>
      )}
    </div>
  );
}

export default App;
