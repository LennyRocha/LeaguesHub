import React, { useState, useEffect, useContext, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { Button, Modal, Select, MenuItem, CircularProgress, FormControl, InputLabel, Box } from "@mui/material";
import Swal from "sweetalert2";

export default function DuenoHome({ cambiarComponente }) {
  const { getUserId, getToken, api_url } = useContext(AuthContext);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [equipos, setEquipos] = useState([]);
  const [torneos, setTorneos] = useState([]);
  const [selectedEquipo, setSelectedEquipo] = useState('');
  const [selectedTorneo, setSelectedTorneo] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const getUrl = (url) => {
    const match = url.match(/id=([^&]+)/);
    return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : url;
  };

  const getConvocatoria = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${api_url}/api/convocatorias/activa`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const processedUrl = getUrl(res.data);
      setImageUrl(processedUrl);
      setLoading(false);
    } catch (e) {
      console.error('Error:', e);
      setError("No se pudo cargar la convocatoria");
      setLoading(false);
    }
  };

  const fetchEquipos = async () => {
    try {
      const userId = await getUserId();
      const response = await axios.get(`${api_url}/api/equipos/porDueno/${userId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setEquipos(response.data);
    } catch (error) {
      console.error("Error fetching equipos:", error);
      Swal.fire("Error", "No se pudieron cargar los equipos", "error");
    }
  };

  const fetchTorneos = async () => {
    try {
      const response = await axios.get(`${api_url}/api/torneos/espera`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setTorneos(response.data);
    } catch (error) {
      console.error("Error fetching torneos:", error);
      Swal.fire("Error", "No se pudieron cargar los torneos", "error");
    }
  };

  const handleInscribir = async () => {
    if (!selectedEquipo || !selectedTorneo) {
      Swal.fire("Error", "Debes seleccionar un equipo y un torneo", "error");
      return;
    }

    setModalLoading(true);
    try {
      await axios.post(`${api_url}/api/solicitudes/${selectedEquipo}/${selectedTorneo}`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Solicitud enviada correctamente',
        showConfirmButton: false,
        timer: 1500
      });
      setModalVisible(false);
      setSelectedEquipo('');
      setSelectedTorneo('');
    } catch (error) {
      console.error("Error enviando solicitud:", error);
      Swal.fire("Error", error.response?.data?.message || "No se pudo enviar la solicitud", "error");
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    getConvocatoria();
  }, []);

  const onRefresh = useCallback(() => {
    setLoading(true);
    getConvocatoria();
  }, []);

  const openInscripcionModal = async () => {
    setModalVisible(true);
    await fetchEquipos();
    await fetchTorneos();
  };

  if (loading) {
    return (
      <div className="text-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="mt-0">
      <div className="container-fluid duenoBox quitarScroll">
        <div className="d-sm-flex align-items-center justify-content-between mb-2">
          <h2 className="mb-0 h2-bold">Menú principal</h2>
        </div>
        <div className="row">
          {/* Card Mis pagos */}
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-primary shadow h-100 py-2">
              <div className="_col">
                <lord-icon
                  src="/icons/cheque.json"
                  trigger="loop"
                  stroke="bold"
                  state="hover-pinch"
                  colors="primary:#333333,secondary:#9A0000"
                  style={{ width: "5em", height: "5em" }}
                ></lord-icon>
                <div className="font-weight-bold text-uppercase text-lg text-center">
                  <a className="link" onClick={() => cambiarComponente('D')}>Mis pagos</a>
                </div>
              </div>
            </div>
          </div>

          {/* Card Descargar Credenciales */}
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-success shadow h-100 py-2">
              <div className="_col">
                <lord-icon
                  src="/icons/jugador.json"
                  trigger="loop"
                  stroke="bold"
                  state="hover-jump"
                  colors="primary:#333333,secondary:#9A0000"
                  style={{ width: "5em", height: "5em" }}
                ></lord-icon>
                <div className="font-weight-bold text-uppercase text-lg text-center">
                  <a className="link" onClick={() => cambiarComponente('F')}>Descargar Credenciales</a>
                </div>
              </div>
            </div>
          </div>

          {/* Card Mis Equipos */}
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-danger shadow h-100 py-2">
              <div className="_col">
                <lord-icon
                  src="https://cdn.lordicon.com/lewtedlh.json"
                  trigger="loop"
                  stroke="bold"
                  state="hover-jump"
                  colors="primary:#3333333,secondary:#9A0000"
                  style={{ width: "5em", height: "5em" }}
                ></lord-icon>
                <div className="font-weight-bold text-uppercase text-lg text-center">
                  <a className="link" onClick={() => cambiarComponente('B')}>Mis equipos</a>
                </div>
              </div>
            </div>
          </div>

          {/* Card Historial de pagos */}
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-warning shadow h-100 py-2">
              <div className="_col">
                <lord-icon
                  src="/icons/book.json"
                  trigger="loop"
                  stroke="bold"
                  state="hover-flutter"
                  colors="primary:#333333,secondary:#9A0000"
                  style={{ width: "5em", height: "5em" }}
                ></lord-icon>
                <div className="font-weight-bold text-uppercase text-lg text-center">
                  <a className="link" onClick={() => cambiarComponente('E')}>Historial de pagos</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4 align-items-center justify-content-center">
          <div className="w-80">
            <div className="row g-0 p-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm position-relative bg-light">
              {loading ? (
                <div className="text-center p-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="alert alert-danger m-3">{error}</div>
              ) : imageUrl ? (
                <div className="col-auto d-none p-0 d-lg-block">
                  <img
                    src={imageUrl}
                    alt="Convocatoria activa"
                    className="img-fluid"
                    style={{
                      objectFit: "cover",
                      maxHeight: "350px",
                    }}
                    // onError={(e) => {
                    //   e.target.onerror = null;
                    //   e.target.src = "https://via.placeholder.com/250x300?text=Imagen+no+disponible";
                    // }}
                  />
                </div>
              ) : (
                <div className="alert alert-info">No hay convocatorias activas</div>
              )}

              <div className="col gapo p-4 position-static p-2">
                <strong className="d-inline-block mb-2 text-primary">
                  Convocatoria disponible
                </strong>
                <h4 className="w-100">Convocatoria actual</h4>
                <div className="container-lg">
                  <p className="w-90 text-black">
                    <strong>Estado:</strong> Activa
                  </p>
                  <p className="w-90 text-black">
                    <strong>Participación:</strong> Abierta
                  </p>
                </div>
                <button className="btn btn-primary" onClick={openInscripcionModal}>Inscribirme</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Improved Modal */}
      <Modal 
        open={modalVisible} 
        onClose={() => setModalVisible(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(3px)'
        }}
      >
        <Box sx={{
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          outline: 'none'
        }}>
          <h3 className="text-center mb-4" style={{ color: '#333', fontWeight: 'bold' }}>Inscripción a torneo</h3>
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Selecciona un equipo</InputLabel>
            <Select
              value={selectedEquipo}
              onChange={(e) => setSelectedEquipo(e.target.value)}
              label="Selecciona un equipo"
            >
              {equipos.map((equipo) => (
                <MenuItem key={equipo.id} value={equipo.id}>
                  {equipo.nombreEquipo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel>Selecciona un torneo</InputLabel>
            <Select
              value={selectedTorneo}
              onChange={(e) => setSelectedTorneo(e.target.value)}
              label="Selecciona un torneo"
            >
              {torneos.map((torneo) => (
                <MenuItem key={torneo.id} value={torneo.id}>
                  {torneo.nombreTorneo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => setModalVisible(false)}
              sx={{ width: 120 }}
            >
              Cancelar
            </Button>
            <Button 
              variant="contained" 
              onClick={handleInscribir}
              disabled={modalLoading}
              sx={{ width: 120 }}
            >
              {modalLoading ? <CircularProgress size={24} /> : 'Enviar'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}