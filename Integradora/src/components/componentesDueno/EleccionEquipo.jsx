import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Tooltip, IconButton } from "@mui/material";
import { Add } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";

const EleccionEquipo = ({ onSelectTeam, handleAddTeam}) => {
  const { getUserId, getToken, api_url } = useContext(AuthContext);
  const [equipos, setEquipos] = useState([]); // Inicializar como un arreglo vacío
  const [torneos, setTorneos] = useState([]); // Para almacenar los torneos disponibles
  const [loading, setLoading] = useState(true);
  const [selectedTorneo, setSelectedTorneo] = useState(null); // Para almacenar el torneo seleccionado
  const [selectedEquipo, setSelectedEquipo] = useState(null); // Para almacenar el equipo seleccionado
  const [errorMessage, setErrorMessage] = useState(""); // Para almacenar el mensaje de error

  // Función para obtener los equipos
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

  // Función para obtener los torneos disponibles
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

  // Función para generar las credenciales
  const handleGenerarCredenciales = async (idEquipo) => {
    if (!selectedTorneo) {
      alert("Por favor, selecciona un torneo.");
      return;
    }

    try {
      const response = await axios.get(`${api_url}/api/jugadores/credenciales/${idEquipo}/${selectedTorneo.id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
        responseType: "arraybuffer", // Importante para recibir un archivo binario (PDF)
      });

      const file = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(file);
      link.download = `credenciales_${idEquipo}.pdf`; 
      link.click();
    } catch (error) {
        console.error( error);
      if (error.response && error.response.data) {
        
        const errorData = error.response.data;
        if (error.response.status === 404) {
          setErrorMessage("El equipo no está inscrito en el torneo indicado."); 
        } else {
          alert("Error desconocido al generar las credenciales.");
        }
      } else {
        alert("Error al generar las credenciales. Intenta nuevamente.");
      }
    
    }
  };

  // Función para manejar la selección de un torneo
  const handleSelectTorneo = (torneo) => {
    setSelectedTorneo(torneo); 
    setErrorMessage(""); 
  };

  // Función para manejar la selección de un equipo
  const handleSelectEquipo = (equipo) => {
    setSelectedEquipo(equipo);
    if (onSelectTeam) onSelectTeam(equipo); 
    setErrorMessage("");
  };

  // Cargar los equipos y los torneos cuando el componente se monta
  useEffect(() => {
    fetchEquipos();
    fetchTorneos();
  }, []); 

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="duenoBox quitarScroll">
        <div className="d-flex flex-row align-items-center justify-content-between g-2 mb-4">
          <h2 className="mb-0">Tus equipos</h2>
          <Tooltip title="Agregar equipo">
            <IconButton 
              color="primary" 
              onClick={handleAddTeam}
              aria-label="add-team"
            >
              <Add fontSize="large" />
            </IconButton>
          </Tooltip>
        </div>

        <div className="row">
          <div className="col-12">
            {/* Dropdown de torneos */}
            <div className="mb-4">
              <label htmlFor="torneo-select" className="form-label">Selecciona un Torneo</label>
              <select
                id="torneo-select"
                className="form-select"
                onChange={(e) => handleSelectTorneo(JSON.parse(e.target.value))}
                value={selectedTorneo ? JSON.stringify(selectedTorneo) : ""}
              >
                <option value="">Selecciona un torneo</option>
                {torneos.map((torneo) => (
                  <option key={torneo.id} value={JSON.stringify(torneo)}>
                    {torneo.nombreTorneo}
                  </option>
                ))}
              </select>
            </div>

            {errorMessage && (
              <div className="alert alert-danger">
                <strong>Error: </strong>{errorMessage}
              </div>
            )}

            <div className="teams-grid d-flex flex-wrap justify-content-start gap-4">
              {equipos.length > 0 ? (
                equipos.map((e) => (
                  <div
                    key={e.id || e._id}
                    className="dueno-container-3 bg-light p-3"
                    style={{ width: "calc(33.33% - 20px)", marginBottom: "20px" }} // Ajuste el tamaño y margen
                  >
                    <div className="card shadow-sm border-0 rounded-lg">
                      <img
                        src={e.logoEquipo}
                        alt={e.nombreEquipo}
                        className="img-fluid rounded-top"
                        onError={(e) => {
                          e.target.src = "https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg";
                        }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{e.nombreEquipo}</h5>
                        <p className="card-text">{e.nombreCampo}</p>
                        
                        {/* Resaltar el equipo seleccionado */}
                        <button
                          className={`btn ${selectedEquipo?.id === e.id ? 'btn-success' : 'btn-primary'} mt-2`}
                          onClick={() => handleSelectEquipo(e)} // Seleccionar el equipo
                        >
                          {selectedEquipo?.id === e.id ? "Equipo Seleccionado" : "Seleccionar Equipo"}
                        </button>

                        <button
                          className="btn btn-primary mt-2"
                          onClick={() => handleGenerarCredenciales(e.id)} // Llamada al método para generar credenciales
                        >
                          Generar Credenciales
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No tienes equipos registrados.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EleccionEquipo;
