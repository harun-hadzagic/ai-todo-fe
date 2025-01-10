import React, { useEffect, useState } from "react";
import WeatherCard from "./WeatherCard";
import { Box, Button, Divider, Paper } from "@mui/material";
import { fetchWeatherDataForCity } from "../api/fetchDataApi";
import { deleteWeather, updateWeather } from "../api/weatherApi";

const WeatherList = ({ weatherData, fetchData }) => {
  const [fullWeatherData, setFullWeatherData] = useState([]);
  const [isAscending, setIsAscending] = useState(true);
  const [currentSortCriteria, setCurrentSortCriteria] = useState("cityName");

  useEffect(() => {
    const fetchAllWeatherData = async () => {
      const fetchedData = await Promise.all(
        weatherData.map(async (weather) => {
          try {
            let description = weather.description;
            if (description.endsWith("=")) {
              description = description.slice(0, -1);
            }

            const fetchedWeather = await fetchWeatherDataForCity(description);

            if (fetchedWeather && typeof fetchedWeather === "object") {
              return {
                ...fetchedWeather,
                id: weather.id,
                priority: weather.priority,
              };
            } else {
              console.error("Unexpected data format:", fetchedWeather);
              return null;
            }
          } catch (error) {
            console.error("Error fetching weather data:", error);
            return null;
          }
        })
      );

      setFullWeatherData(fetchedData.filter((data) => data !== null));
    };

    fetchAllWeatherData();
  }, [weatherData]);

  const handleSort = (criteria) => {
    setCurrentSortCriteria(criteria); // Store the current sort criteria
    const sortedData = [...fullWeatherData];
    sortedData.sort((a, b) => {
      let comparison = 0;
      switch (criteria) {
        case "cityName":
          comparison = a.name.localeCompare(b.name);
          break;
        case "temperature":
          comparison = a.main.temp - b.main.temp;
          break;
        case "weatherCondition":
          comparison = a.weather[0].description.localeCompare(
            b.weather[0].description
          );
          break;
        default:
          break;
      }
      return isAscending ? comparison : -comparison;
    });
    setFullWeatherData(sortedData);
  };

  useEffect(() => {
    if (currentSortCriteria) {
      handleSort(currentSortCriteria); // Reapply sorting when `isAscending` changes
    }
    // eslint-disable-next-line
  }, [isAscending, currentSortCriteria]);

  const toggleSortOrder = () => {
    setIsAscending((prev) => !prev);
  };

  const handleDelete = async (id) => {
    try {
      await deleteWeather(id);
      fetchData(); // Refetch the updated weather data
    } catch (error) {
      console.error("Error deleting weather data:", error);
    }
  };

  const handleEdit = async (weather, editedWeatherName) => {
    try {
    await updateWeather(weather.id, {
      priority: editedWeatherName,
      id: weather.id,
      title: "",
      description: weather.description,
      dueDate: "",
      status: weather.status,
      category: {
        id: 0,
        name: ""
      },
    })      
    fetchData(); // Refetch the updated weather data
    } catch (error) {
      console.error("Error updating weather data:", error);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: { xs: 2, sm: 4 },
        marginBottom: 4,
        borderRadius: 3,
        background: "linear-gradient(to right, #ffffff, #e3f2fd)",
        fontFamily: "'Poppins', sans-serif",
      }}
      data-testid="weather-list-container"
    >
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button onClick={() => handleSort("cityName")}>
          Sort by City Name
        </Button>
        <Button onClick={() => handleSort("temperature")}>
          Sort by Temperature
        </Button>
        <Button onClick={() => handleSort("weatherCondition")}>
          Sort by Weather Condition
        </Button>
        <Button onClick={toggleSortOrder} color="secondary">
          {isAscending ? "Switch to Descending" : "Switch to Ascending"}
        </Button>
      </Box>
      <Divider sx={{ marginBottom: 3 }} />
      <Box>
        {fullWeatherData.length > 0 &&
          fullWeatherData.map((weather) => (
            <WeatherCard
              key={weather.id}
              weather={weather}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          ))}
      </Box>
    </Paper>
  );
};

export default WeatherList;
