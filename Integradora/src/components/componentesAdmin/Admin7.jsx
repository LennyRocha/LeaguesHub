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
import jsPDF from "jspdf";
import "../../assets/fonts/Oswald-Variable-normal";
import "../../assets/fonts/3rd Man-normal";

export default function Admin7() {
  const [torneos, setTorneos] = useState([]);
  const [loadTorneos, setLoadTorneos] = useState(false);
  const [falloTor, setFalloTor] = useState("");
  const { api_url, getToken, getUrl } = useContext(AuthContext);
  const [selection, setSelection] = useState(null);
  const [poster, setPoster] = useState("");
  const [loadBtn, setLoadBtn] = useState(false);
  const [loadCon, setLoadCon] = useState(false);
  const [blob, setBlob] = useState("");
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
          console.error(e, e.response.message);
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
  async function crearConvocatoria(e) {
    e.preventDefault();
    setLoadBtn(true);
    const tokData = await getToken();
    await axios
      .post(`${api_url}/api/convocatorias/publicar/${selection.id}`, null, {
        headers: {
          Authorization: `Bearer ${tokData}`,
        },
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "¡OK!",
          text: `Convocatoria creada`,
          customClass: {
            confirmButton: "btn-confirm",
            cancelButton: "btn-cancel",
            denyButton: "btn-deny",
          },
        });
        setPoster(res.data);
      })
      .catch((error) => {
        console.error(error);
        if (error.response?.status === 403) {
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
        } else {
          Swal.fire({
            icon: "warning",
            title: "¡Denegado!",
            text:
              error.response?.message || "Algo salió mal, intentalo nuevamente",
            confirmButtonText: "Aceptar",
            customClass: {
              confirmButton: "btn-confirm",
              cancelButton: "btn-cancel",
              denyButton: "btn-deny",
            },
          });
        }
      })
      .finally(() => setLoadBtn(false));
  }

  const generatePDF = (descarga) => {
    setLoadCon(true);
    const doc = new jsPDF();
    const imagen = getUrl(selection.logoTorneo);

    // Cargar imagen de fondo
    const img = new Image();
    img.src = Poster1; // Ruta de la imagen de fondo
    img.onload = () => {
      // Agregar la imagen de fondo (ajusta el tamaño de la imagen si es necesario)
      doc.addImage(img, "PNG", 0, 0, 210, 297); // Tamaño A4: 210x297 mm

      // Agregar texto al PDF
      doc.setFont("3rd Man", "normal");
      doc.setFontSize(40); // Tamaño de la fuente

      doc.setTextColor(255, 255, 255);
      doc.text(`Torneo ${selection.nombreTorneo}`, 56, 32); // Posición X, Y

      doc.setFontSize(35);
      doc.setTextColor(0, 0, 0);
      doc.text(`${selection.descripcion}`, 45, 145);

      doc.setFontSize(28);
      doc.setTextColor(154, 0, 0);
      doc.text(`${selection.fechaInicio}`, 165, 80);

      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.text(`Máximo ${selection.maxEquipos} equipos`, 37, 234);

      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.text(`${selection.equiposLiguilla} pasan a liguilla`, 125, 234);

      // Colocar el premio
      doc.setFontSize(25);
      doc.setTextColor(255, 255, 255);
      doc.text(`Premio: ${selection.premio}`, 65, 268);

      // Si quieres agregar otra imagen (además de la de fondo)
      const logo = new Image();
      logo.src = getUrl(selection.logoTorneo); // Ruta de la segunda imagen
      logo.onload = () => {
        try {
          if (logo.width === 0 || logo.height === 0) {
            throw new Error("La imagen no se cargó correctamente.");
          }

          doc.addImage(logo, "PNG", 68, 45, 75, 75);

          if (descarga) {
            doc.save("documento_con_datos.pdf");
          } else {
            const blobUrl = doc.output("bloburl");
            window.open(blobUrl);
            setBlob(blobUrl);
          }
        } catch (err) {
          console.error("Error al agregar la imagen:", err.message);
        } finally {
          setLoadCon(false);
        }
      };
    };
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h2 className="mb-0">Nueva Convocatoria</h2>
        </div>
        <div className={`${loadTorneos ? "h-100vh" : ""}`}>
          {loadTorneos ? (
            <div className="centered-div w-100 cont">
              <div className="my-spinner"></div>
            </div>
          ) : falloTor === "" ? (
            <div className="row">
              <div className="col-lg-8 div-margin">
                <select
                  name="torneos"
                  className="text-black my-3 sel-con p-1"
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
                {selection && (
                  <div className="bg-light form-div">
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
                        {loadCon ? (
                          <div
                            className={`${
                              loadBtn && "w-50"
                            } align-items-center d-flex justify-content-center`}
                          >
                            <div className="my-spinner"></div>
                          </div>
                        ) : (
                          <button
                            className={`${
                              loadCon && "w-50"
                            } slide-btn text-black`}
                            onClick={(e) => {
                              e.preventDefault();
                              generatePDF(false);
                            }}
                          >
                            Ver
                          </button>
                        )}
                        {loadBtn ? (
                          <div
                            className={`${
                              loadBtn && "w-100"
                            } align-items-center d-flex justify-content-center`}
                          >
                            <div className="my-spinner"></div>
                          </div>
                        ) : (
                          <button
                            className="slide-btn text-black"
                            onClick={async (e) => {
                              //generatePDF(true);
                              crearConvocatoria(e);
                            }}
                          >
                            Crear
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                )}
              </div>
              <div className="col-lg-4 div-margin">
                <h5 className="mb-1">Vista vértical</h5>
                {blob === "" ? (
                  <img
                    src={poster === "" ? Poster1 : getUrl(poster)}
                    alt="BannerPlantilla"
                    className="img-fluid d-block w-100"
                  />
                ) : (
                  <iframe
                    src={blob}
                    width="100%"
                    height="100%"
                    title="Preview Vértical"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
              {/* <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h3 className="mb-0 mt-1">Vista horizontal</h3>
              </div>
              <img
                src={Banner1}
                alt="PosterPlantilla"
                className="d-block w-100 h-peque"
              /> */}
            </div>
          ) : (
            <div className="w-100 align-items-center d-flex flex-column gap-1">
              <lord-icon
                id="input-icon-2"
                src="/icons/documento.json"
                trigger="loop"
                stroke="bold"
                state="hover-swipe"
                colors="primary:#333333,secondary:#9A0000"
                style={{ width: "15em", height: "15em" }}
              ></lord-icon>
              <h3>¡Oh no!</h3>
              <h5>{falloTor}</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
