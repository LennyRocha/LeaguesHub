import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { TextField, InputAdornment } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Swal from "sweetalert2";
import "bootstrap";
import Banner1 from "../../assets/templates/banner_back.png";
import Poster1 from "../../assets/templates/poster_back.png";

export default function Admin7() {
  const [torneos, setTorneos] = useState([]);
  const [loadTorneos, setLoadTorneos] = useState(false);
  const [falloTor, setFalloTor] = useState("");
  const { api_url } = useContext(AuthContext);
  const [selection, setSelection] = useState(null);
  useEffect(() => {
    const getTorneos = async () => {
      axios
        .get(`${api_url}/api/torneos/espera`)
        .then((res) => {
          if (res.data.length === 0)
            setFalloTor("No hay torneos disponibles para convocatorias");
          else setTorneos(res.data);
        })
        .catch((e) => {
          console.error(e, e.res.message);
          if (e.response.status === 403) {
            console.log("⚠️ Token expirado, redirigiendo a login...");
            Swal.fire({
              icon: "warning",
              title: "¡Denegado!",
              text: "Su sesión ha expirado, ingrese sesión nuevamente para continuar",
              confirmButtonText: "Aceptar",
              customClass: {
                confirmButton: "btn-confirm",
                cancelButton: "btn-cancel",
                denyButton: "btn-deny",
              },
            }).then((resutlt) => logout());
            return;
          }
          setFalloTor(
            e.response?.message || "Error al obtener torneos en espera"
          );
        })
        .finally(() => {
          setLoadTorneos(false);
        });
    };
    getTorneos();
  }, []);
  useEffect(() => {
    console.log(selection);
  }, [selection]);
  return (
    <div>
      <div className="container-fluid">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h2 className="mb-0">Nueva Convocatoria</h2>
        </div>
        <div className={`${loadTorneos ? "h-100vh" : ""}`}>
          {loadTorneos ? (
            <div className="container-fluid w-100 h-100 align-items-center justify-content-center d-flex">
              <div className="my-spinner mt-3"></div>
            </div>
          ) : falloTor === "" ? (
            <div className="row">
              <div className="col-lg-8 div-margin">
                <select
                  name="torneos"
                  className="text-black my-3 sel-con"
                  id="#torneosSel"
                  onChange={(e) => {
                    // Encuentra el torneo seleccionado usando el 'id' del option
                    const selectedTorneo = torneos.find(
                      (t) => t.id === parseInt(e.target.value)
                    );
                    setSelection(selectedTorneo); // Ahora 'setSelection' recibe el objeto completo
                  }}
                >
                  <option value="">Selecciona un torneo</option>
                  {torneos.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombreTorneo}
                    </option>
                  ))}
                </select>
                <div className="bg-light form-div">
                  {selection && (
                    <form>
                      <TextField
                        fullWidth
                        label="Nombre del torneo"
                        className="txtAr txtCon mb-2"
                        disabled
                        value={selection.nombreTorneo}
                      />
                      <div className="rowInp">
                        <TextField
                          type="date"
                          fullWidth
                          inputProps={{
                            min: new Date().toLocaleDateString("sv-SE"),
                          }}
                          className="txtAr txtCon mb-2"
                          disabled
                          value={selection.fechaInicio}
                        />
                        <TextField
                          type="number"
                          fullWidth
                          label="Equipos en liguilla"
                          className="txtAr txtCon mb-2"
                          disabled
                          value={selection.equiposLiguilla}
                        />
                      </div>
                      <TextField
                        fullWidth
                        label="Premio"
                        className="txtAr txtCon mb-2"
                        disabled
                        value={selection.premio}
                      />
                      <TextField
                        label="Descripción"
                        multiline
                        rows={3}
                        fullWidth
                        className="txtAr txtCon mb-2"
                        disabled
                        value={selection.descripcion}
                      />
                      <div className="button-group">
                        <button className="slide-btn text-black">Ver</button>
                        <button className="slide-btn text-black">Crear</button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
              <div className="col-lg-4 div-margin">
                <h5 className="mb-1">Vista vértical</h5>
                <img
                  src={Poster1}
                  alt="BannerPlantilla"
                  className="img-fluid d-block w-100"
                />
              </div>
              <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h3 className="mb-0 mt-1">Vista horizontal</h3>
              </div>
              <img
                src={Banner1}
                alt="PosterPlantilla"
                className="d-block w-100 h-peque"
              />
            </div>
          ) : (
            <h5>{falloTor}</h5>
          )}
        </div>
      </div>
    </div>
  );
}
