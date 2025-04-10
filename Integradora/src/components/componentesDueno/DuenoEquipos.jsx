import { useState, useContext, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Add from "@mui/icons-material/Add";
import userPlace from "../../assets/images/user-placeholder.png";

export default function DuenoEquipos({ cambiarComponente }) {
  const { getUserId, getToken, api_url, getUrl } = useContext(AuthContext);
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [edit, setEdit] = useState(false);
  const [preview, setPreview] = useState(userPlace);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newEquipo, setNewEquipo] = useState({
    nombreEquipo: "",
    logoEquipo: "",
    nombreCampo: "",
    campoId: "",
  });
  const [id, setId] = useState(0);
  const [campos, setCampos] = useState([]);
  const [reload, setReload] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewEquipo({ ...newEquipo, [name]: value });
  };

  const mostrarEdit = (equipo) => {
    setEdit(true);
    setVisible(true);
    setNewEquipo({
      nombreEquipo: equipo.nombreEquipo,
      logoEquipo: equipo.logoEquipo,
      nombreCampo: equipo.nombreCampo,
      campoId: equipo.idCampo || "",
    });
    setId(equipo.id)
    setPreview(getUrl(equipo.logoEquipo));
    setSelectedFile(null);
  };

  const handleAddTeam = () => {
    setVisible(true);
    setEdit(false);
    setNewEquipo({
      nombreEquipo: "",
      logoEquipo: "",
      nombreCampo: "",
      campoId: "",
    });
    setPreview(userPlace);
    setSelectedFile(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Archivo seleccionado:", file); // Añadir log para verificar el archivo
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const postEquipo = async () => {
    const formData = new FormData();

    const equipoData = {
      nombreEquipo: newEquipo.nombreEquipo,
      idUsuario: getUserId(),
      idCampo: newEquipo.campoId,
    };

    // Crear el objeto JSON y agregarlo al FormData
    const equipoBlob = new Blob([JSON.stringify(equipoData)], {
      type: "application/json",
    });
    formData.append("equipo", equipoBlob, "equipo.json");

    // Agregar el archivo de imagen al FormData
    if (selectedFile) {
      console.log("Añadiendo archivo al FormData:", selectedFile); // Verificar el archivo
      formData.append("imagen", selectedFile);
    } else if (edit) {
      try {
        const response = await fetch(newEquipo.logoEquipo);
        const blob = await response.blob();
        formData.append("imagen", blob, "existing-image.jpg");
      } catch (error) {
        console.error("Error al cargar imagen existente:", error);
      }
    }

    try {
      // Verificar que el FormData tiene el archivo
      console.log("FormData preparado para enviar:", formData);

      const response = await axios.post(`${api_url}/api/equipos`, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Equipo registrado correctamente",
      });

      setVisible(false);
      setNewEquipo({
        nombreEquipo: "",
        campoId: "",
      });
      setPreview(userPlace);
      setSelectedFile(null);
      setReload(!reload)
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Error al registrar equipo",
      });
    } finally {
      setLoading(false);
    }
  };

  const putEquipo = async () => {
    const formData = new FormData();

    const equipoData = {
      nombreEquipo: newEquipo.nombreEquipo,
      idUsuario: getUserId(),
      idCampo: newEquipo.campoId,
    };

    // Crear el objeto JSON y agregarlo al FormData
    const equipoBlob = new Blob([JSON.stringify(equipoData)], {
      type: "application/json",
    });
    formData.append("equipo", equipoBlob, "equipo.json");

    // Agregar el archivo de imagen al FormData
    if (selectedFile) {
      console.log("Añadiendo archivo al FormData:", selectedFile); // Verificar el archivo
      formData.append("imagen", selectedFile);
    } else if (edit) {
      formData.append("imagen", null);
    }

    try {
      // Verificar que el FormData tiene el archivo
      console.log("FormData preparado para enviar:", formData);

      const response = await axios.put(`${api_url}/api/equipos/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Equipo actualizado correctamente",
      });

      setVisible(false);
      setNewEquipo({
        nombreEquipo: "",
        campoId: "",
      });
      setPreview(userPlace);
      setSelectedFile(null);
      setId(0);
      setReload(!reload);
      setEdit(false);
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Error al actualizar equipo",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    edit ? putEquipo() : postEquipo();
  };

  useEffect(() => {
    const fetchEquipos = async () => {
      if (!getUserId() || !getToken()) {
        console.error("Falta userId o token");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `${api_url}/api/equipos/porDueno/${getUserId()}`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

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
  }, [reload]);

  useEffect(() => {
    const fetchCampos = async () => {
      try {
        const response = await axios.get(`${api_url}/api/campos/activos`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (response.data && Array.isArray(response.data)) {
          setCampos(response.data);
        } else {
          setCampos([]);
        }
      } catch (error) {
        console.error("Error al cargar campos:", error);
        setCampos([]);
      }
    };

    fetchCampos();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Cargando equipos...</div>;
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
          <div className="col-md-8">
            <div className="teams-grid quitarScroll">
              {equipos.length > 0 ? (
                equipos.map((e) => (
                  <div
                    className="dueno-container-3 bg-light"
                    key={e.id || e._id}
                  >
                    <img
                      src={getUrl(e.logoEquipo)}
                      alt={e.nombreEquipo}
                      className="img-fluid w-75"
                    />
                    <h5 className="w-100">{e.nombreEquipo}</h5>
                    <div className="_rowo w-100">
                      <a
                        className="link"
                        onClick={() => mostrarEdit(e)}
                        style={{ cursor: "pointer" }}
                      >
                        Editar
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p>No tienes equipos registrados.</p>
                  <button className="btn btn-primary" onClick={handleAddTeam}>
                    Agregar tu primer equipo
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="col-md-4">
            <div
              className={`w-100 ${visible ? "teamsVisible" : "teamsInvisible"}`}
            >
              <h3 className="d-flex flex-row justify-content-between align-items-center">
                <span className="body-small">
                  {edit ? "Editar equipo" : "Registrar equipo"}
                </span>
                <IconButton onClick={() => setVisible(false)}>
                  <i className="fas en-fa fa-times"></i>
                </IconButton>
              </h3>

              <div className="arbitro-card bg-light rounded mb-4">
                <form onSubmit={handleSubmit}>
                  <div className="player-picture">
                    <div className="fotoPlayer">
                      <img
                        src={preview}
                        alt="Foto del equipo"
                        id="selPictPlayer"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                      <Tooltip title="Elegir una imagen">
                        <div className="botonDivPlayer">
                          <input
                            id="fileInput"
                            type="file"
                            className="botonCamPlayer"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                          <i className="fa fa-camera"></i>
                        </div>
                      </Tooltip>
                    </div>
                  </div>

                  <TextField
                    label="Nombre del equipo"
                    fullWidth
                    margin="dense"
                    name="nombreEquipo"
                    className="txtAr"
                    required
                    value={newEquipo.nombreEquipo}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />

                  <FormControl
                    className="txtAr"
                    fullWidth
                    margin="dense"
                    sx={{ mb: 2 }}
                  >
                    <InputLabel>Selecciona un campo</InputLabel>
                    <Select
                      name="campoId"
                      value={newEquipo.campoId}
                      onChange={handleInputChange}
                      required
                    >
                      {campos.map((campo) => (
                        <MenuItem key={campo.id} value={campo.id}>
                          {campo.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <div className="d-flex flex-row flex-md-column gap-1 justify-content-center align-items-center flex-grow w-100">
                    <button
                      type="button"
                      className="slide-btn-sm-green text-black"
                      onClick={() => setVisible(false)}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="slide-btn-sm text-black">
                      {edit ? "Actualizar" : "Registrar"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
