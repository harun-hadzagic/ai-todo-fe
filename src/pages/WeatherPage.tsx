import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { getAllSavedWeathers } from "../api/weatherApi";
import { Weather } from "../types/Weather";
import WeatherList from "../components/WeatherList";
import WeatherForm from "../components/WeatherForm";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Box, Container, Typography, Paper } from "@mui/material";
import LoadingSpinner from "../components/LoadingSpinner";

const WeatherPage: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email") || "";

  const [weatherData, setWeatherdata] = useState<Weather[]>([])

  const navigate = useNavigate(); // Get the navigate function from useNavigate

  const handleLogout = () => {
    navigate('/');
  };
  
  const fetchData = async () => {
    setIsLoading(true)
    const allWeather = await getAllSavedWeathers();
    const filteredData = allWeather.filter((weather: { status: string; }) => weather.status === email);
    setWeatherdata(filteredData);
    setIsLoading(false)
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <Container
      maxWidth="md"
      sx={{
        fontFamily: "'Poppins', sans-serif",
        mt: 4,
        paddingX: { xs: 2, md: 4 },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: { xs: 2, sm: 4 },
          borderRadius: 3,
          background: "linear-gradient(to right, #ffffff, #f3f4f6)",
          boxShadow: 4,
          mb: 4,
        }}
      >
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "start", sm: "center" }}
          mb={4}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#1976d2",
              mb: { xs: 2, sm: 0 },
              fontSize: { xs: "1.8rem", sm: "2.2rem" },
            }}
          >
            Weather for {email}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setIsCreating(!isCreating)}
            sx={{
              textTransform: "none",
              backgroundColor: "#00796b",
              "&:hover": {
                backgroundColor: "#004d40",
              },
              fontSize: { xs: "0.8rem", sm: "1rem" },
            }}
          >
            Look up location
          </Button>
          <br/>
          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            sx={{
              textTransform: "none",

              fontSize: { xs: "0.8rem", sm: "1rem" },
            }}
          >
            Log out
          </Button>
        </Box>
        {isCreating && (
          <WeatherForm
            open={isCreating}
            onClose={() => setIsCreating(false)}
            onSubmitSuccess={() => {
              setIsCreating(false);
              fetchData();
            }}
            categories={queryClient.getQueryData("categories") || []}
          />
        )}
      </Paper>
      {isLoading && <LoadingSpinner/>}
        {weatherData.length > 0 && <WeatherList
          weatherData={weatherData}
          fetchData={fetchData}
        />}
    </Container>
  );
};

export default WeatherPage;
