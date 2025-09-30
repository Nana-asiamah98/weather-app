"use client";

import React, { useState, useEffect } from "react";
import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Eye,
  Gauge,
  Moon,
  Search,
  MapPin,
  CloudSnow,
  CloudDrizzle,
  Zap,
  CloudFog,
} from "lucide-react";

interface WeatherData {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    main: string;
    description: string;
    id: number;
  }>;
  wind: {
    speed: number;
  };
  visibility: number;
}

interface WeatherDetailProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}

const WeatherApp: React.FC = () => {
  const [city, setCity] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const API_KEY = "c88c2b4726d1efb0de7f2ef62b2ce14e"; // User needs to add their OpenWeatherMap API key

  useEffect(() => {
    // Get user's location on mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        () => {
          fetchWeather("Accra"); // Fallback
        }
      );
    } else {
      fetchWeather("Accra");
    }

    // Register service worker for PWA
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {
          console.log("Service worker registration failed");
        });
      });
    }
  }, []);

  const fetchWeatherByCoords = async (
    lat: number,
    lon: number
  ): Promise<void> => {
    setLoading(true);
    setError("");

    if (!API_KEY) {
      setError(
        "Please add your OpenWeatherMap API key. Get one free at openweathermap.org/api"
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) throw new Error("Failed to fetch weather data");

      const data: WeatherData = await response.json();
      setWeather(data);
      setCity(data.name);
      setError("");
    } catch (err) {
      setError("Failed to fetch weather data. Please check your API key.");
    }
    setLoading(false);
  };

  const fetchWeather = async (location: string): Promise<void> => {
    setLoading(true);
    setError("");

    if (!API_KEY) {
      setError(
        "Please add your OpenWeatherMap API key. Get one free at openweathermap.org/api"
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("City not found");
        }
        throw new Error("Failed to fetch weather data");
      }

      const data: WeatherData = await response.json();
      setWeather(data);
      setCity(data.name);
      setError("");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch weather data";
      setError(errorMessage);
    }
    setLoading(false);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && searchInput.trim()) {
      fetchWeather(searchInput);
      setSearchInput("");
    }
  };

  const getWeatherIcon = (condition: string, id: number): any => {
    const iconProps = { size: 80, strokeWidth: 1.5 };

    // Thunderstorm
    if (id >= 200 && id < 300) {
      return <Zap {...iconProps} className="text-yellow-500" />;
    }
    // Drizzle
    if (id >= 300 && id < 400) {
      return <CloudDrizzle {...iconProps} className="text-blue-300" />;
    }
    // Rain
    if (id >= 500 && id < 600) {
      return <CloudRain {...iconProps} className="text-blue-400" />;
    }
    // Snow
    if (id >= 600 && id < 700) {
      return <CloudSnow {...iconProps} className="text-blue-200" />;
    }
    // Atmosphere (fog, mist, etc)
    if (id >= 700 && id < 800) {
      return <CloudFog {...iconProps} className="text-gray-400" />;
    }
    // Clear
    if (id === 800) {
      return <Sun {...iconProps} className="text-yellow-400" />;
    }
    // Clouds
    if (id > 800) {
      return <Cloud {...iconProps} className="text-gray-400" />;
    }

    return <Cloud {...iconProps} className="text-gray-400" />;
  };

  const weatherDetails: WeatherDetailProps[] = weather
    ? [
        { icon: Wind, label: "Wind Speed", value: `${weather.wind.speed} m/s` },
        {
          icon: Droplets,
          label: "Humidity",
          value: `${weather.main.humidity}%`,
        },
        {
          icon: Eye,
          label: "Visibility",
          value: `${(weather.visibility / 1000).toFixed(1)} km`,
        },
        {
          icon: Gauge,
          label: "Pressure",
          value: `${weather.main.pressure} hPa`,
        },
      ]
    : [];

  const quickCities: string[] = [
    "London",
    "New York",
    "Tokyo",
    "Paris",
    "Dubai",
    "Sydney",
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-white to-blue-50"
      }`}
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h1
              className={`text-3xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Weather
            </h1>
            <p
              className={`text-sm mt-1 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Real-time weather data
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
              darkMode
                ? "bg-gray-700 text-yellow-400"
                : "bg-gray-200 text-gray-700"
            }`}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* API Key Notice */}
        {!API_KEY && (
          <div
            className={`mb-6 p-4 rounded-2xl ${
              darkMode
                ? "bg-yellow-900/20 border border-yellow-700"
                : "bg-yellow-50 border border-yellow-300"
            }`}
          >
            <p
              className={`text-sm ${
                darkMode ? "text-yellow-300" : "text-yellow-800"
              }`}
            >
              ⚠️ Add your OpenWeatherMap API key in the code to fetch real-time
              data. Get one free at{" "}
              <a
                href="https://openweathermap.org/api"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold"
              >
                openweathermap.org/api
              </a>
            </p>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8 animate-slide-up">
          <div
            className={`flex items-center gap-2 p-4 rounded-2xl transition-all duration-300 ${
              darkMode
                ? "bg-gray-800/50 backdrop-blur-lg"
                : "bg-white/80 backdrop-blur-lg shadow-lg"
            }`}
          >
            <Search
              className={darkMode ? "text-gray-400" : "text-gray-600"}
              size={20}
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search for any city worldwide..."
              className={`flex-1 bg-transparent outline-none ${
                darkMode
                  ? "text-white placeholder-gray-500"
                  : "text-gray-900 placeholder-gray-400"
              }`}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-500 animate-fade-in">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : weather ? (
          <div className="space-y-6">
            {/* Main Weather Card */}
            <div
              className={`p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] ${
                darkMode
                  ? "bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl"
                  : "bg-white/90 backdrop-blur-xl shadow-2xl"
              } animate-fade-in`}
            >
              <div className="flex items-center gap-2 mb-4">
                <MapPin
                  className={darkMode ? "text-gray-400" : "text-gray-600"}
                  size={20}
                />
                <h2
                  className={`text-2xl font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {weather.name}, {weather.sys.country}
                </h2>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div
                    className={`text-7xl font-bold mb-2 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {Math.round(weather.main.temp)}°
                  </div>
                  <p
                    className={`text-xl capitalize ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {weather.weather[0].description}
                  </p>
                  <p
                    className={`text-sm mt-2 ${
                      darkMode ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    Feels like {Math.round(weather.main.feels_like)}°
                  </p>
                </div>
                <div className="animate-float">
                  {getWeatherIcon(
                    weather.weather[0].main,
                    weather.weather[0].id
                  )}
                </div>
              </div>
            </div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
              {weatherDetails.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index}
                    className={`p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${
                      darkMode
                        ? "bg-gray-800/50 backdrop-blur-lg"
                        : "bg-white/80 backdrop-blur-lg shadow-lg"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <IconComponent
                      className={`mb-3 ${
                        darkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                      size={24}
                    />
                    <p
                      className={`text-sm mb-1 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {item.label}
                    </p>
                    <p
                      className={`text-xl font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Additional Info */}
            <div
              className={`p-6 rounded-2xl ${
                darkMode
                  ? "bg-gray-800/50 backdrop-blur-lg"
                  : "bg-white/80 backdrop-blur-lg shadow-lg"
              } animate-fade-in`}
            >
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                    Min Temp
                  </p>
                  <p
                    className={`text-lg font-semibold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {Math.round(weather.main.temp_min)}°C
                  </p>
                </div>
                <div>
                  <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                    Max Temp
                  </p>
                  <p
                    className={`text-lg font-semibold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {Math.round(weather.main.temp_max)}°C
                  </p>
                </div>
              </div>
            </div>

            {/* Quick City Buttons */}
            <div className="flex flex-wrap gap-3 animate-fade-in">
              {quickCities.map((cityName) => (
                <button
                  key={cityName}
                  onClick={() => fetchWeather(cityName)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                    darkMode
                      ? "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {cityName}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default WeatherApp;
