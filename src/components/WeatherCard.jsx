import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  TextField,
  DialogActions,
  DialogContent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";


const WeatherCard = ({ weather , handleDelete, handleEdit}) => {
  const [unitSystem, setUnitSystem] = useState("metric");
  const [openModal, setOpenModal] = useState(false); // State to control modal visibility
  const [editedWeatherName, setEditedWeatherName] = useState(weather.priority); // Editable weather name


  const handleUnitSwitch = () => {
    setUnitSystem((prev) => (prev === "metric" ? "imperial" : "metric"));
  };

  const handleCloseModal = ()=>{
    setOpenModal(false)
  }

  const convertTemperature = (temp, unit) => {
    if (unit === "imperial") {
      return (temp * 9) / 5 + 32;
    }
    return temp;
  };
  return (
    <>
    <Card
      variant="elevation"
      sx={{
        marginBottom: 3,
        padding: { xs: 2, sm: 3 },
        boxShadow: 4,
        borderRadius: 3,
        background: "linear-gradient(to right, #e0f7fa, #ffffff)",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent>
        <Typography variant="h6">{weather.priority}</Typography>
        <Typography>City: {weather.name}</Typography>
        <Typography>
          Temperature: {convertTemperature(weather.main.temp, unitSystem)}°{" "}
          {unitSystem === "metric" ? "C" : "F"}
        </Typography>
        <Typography>Weather: {weather.weather[0].description}</Typography>
        <Box display="flex" justifyContent="space-between" mt={2}>
             <IconButton
              aria-label="edit"
              color="primary"
              onClick={()=>setOpenModal(true)}
              sx={{
                backgroundColor: "#e0f7fa",
                "&:hover": { backgroundColor: "#b2ebf2" },
                transition: "all 0.3s ease-in-out",
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              color="error"
              onClick={()=>handleDelete(weather.id)}
              sx={{
                backgroundColor: "#ffcdd2",
                "&:hover": { backgroundColor: "#ef9a9a" },
                transition: "all 0.3s ease-in-out",
              }}
            >
              <DeleteIcon />
            </IconButton>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleUnitSwitch}
          >
            Switch to {unitSystem === "metric" ? "Imperial" : "Metric"}
          </Button>
        </Box>
      </CardContent>
    </Card>
        <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Edit Location</DialogTitle>         <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Custom location name"
            type="text"
            fullWidth
            value={editedWeatherName}
            onChange={(e) => setEditedWeatherName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={()=>{handleEdit(weather, editedWeatherName); setOpenModal(false)}} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// const WeatherCard: React.FC<WeatherCardProps> = ({ weather, fetchData }) => {
//   const [weatherData, setWeatherData] = useState<Weather | null>(null);
//   const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
//   const [openModal, setOpenModal] = useState(false); // State to control modal visibility
//   const [editedWeatherName, setEditedWeatherName] = useState(weather.name); // Editable weather name

//   useEffect(() => {
//     setEditedWeatherName(weather.priority)
//     const fetchData = async () => {
//       try {
//         let weatherName = weather.description;

//         if (weatherName.endsWith("=")) {
//           weatherName = weatherName.slice(0, -1);  // Remove the last character ('=')
//         }

//         const data = await fetchWeatherDataForCity(weatherName);
//         if (typeof data === "string") {
//           console.error("Error from API:", data);
//           setWeatherData(null); 
//         } else {
//           setWeatherData(data); 
//         }
//       } catch (error) {
//         console.error("Error fetching category suggestion:", error);
//       }
//     };

//     fetchData();
//   }, [weather]);

//   const handleDelete = async () => {
//     setWeatherData(null);
//     try {
//       await deleteWeather(weather.id);
//       fetchData(); 
//     } catch (error) {
//       console.error("Error during deletion:", error);
//     }
//   };

//   const handleEdit = () => {
//     setOpenModal(true); // Open the modal when the edit icon is clicked
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false); // Close the modal
//   };


//   const handleSaveEdit = async () => {
//     // Update the weather name with the edited value (you can also send it to the backend here)
//     try{

//     await updateWeather(weather.id, {
//       priority: editedWeatherName,
//       id: weather.id,
//       title: "",
//       description: weather.description,
//       dueDate: "",
//       status: weather.status,
//       category: {
//         id: 0,
//         name: ""
//       },
//     })
//   }catch(e){
//     console.log("Error", e)
//   }finally{

//     setOpenModal(false); // Close the modal after saving
//     // Optionally, trigger a re-fetch or update the state
//     fetchData(); // Fetch new data after editing
//   }
//   };

//   const handleUnitSwitch = () => {
//     setUnitSystem((prev) => (prev === "metric" ? "imperial" : "metric"));
//   };

//   const convertTemperature = (temp: number, unit: string) => {
//     if (unit === "imperial") {
//       return (temp * 9) / 5 + 32; 
//     }
//     return temp;
//   };

//   const convertWindSpeed = (speed: number, unit: string) => {
//     if (unit === "imperial") {
//       return speed * 2.23694; 
//     }
//     return speed; 
//   };

//   const convertVisibility = (visibility: number, unit: string) => {
//     if (unit === "imperial") {
//       return visibility * 0.621371; 
//     }
//     return visibility; 
//   };

//   const roundToTwoDecimals = (num: number) => {
//     return Math.round(num * 100) / 100;
//   };

//   return (
//     <>
//       <Card
//         variant="elevation"
//         sx={{
//           marginBottom: 3,
//           padding: { xs: 2, sm: 3 },
//           boxShadow: 4,
//           borderRadius: 3,
//           background: "linear-gradient(to right, #e0f7fa, #ffffff)",
//           transition: "transform 0.2s",
//           "&:hover": {
//             transform: "scale(1.02)",
//             boxShadow: 6,
//           },
//           fontFamily: "'Poppins', sans-serif",
//         }}
//       >
//         <CardContent>
//           {weatherData ? (
//             <Box mt={2}>
//               <Typography variant="h6">{weather.priority}</Typography>
//               <Typography>City: {weatherData.name}</Typography>
//               <Typography>
//                 Temperature:{" "}
//                 {roundToTwoDecimals(convertTemperature(weatherData.main.temp, unitSystem))}°{" "}
//                 {unitSystem === "metric" ? "C" : "F"}
//               </Typography>
//               <Typography>
//                 Feels Like:{" "}
//                 {roundToTwoDecimals(convertTemperature(weatherData.main.feels_like, unitSystem))}°{" "}
//                 {unitSystem === "metric" ? "C" : "F"}
//               </Typography>
//               <Typography>Humidity: {roundToTwoDecimals(weatherData.main.humidity)}%</Typography>
//               <Typography>
//                 Wind Speed: {roundToTwoDecimals(convertWindSpeed(weatherData.wind.speed, unitSystem))}{" "}
//                 {unitSystem === "metric" ? "m/s" : "mph"}
//               </Typography>
//               <Typography>
//                 Weather: {weatherData.weather[0].description}
//               </Typography>
//               <Typography>Pressure: {roundToTwoDecimals(weatherData.main.pressure)} hPa</Typography>
//               <Typography>
//                 Visibility: {roundToTwoDecimals(convertVisibility(weatherData.visibility / 1000, unitSystem))}{" "}
//                 {unitSystem === "metric" ? "km" : "miles"}
//               </Typography>
//               <br />
//             </Box>
//           ) : (
//             <LoadingSpinner />
//           )}

//           <Box display="flex" justifyContent="space-between" mt={2}>
//             <IconButton
//               aria-label="edit"
//               color="primary"
//               onClick={handleEdit}
//               sx={{
//                 backgroundColor: "#e0f7fa",
//                 "&:hover": { backgroundColor: "#b2ebf2" },
//                 transition: "all 0.3s ease-in-out",
//               }}
//             >
//               <EditIcon />
//             </IconButton>
//             <IconButton
//               aria-label="delete"
//               color="error"
//               onClick={handleDelete}
//               sx={{
//                 backgroundColor: "#ffcdd2",
//                 "&:hover": { backgroundColor: "#ef9a9a" },
//                 transition: "all 0.3s ease-in-out",
//               }}
//             >
//               <DeleteIcon />
//             </IconButton>
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={handleUnitSwitch}
//               sx={{ height: "40px", marginLeft: "10px" }}
//             >
//               Switch to {unitSystem === "metric" ? "Imperial" : "Metric"}
//             </Button>
//           </Box>
//         </CardContent>
//       </Card>

//       {/* Edit Modal */}
//       <Dialog open={openModal} onClose={handleCloseModal}>
//         <DialogTitle>Edit Location</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Custom location name"
//             type="text"
//             fullWidth
//             value={editedWeatherName}
//             onChange={(e) => setEditedWeatherName(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseModal} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleSaveEdit} color="primary">
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

export default WeatherCard;
