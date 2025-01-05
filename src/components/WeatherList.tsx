import React from "react";
import WeatherCard from "./WeatherCard";
import { Box, Divider, Paper } from "@mui/material";

interface WeatherListProps {
  weatherData: { id: React.Key | null | undefined }[];  // Adjust type for weatherData array
  fetchData: () => Promise<void>;  // Assuming fetchData is a function that returns a Promise
}

const WeatherList: React.FC<WeatherListProps> = ({ weatherData, fetchData }) => {

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
      <Divider sx={{ marginBottom: 3 }} />
      <Box>
      {weatherData.length > 0 && weatherData.map((weather) => (
          <WeatherCard key={weather.id} weather={weather} fetchData={fetchData} />
        ))}
      </Box>
    </Paper>
  );
};

export default WeatherList;
