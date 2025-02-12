'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
     // State variables to store user input, weather data, loading status, and errors
  const [city, setCity] = useState('');

  // Define the structure of the weather data response
  interface WeatherData {
    name: string; // City name
    sys: {
      country: string; // Country code
    };
    main: {
      temp: number; // Temperature in Celsius
      humidity: number; // Humidity percentage
    };
    weather: {
      description: string; // Weather condition description
    }[];
    wind: {
      speed: number; // Wind speed in m/s
    };
  }

  // State variables to manage fetched weather data, loading status, and errors
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // OpenWeather API key for fetching weather data
  const API_KEY = 'c5097b2345d429e80aefb527e5a50d3a'; // Replace with your OpenWeather API key


   // Function to fetch weather data based on the user-inputted city
  const fetchWeather = async () => {
    if (!city) return; // Ensure city input is not empty
    setLoading(true);
    setError(null);
    setWeather(null);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data); // Store fetched weather data in state
    } catch {
      setError('City not found or API error'); // Handle errors
    } finally {
      setLoading(false);  // Stop loading once request is complete
    }
  };

  return (
    <div className='p-4  flex flex-col items-center justify-center h-screen max-w-96 mx-auto'>
      <h1 className='text-2xl font-bold mb-4 '>Weather App</h1>
      <p>city and country code</p>
       {/* Input field to enter the city name */}
      <input
        type='text'
        placeholder='Enter city'
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className='border p-2 w-full mb-2 text-black'
      />

      {/* Button to trigger the API call */}
      <button
        onClick={fetchWeather}
        className='p-2 bg-blue-500 text-white rounded w-full mb-4'
      >
        Get Weather
      </button>

        {/* Display loading state */}
      {loading && <p>Loading...</p>}

      {/* Display error message if any */}
      {error && <p className='text-red-500'>{error}</p>}
      
      {/* Display weather details if data is available */}
      {weather && (
        <div className='mt-4 p-4 border rounded'>
          <h2 className='text-xl font-semibold'>{weather.name}, {weather.sys.country}</h2>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Condition: {weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
}
