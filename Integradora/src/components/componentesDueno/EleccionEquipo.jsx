import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Tooltip, IconButton, CircularProgress, Card, CardMedia, CardContent, CardActions, Typography, Select, MenuItem, FormControl, InputLabel, Box, Button, Snackbar } from "@mui/material";
import { Add, SportsSoccer, EmojiEvents } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import { motion } from "framer-motion";
import Swal from 'sweetalert2'; // Asegúrate de importar SweetAlert2 para los mensajes emergentes

const EleccionEquipo = ({ onSelectTeam, handleAddTeam }) => {
  const { getUserId, getToken, api_url } = useContext(AuthContext);
  const [equipos, setEquipos] = useState([]);
  const [torneos, setTorneos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTorneo, setSelectedTorneo] = useState(null);
  const [selectedEquipo, setSelectedEquipo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingCredenciales, setLoadingCredenciales] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const fetchEquipos = async () => {
    try {
      const res = await axios.get(`${api_url}/api/equipos/porDueno/${getUserId()}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setEquipos(res.data);
    } catch (error) {
      console.error("Error al obtener los equipos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTorneos = async () => {
    try {
      const res = await axios.get(`${api_url}/api/torneos/iniciados`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setTorneos(res.data); 
    } catch (error) {
      console.error("Error al obtener los torneos:", error);
    }
  };

  const getUrl = (url) => {
    const match = url.match(/id=([^&]+)/);
    return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : url;
  };

  const handleGenerarCredenciales = async (idEquipo) => {
    if (!selectedTorneo) {
      Swal.fire({
        icon: 'warning',
        title: 'Selecciona un torneo',
        text: 'Por favor, selecciona un torneo antes de generar credenciales',
        confirmButtonColor: '#1976d2'
      });
      return;
    }

    setLoadingCredenciales(true);
    setSnackbarOpen(true);

    try {
      const response = await axios.get(`${api_url}/api/jugadores/credenciales/${idEquipo}/${selectedTorneo.id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
        responseType: "arraybuffer",
      });

      const file = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = `credenciales_${idEquipo}.pdf`; 
      link.click();
    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (error.response.status === 404) {
          setErrorMessage("El equipo no está inscrito en el torneo indicado."); 
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error desconocido al generar las credenciales',
            confirmButtonColor: '#1976d2'
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al generar las credenciales. Intenta nuevamente.',
          confirmButtonColor: '#1976d2'
        });
      }
    } finally {
      setLoadingCredenciales(false);
      setSnackbarOpen(false);
    }
  };

  const handleSelectTorneo = (torneo) => {
    setSelectedTorneo(torneo); 
    setErrorMessage(""); 
  };

  const handleSelectEquipo = (equipo) => {
    setSelectedEquipo(equipo);
    if (onSelectTeam) onSelectTeam(equipo); 
    setErrorMessage("");
  };

  useEffect(() => {
    fetchEquipos();
    fetchTorneos();
  }, []); 

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} thickness={4} sx={{ color: '#FF5958' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <Box sx={{ 
        maxWidth: 1400, 
        mx: 'auto',
        backgroundColor: 'white',
        borderRadius: 4,
        boxShadow: 3,
        p: 4
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          borderBottom: '1px solid #e0e0e0',
          pb: 2
        }}>
          <Typography variant="h4" component="h2" sx={{ 
            fontWeight: 'bold',
            color: '#FF5958',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <SportsSoccer fontSize="large" /> Tus equipos
          </Typography>
          
        </Box>

        <Box sx={{ mb: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="torneo-select-label">Selecciona un Torneo</InputLabel>
            <Select
              labelId="torneo-select-label"
              id="torneo-select"
              value={selectedTorneo ? JSON.stringify(selectedTorneo) : ""}
              onChange={(e) => handleSelectTorneo(JSON.parse(e.target.value))}
              label="Selecciona un Torneo"
              sx={{ 
                backgroundColor: 'background.paper',
                borderRadius: 2
              }}
            >
              <MenuItem value="">
                <em>Selecciona un torneo</em>
              </MenuItem>
              {torneos.map((torneo) => (
                <MenuItem 
                  key={torneo.id} 
                  value={JSON.stringify(torneo)}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <EmojiEvents color="primary" /> {torneo.nombreTorneo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {errorMessage && (
            <Box sx={{ 
              mt: 2,
              p: 2,
              backgroundColor: 'error.light',
              color: 'error.contrastText',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Typography variant="body1">
                <strong>Error: </strong>{errorMessage}
              </Typography>
            </Box>
          )}
        </Box>

        {equipos.length > 0 ? (
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' },
            gap: 3
          }}>
            {equipos.map((e) => (
              <motion.div
                key={e.id || e._id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: selectedEquipo?.id === e.id ? '2px solid' : '1px solid',
                  borderColor: selectedEquipo?.id === e.id ? '#FF5958' : 'divider',
                  boxShadow: selectedEquipo?.id === e.id ? 3 : 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 6
                  }
                }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={getUrl(e.logoEquipo) || "https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"}
                    alt={e.nombreEquipo}
                    sx={{ objectFit: 'contain', p: 2 }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                      {e.nombreEquipo}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {e.nombreCampo}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
                    <Button
                      size="small"
                      variant={selectedEquipo?.id === e.id ? "contained" : "outlined"}
                      color="primary"
                      onClick={() => handleSelectEquipo(e)}
                      sx={{ 
                        fontWeight: 'bold',
                        flexGrow: 1,
                        mr: 1,
                        borderColor: selectedEquipo?.id === e.id ? '#FF5958' : 'divider',
                        color: selectedEquipo?.id === e.id ? 'white' : '#FF5958',
                        '&:hover': {
                          backgroundColor: selectedEquipo?.id === e.id ? '#e04d44' : 'transparent',
                          borderColor: '#FF5958'
                        }
                      }}
                    >
                      {selectedEquipo?.id === e.id ? "Seleccionado" : "Seleccionar"}
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="secondary"
                      onClick={() => handleGenerarCredenciales(e.id)}
                      sx={{ fontWeight: 'bold', backgroundColor: '#FF5958', '&:hover': { backgroundColor: '#e04d44' } }}
                    >
                      Credenciales
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            ))}
          </Box>
        ) : (
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            textAlign: 'center'
          }}>
            <SportsSoccer sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No tienes equipos registrados
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleAddTeam}
              sx={{ mt: 3, backgroundColor: '#FF5958', '&:hover': { backgroundColor: '#e04d44' } }}
            >
              Agregar primer equipo
            </Button>
          </Box>
        )}
      </Box>

      <Snackbar
        open={snackbarOpen}
        message="Generando credenciales, por favor espere..."
        autoHideDuration={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default EleccionEquipo;