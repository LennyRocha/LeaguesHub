import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { Button, Tooltip, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import userPlace from '../../assets/images/user-placeholder.png';

export default function DuenoJugadores({ cambiarComponente }) {
  const { getUserId, getToken, api_url } = useContext(AuthContext);
  const [equipos, setEquipos] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [selectedEquipo, setSelectedEquipo] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedJugador, setSelectedJugador] = useState(null); // Estado para el jugador seleccionado
  const [openDialog, setOpenDialog] = useState(false); // Estado para controlar el modal

  // Función para obtener la URL de la imagen de Google Drive
  const getUrl = (url) => {
    const match = url.match(/id=([^&]+)/); // Extrae el ID de la imagen
    return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : url;
  };

  // Fetch equipos del dueño
  useEffect(() => {
    const fetchEquipos = async () => {
      if (!getUserId() || !getToken()) {
        console.error("Falta userId o token");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${api_url}/api/equipos/porDueno/${getUserId()}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (response.data && Array.isArray(response.data)) {
          setEquipos(response.data);
        } else {
          setEquipos([]);
        }
      } catch (error) {
        console.error("Error al cargar equipos:", error);
        setEquipos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipos();
  }, [api_url, getUserId, getToken]);

  // Fetch jugadores cuando se selecciona un equipo
  useEffect(() => {
    if (!selectedEquipo) return; // Si no hay equipo seleccionado, no hacer nada

    const fetchJugadores = async () => {
      if (!getUserId() || !getToken()) {
        console.error("Falta userId o token");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Haciendo solicitud para equipo con ID:", selectedEquipo);

        const response = await axios.get(`${api_url}/api/jugadores/porEquipo/${selectedEquipo}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (response.data && Array.isArray(response.data)) {
          setJugadores(response.data);
        } else {
          setJugadores([]);
        }
      } catch (error) {
        console.error("Error al cargar jugadores:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al cargar los jugadores del equipo",
        });
        setJugadores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJugadores();
  }, [selectedEquipo, api_url, getUserId, getToken]);

  const handleSelectEquipo = (event) => {
    setSelectedEquipo(event.target.value); // Establece el equipo seleccionado
  };

  // Función para abrir el diálogo con detalles del jugador
  const handleVerDetalles = (jugador) => {
    setSelectedJugador(jugador); // Establece el jugador seleccionado
    setOpenDialog(true); // Abre el modal
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Cierra el modal
    setSelectedJugador(null); // Resetea el jugador seleccionado
  };

  if (loading) {
    return <div className="text-center py-4">Cargando...</div>;
  }

  return (
    <div className="container-fluid">
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Selecciona un equipo</h2>
          <Tooltip title="Regresar">
            <IconButton color="primary" onClick={() => cambiarComponente('A')}>
              <ArrowBackIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        </div>

        {/* Selector para elegir equipo */}
        <div style={{ marginBottom: '20px' }}>
          <select
            value={selectedEquipo}
            onChange={handleSelectEquipo}
            style={{
              padding: '10px',
              fontSize: '18px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              cursor: 'pointer',
              width: '50rem'
            }}
            className="hc-30"
          >
            <option value="">Selecciona un equipo</option>
            {equipos.map((equipo) => (
              <option key={equipo.id} value={equipo.id}>
                {equipo.nombreEquipo}
              </option>
            ))}
          </select>
        </div>

        {/* Si hay un equipo seleccionado, muestra los jugadores */}
        {selectedEquipo && jugadores.length > 0 && (
          <div className="row">
            <div className="col-md-12">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {jugadores.map((jugador) => (
                  <div
                    key={jugador.id}
                    style={{
                      backgroundColor: '#f8f9fa',
                      padding: '15px',
                      borderRadius: '8px',
                      width: '200px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    <img
                      src={getUrl(jugador.fotoJugador) || userPlace}
                      alt={jugador.nombreCompleto}
                      style={{
                        height: '100px',
                        width: '100px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        marginBottom: '10px',
                      }}
                    />
                    <h5>{jugador.nombreCompleto}</h5>
                    <p className="text-muted">{jugador.numeroCamiseta}</p>
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleVerDetalles(jugador)} // Muestra detalles
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Si no hay jugadores, muestra un mensaje */}
        {selectedEquipo && jugadores.length === 0 && (
          <div className="text-center py-4">
            <p>No hay jugadores registrados en este equipo.</p>
          </div>
        )}
      </div>

      {/* Modal con los detalles del jugador */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Detalles del Jugador</DialogTitle>
        <DialogContent>
          {selectedJugador && (
            <div>
              <img
                src={getUrl(selectedJugador.fotoJugador) || userPlace}
                alt={selectedJugador.nombreCompleto}
                style={{
                  height: '200px',
                  width: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '20px',
                }}
              />
              <h3>{selectedJugador.nombreCompleto}</h3>
              <p><strong>Número de camiseta:</strong> {selectedJugador.numeroCamiseta}</p>
              <p><strong>Fecha de nacimiento:</strong> {selectedJugador.fechaNacimiento}</p>
              <p><strong>Partidos jugados:</strong> {selectedJugador.partidosJugados}</p>
              <p><strong>Expulsado:</strong> {selectedJugador.expulsado ? 'Sí' : 'No'}</p>
              <p><strong>Habilitado:</strong> {selectedJugador.habilitado ? 'Sí' : 'No'}</p>
              <p><strong>Equipo:</strong> {selectedJugador.equipo.nombreEquipo}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
