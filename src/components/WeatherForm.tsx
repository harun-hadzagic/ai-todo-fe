import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { createWeather } from "../api/weatherApi";
import {
  fetchWeatherDataForCity,
} from "../api/fetchDataApi"; 
import { useLocation } from "react-router-dom";

interface WeatherFormProps {
  open: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
  categories: Category[];
}

interface Category {
  id: number;
  name: string;
}

const WeatherForm: React.FC<WeatherFormProps> = ({
  open,
  onClose,
  onSubmitSuccess,
}) => {
  const [description, setDescription] = useState("");
  const [weatherData, setWeatherData] = useState<any | null>(null); // Store weather data
  const [isSuggestingCategory, setIsSuggestingCategory] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [customLocationName, setCustomLocationName] = useState<string>(''); // State to store custom name
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email") || "";

  const handleSuggestCategory = async () => {
    if (!description) {
      setResponseMessage("Please provide a city name.");
      setShowResponseModal(true);
      return;
    }

    setIsSuggestingCategory(true);

    // Call your backend function to fetch weather data for the given city (description)
    try {
      const data = await fetchWeatherDataForCity(description);  // Call your backend function here
      if (data) {
        setWeatherData(data);  // Store the fetched weather data
      } else {
        setResponseMessage(`Failed to fetch weather data for ${description}`);
        setWeatherData(null);
        setShowResponseModal(true);
      }
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      setResponseMessage("Failed to fetch weather data. Please try again.");
      setWeatherData(null);
      setShowResponseModal(true);
    } finally {
      setIsSuggestingCategory(false);
    }
  };

  const handleSave = async () => {
    // Add form submission logic here as needed
    try{
      await createWeather(weatherData.name, email, customLocationName);
      onSubmitSuccess();
      }catch(error){
        console.error("Failed to save weather data:", error);
      }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomLocationName(event.target.value); // Update state when the user types
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Search by city name
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="City name"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleSuggestCategory}
              disabled={isSuggestingCategory}
            >
                Get Weather Info
            </Button>

            {weatherData && (
              <Box mt={2}>
                <Typography variant="h6">Weather Information:</Typography>
                <Typography>City: {weatherData.name}</Typography>
                <Typography>Temperature: {weatherData.main.temp}°C</Typography>
                <Typography>Feels Like: {weatherData.main.feels_like}°C</Typography>
                <Typography>Humidity: {weatherData.main.humidity}%</Typography>
                <Typography>Wind Speed: {weatherData.wind.speed} m/s</Typography>
                <Typography>
                  Weather: {weatherData.weather[0].description}
                </Typography>
                <Typography>
                  Pressure: {weatherData.main.pressure} hPa
                </Typography>
                <Typography>
                  Visibility: {weatherData.visibility / 1000} km
                </Typography>
                <TextField
                  label="Custom Location Name"
                  value={customLocationName}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Modal>

      <Modal
        open={showResponseModal}
        onClose={() => setShowResponseModal(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: 300,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
          }}
        >
          <Typography variant="body1">{responseMessage}</Typography>
          <Box mt={2} display="flex" justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowResponseModal(false)}
            >
              OK
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default WeatherForm;
