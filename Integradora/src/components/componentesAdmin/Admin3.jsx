import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "bootstrap";
import lottie from "lottie-web";
import { defineElement } from "@lordicon/element";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
// define "lord-icon" custom element with default properties
defineElement(lottie.loadAnimation);

export default function Admin3() {
  const [reload, setReload] = useState(false);
  const { getUserId, getUserRole, getToken, logout, api_url, getUrl } =
    useContext(AuthContext);

  const [tokData, setTokData] = useState("");
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [tournamentName, setTournamentName] = useState("");
  const [tournamentData, setTournamentData] = useState({});
  const [logoTorneo, setLogoTorneo] = useState("null");
  const [checked, setChecked] = useState(false);
  const [counter, setCounter] = useState(0);
  const [editar, setEditar] = useState(false);

  const [torneos, setTorneos] = useState([]);
  const [loadTors, setLoadTors] = useState(false);
  const [falloT, setFalloT] = useState("");
  const [estado, setEstado] = useState("");

  const [formVis, setFormVis] = useState(false);
  const [image, setImage] = useState(null);
  const [motivo, setMotivo] = useState("");

  const [loadBtn, setLoadBtn] = useState(false);

  const [statColor, setStatColor] = useState("");

  const getEstadoTorneo = (tor) => {
    if (tor.motivoFinalizacion) return "torCancel"; // Cancelado
    if (!tor.estatusTorneo) return "torAcabado"; // Finalizado con ganador
    if (tor.iniciado && tor.esliguilla) return "torLiguilla"; // En liguilla
    if (tor.iniciado) return "torAct"; // En juego
    if (!tor.estatusLlenado) return "bg-light"; // En espera

    return "torAct"; // Por defecto
  };

  //conectar el schema con el form
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const validateFields = (data) => {
    const errors = {};

    const minEquipos = Number(data.minEquipos);
    const maxEquipos = Number(data.maxEquipos);
    const equiposLiguilla = Number(data.equiposLiguilla);
    const vueltas = Number(data.vueltas);

    // Validación de minEquipos
    if (isNaN(minEquipos) || minEquipos < 2 || minEquipos % 2 !== 0) {
      setError("minEquipos", {
        type: "manual",
        message: "Debe ser al menos 2 y un número par",
      });
    }

    // Validación de maxEquipos
    if (isNaN(maxEquipos) || maxEquipos < minEquipos) {
      setError("maxEquipos", {
        type: "manual",
        message: "Debe ser mayor o igual al mínimo",
      });
    }

    // ✅ Corrección aquí: Convertir a número antes de comparar
    if (isNaN(equiposLiguilla) || equiposLiguilla > maxEquipos) {
      setError("equiposLiguilla", {
        type: "manual",
        message: "No puede ser mayor que el máximo de equipos",
      });
    }

    // Validación de vueltas
    if (isNaN(vueltas)) {
      setError("vueltas", {
        type: "manual",
        message: "Debe ser un número entero",
      });
    }

    // Validación para nombreTorneo
    if (!data.nombreTorneo) {
      errors.nombreTorneo = "El nombre es requerido";
    }

    // Validación para descripcion
    if (!data.descripcion) {
      errors.descripcion = "La descripción del torneo es requerida";
    } else if (data.descripcion.length > 500) {
      errors.descripcion = "Tamaño de descripción excedido";
    }

    // Validación para fechaInicio
    if (!data.fechaInicio) {
      errors.fechaInicio = "La fecha de inicio es requerida";
    } else {
      const fechaIngresada = new Date(data.fechaInicio);
      const fechaActual = new Date();
      fechaActual.setHours(0, 0, 0, 0);
      if (fechaIngresada < fechaActual) {
        errors.fechaInicio = "La fecha debe ser hoy o en el futuro";
      }
    }

    // Validación para minEquipos
    if (!data.minEquipos) {
      errors.minEquipos = "Este campo es obligatorio";
    } else if (isNaN(data.minEquipos)) {
      errors.minEquipos = "Debe ser un número";
    } else if (!Number.isInteger(Number(data.minEquipos))) {
      errors.minEquipos = "Se requiere un número entero";
    } else if (data.minEquipos < 2) {
      errors.minEquipos = "Debe ser al menos 2";
    } else if (data.minEquipos % 2 !== 0) {
      errors.minEquipos = "El número debe ser par";
    } else if (data.minEquipos > data.maxEquipos) {
      errors.minEquipos = "Debe ser menor o igual al máximo";
    }

    // Validación para maxEquipos
    if (!data.maxEquipos) {
      errors.maxEquipos = "Este campo es obligatorio";
    } else if (isNaN(data.maxEquipos)) {
      errors.maxEquipos = "Debe ser un número";
    } else if (!Number.isInteger(Number(data.maxEquipos))) {
      errors.maxEquipos = "Se requiere un número entero";
    } else if (data.maxEquipos < 2) {
      errors.maxEquipos = "Debe ser al menos 2";
    } else if (data.maxEquipos % 2 !== 0) {
      errors.maxEquipos = "El número debe ser par";
    } else if (data.maxEquipos < data.minEquipos) {
      errors.maxEquipos = "Debe ser mayor o igual al mínimo";
    }

    // Validación para equiposLiguilla
    if (!data.equiposLiguilla) {
      errors.equiposLiguilla = "Debes especificar cuántos pasan a liguilla";
    } else if (isNaN(data.equiposLiguilla)) {
      errors.equiposLiguilla = "Debe ser un número";
    } else if (Number(data.equiposLiguilla) > 4) {
      errors.equiposLiguilla = "El mínimo de equipos en liguilla debe sser 4";
    }

    // Validación para vueltas
    if (!data.vueltas) {
      errors.vueltas = "Se requieren las vueltas";
    } else if (isNaN(data.vueltas)) {
      errors.vueltas = "Debe ser un número";
    } else if (!Number.isInteger(Number(data.vueltas))) {
      errors.vueltas = "Debe ser un número entero";
    }

    // Validación para premio
    if (!data.premio) {
      errors.premio = "Se requiere especificar premio";
    }

    return errors;
  };

  useEffect(() => console.log(errors), [errors]);

  const getEstado = (tor) => {
    if (tor.motivoFinalizacion) return 4; // Cancelado
    if (!tor.estatusTorneo) return 3; // Finalizado con ganador
    if (tor.iniciado && tor.esliguilla) return 0; // En liguilla
    if (tor.iniciado) return 1; // En juego
    if (!tor.estatusLlenado) return 2; // En espera
    return 5; // Otros casos
  };

  const torneosOrdenados = torneos.sort((a, b) => {
    const estadoA = getEstado(a);
    const estadoB = getEstado(b);

    if (estadoA !== estadoB) {
      return estadoA - estadoB; // Ordena por estado según la prioridad definida
    }

    // Si están en el mismo estado, ordena por fecha de inicio
    return new Date(a.fechaInicio) - new Date(b.fechaInicio);
  });

  const [preview, setPreview] = useState(
    "https://th.bing.com/th/id/OIP.vxFF12mSgYf6Cs5z9O2i7QAAAA?rs=1&pid=ImgDetMain"
  );

  const iniciarTorneo = async (id) => {
    const tokData = await getToken();
    await axios
      .post(
        `${api_url}/api/partidos/admin/iniciartorneo/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tokData}`,
          },
        }
      )
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "¡OK!",
          text: res.data || "Torneo iniciado correctamente",
          customClass: {
            confirmButton: "btn-confirm",
            cancelButton: "btn-cancel",
            denyButton: "btn-deny",
          },
        });
        setReload(!reload);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          console.log(error.response.data.message);
          Swal.fire({
            icon: "error",
            title: "¡Denegado!",
            text: error.response?.data?.message || "Error desconocido",
            confirmButtonText: "Aceptar",
            customClass: {
              confirmButton: "btn-confirm",
              cancelButton: "btn-cancel",
              denyButton: "btn-deny",
            },
          });
          return;
        }
        if (error.response.status === 403) {
          console.log("⚠ Token expirado, redirigiendo a login...");
          logout();
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
          });
        }
      });
  };

  const cancelarTorneo = async (id) => {
    const tokData = await getToken();
    console.log(id);
    Swal.fire({
      title: "¿Cancelar torneo?",
      text: "Esta acción es irreversible, de confirmarlo, especifica un motivo para su cancelación",
      input: "text",
      showDenyButton: true,
      confirmButtonText: "Cancelar torneo",
      denyButtonText: `Volver`,
      icon: 'question',
      customClass: {
        confirmButton: "btn-confirm",
        cancelButton: "btn-cancel",
        denyButton: "btn-deny",
      },
    }).then(async (result) => {
      console.log(result, result.value)
      if (result.isConfirmed) {
        await axios
          .patch(
            `${api_url}/api/torneos/${id}/cancelar`,
            {
              motivoFinalizacion: result.value, // No envíes JSON.stringify aquí
            },
            {
              headers: {
                Authorization: `Bearer ${tokData}`,
                "Content-Type": "application/json", // Agrega este encabezado
              },
            }
          )
          .then((res) => {
            console.log(res.data);
            Swal.fire({
              icon: "success",
              title: "¡OK!",
              text: `Torneo cancelado correctamente`,
              customClass: {
                confirmButton: "btn-confirm",
                cancelButton: "btn-cancel",
                denyButton: "btn-deny",
              },
            });
            setReload(!reload);
          })
          .catch((error) => {
            console.log(error.response);
            Swal.fire({
              icon: "error",
              title: "¡Denegado!",
              text: error.response?.data?.message || "Error desconocido",
              confirmButtonText: "Aceptar",
              customClass: {
                confirmButton: "btn-confirm",
                cancelButton: "btn-cancel",
                denyButton: "btn-deny",
              },
            });
            if (error.response.status === 400) {
              console.log(error.response.data.message);
              Swal.fire({
                icon: "error",
                title: "¡Denegado!",
                text: error.response?.data?.message || "Error desconocido",
                confirmButtonText: "Aceptar",
                customClass: {
                  confirmButton: "btn-confirm",
                  cancelButton: "btn-cancel",
                  denyButton: "btn-deny",
                },
              });
              return;
            }
            if (error.response.status === 403) {
              console.log("⚠ Token expirado, redirigiendo a login...");
              logout();
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
              });
            }
          });
      } else if (result.isDenied) {
        return;
      }
    });
  };

  const [id, setId] = useState(0);

  async function submitTorneo(data, image) {
    const validationErrors = validateFields(data);
    console.log(data.nombreTorneo);

    if (Object.keys(validationErrors).length > 0) {
      return;
    } else {
      setLoadBtn(true);
      try {
        const formData = new FormData();
        const duenoData = new Blob(
          [
            JSON.stringify({
              nombreTorneo: data.nombreTorneo,
              descripcion: data.descripcion,
              fechaInicio: data.fechaInicio,
              maxEquipos: data.maxEquipos,
              minEquipos: data.minEquipos,
              equiposLiguilla: data.equiposLiguilla,
              premio: data.premio,
              vueltas: data.vueltas,
            }),
          ],
          { type: "application/json" }
        );

        formData.append("torneo", duenoData);
        formData.append("imagen", selectedFile);
        const response = await axios.post(`${api_url}/api/torneos`, formData, {
          headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${tokData}`,
          },
        });
        console.log("Respuesta del servidor:", response.data);
        Swal.fire({
          icon: "success",
          title: "¡OK!",
          text: `Torneo creado exitosamente`,
          customClass: {
            confirmButton: "btn-confirm",
            cancelButton: "btn-cancel",
            denyButton: "btn-deny",
          },
        });
        setReload(!reload);
      } catch (err) {
        console.log(err, err.message, err.response);
        if (err.response) {
          Swal.fire({
            icon: "error",
            title: "¡Denegado!",
            text:
              err.response?.data?.message ||
              "Algo salió mal, inténtalo nuevamente",
            customClass: {
              confirmButton: "btn-confirm",
              cancelButton: "btn-cancel",
              denyButton: "btn-deny",
            },
          });
        }
      } finally {
        setLoadBtn(false);
      }
    }
  }

  async function updateTorneo(data, image) {
    const validationErrors = validateFields(data);

    if (Object.keys(validationErrors).length > 0) {
      return;
    } else {
      setLoadBtn(true);
      try {
        const formData = new FormData();
        const duenoData = new Blob(
          [
            JSON.stringify({
              nombreTorneo: data.nombreTorneo,
              descripcion: data.descripcion,
              fechaInicio: data.fechaInicio,
              maxEquipos: data.maxEquipos,
              minEquipos: data.minEquipos,
              equiposLiguilla: data.equiposLiguilla,
              premio: data.premio,
              vueltas: data.vueltas,
            }),
          ],
          { type: "application/json" }
        );

        formData.append("torneo", duenoData);
        formData.append("imagen", selectedFile);
        const response = await axios.post(`${api_url}/api/arbitros`, formData, {
          headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${tokData}`,
          },
        });
        console.log("Respuesta del servidor:", response.data);
        Swal.fire({
          icon: "success",
          title: "¡OK!",
          text: `Torneo actualizado`,
          customClass: {
            confirmButton: "btn-confirm",
            cancelButton: "btn-cancel",
            denyButton: "btn-deny",
          },
        });
      } catch (err) {
        console.log(err, err.message);
        if (err.response) {
          Swal.fire({
            icon: "error",
            title: "¡Denegado!",
            text:
              err.response?.data?.message ||
              "Algo salió mal, inténtalo nuevamente",
            customClass: {
              confirmButton: "btn-confirm",
              cancelButton: "btn-cancel",
              denyButton: "btn-deny",
            },
          });
        }
      } finally {
        setLoadBtn(false);
      }
    }
  }

  const onSubmit = async (data) => {
    console.log(data);
    if (!selectedFile) {
      Swal.fire({
        icon: "error",
        title: "Imagen no seleccionada",
        text: `Elige una imagen para continuar`,
        customClass: {
          confirmButton: "btn-confirm",
          cancelButton: "btn-cancel",
          denyButton: "btn-deny",
        },
      });
      return;
    }

    if (!data.nombreTorneo) {
      setError("nombreTorneo", {
        type: "manual",
        message: "El nombre es requerido",
      });
    }

    if (!data.descripcion) {
      setError("descripcion", {
        type: "manual",
        message: "La descripción es requerida",
      });
    } else if (data.descripcion.length > 500) {
      setError("descripcion", {
        type: "manual",
        message: "Tamaño de descripción excedido",
      });
    }

    if (!data.fechaInicio) {
      setError("fechaInicio", {
        type: "manual",
        message: "La fecha de inicio es requerida",
      });
    } else {
      const fechaIngresada = new Date(data.fechaInicio);
      const fechaActual = new Date();
      fechaActual.setHours(0, 0, 0, 0);
      if (fechaIngresada < fechaActual) {
        setError("fechaInicio", {
          type: "manual",
          message: "La fecha debe ser hoy o en el futuro",
        });
      }
    }

    if (
      !data.minEquipos ||
      isNaN(data.minEquipos) ||
      data.minEquipos < 2 ||
      data.minEquipos % 2 !== 0
    ) {
      setError("minEquipos", {
        type: "manual",
        message: "Debe ser al menos 2 y un número par",
      });
    }

    if (
      !data.maxEquipos ||
      isNaN(data.maxEquipos) ||
      data.maxEquipos < data.minEquipos
    ) {
      setError("maxEquipos", {
        type: "manual",
        message: "Debe ser mayor o igual al mínimo",
      });
    }

    if (
      !data.equiposLiguilla ||
      isNaN(data.equiposLiguilla) ||
      data.equiposLiguilla > data.maxEquipos
    ) {
      setError("equiposLiguilla", {
        type: "manual",
        message: "No puede ser mayor que el máximo de equipos",
      });
    }

    if (!data.vueltas || isNaN(data.vueltas)) {
      setError("vueltas", {
        type: "manual",
        message: "Debe ser un número entero",
      });
    }

    if (!data.premio) {
      setError("premio", {
        type: "manual",
        message: "Se requiere especificar premio",
      });
    }

    !editar
      ? await submitTorneo(data, selectedFile)
      : await updateTorneo(data, selectedFile);
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const getTorneos = async () => {
      const id = await getUserRole();
      const rolo = await getUserId();
      const tok = await getToken();
      setTokData(tok);

      setLoadTors(true);
      axios
        .get(`${api_url}/api/torneos`, {})
        .then((res) => {
          if (res.data.length === 0) setFalloT("No hay árbitros registrados");
          else setTorneos(res.data);
        })
        .catch((e) => {
          console.log(err.response.data.message);
          Swal.fire({
            icon: "error",
            title: "¡Oops!",
            text: err.response?.data?.message || `Error al obtener torneos`,
            confirmButtonText: "Aceptar",
            customClass: {
              confirmButton: "btn-confirm",
              cancelButton: "btn-cancel",
              denyButton: "btn-deny",
            },
          });
          if (err.response.status === 403) {
            console.log("⚠ Token expirado, redirigiendo a login...");
            logout();
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
            });
          }
        })
        .finally(() => setLoadTors(false));
    };
    getTorneos();
  }, [reload]);

  useEffect(() => {
    setValue("nombreTorneo", "");
    setValue("descripcion", "");
    setValue("fechaInicio", "");
    setValue("minEquipos", "");
    setValue("maxEquipos", "");
    setValue("equiposLiguilla", "");
    setValue("vueltas", "");
    setValue("premio", "");
  }, [setValue]);

  const showDetails = (t) => {
    Swal.fire({
      title: `Detalles del torneo ${t.nombreTorneo}`,
      html: `
          <div id='swalUi' style=" overflow-y: auto; padding: 0;">
                <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #ddd;">
                  <img
                      src="${getUrl(t.logoTorneo)}"
                      alt="Local"
                      width="150"
                      height="150"
                      style="border-radius: 50%;"
                    />
                  <div style="display: flex; align-items: center; gap: 10px; width: 100%; justify-content: center;">
                    <div style="text-align: center;">
                      <p>Fecha de inicio: ${t.fechaInicio}</p>
                      <p>Fecha de fin: ${t.fechaFin}</p>
                      <p>Vueltas: ${t.vueltas}</p>
                      <p>Descripción: ${t.descripcion}</p>
                      <p>Máximo de equipos: ${t.maxEquipos}</p>
                      <p>Mínimo de equipos: ${t.minEquipos}</p>
                      <p>Premio disputado: ${t.premio}</p>
                    </div>
                  </div>
                </div>
          </div>
        `,
      confirmButtonText: "OK",
      customClass: {
        confirmButton: "btn-confirm",
        cancelButton: "btn-cancel",
        denyButton: "btn-deny",
      },
    });
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h2 className="mb-0">Torneos</h2>
        </div>
        <div className="overf-auto-2">
          {loadTors ? (
            <div className="centered-div">
              <div className="my-spinner"></div>
            </div>
          ) : falloT === "" ? (
            torneosOrdenados.map((t) => {
              return (
                <div
                  className={`dueno-container-2 ${getEstadoTorneo(t)}`}
                  key={t.id}
                >
                  <div className="torneo-head">
                    <h6
                    // className={`${
                    //   t.estado === "En curso" ? "greenState" : ""
                    // } ${t.estado === "Cancelado" ? "redState" : ""}`}
                    >
                      A liguilla: {t.equiposLiguilla}
                    </h6>

                    <h6>{t.fechaInicio}</h6>
                  </div>
                  {t.logoTorneo ? (
                    <img
                      src={getUrl(t.logoTorneo)}
                      alt={t.nombreTorneo}
                      className="teamImage"
                      width={"50%"}
                      height={"50%"}
                    />
                  ) : (
                    <lord-icon
                      src="https://cdn.lordicon.com/lewtedlh.json"
                      trigger="loop"
                      stroke="bold"
                      state="loop-roll"
                      colors="primary:#333333,secondary:#9A0000"
                      style={{ width: "50%", height: "50%" }}
                    ></lord-icon>
                  )}
                  <h5 className="w-100 p-1 text-center mt-1">
                    Torneo "{t.nombreTorneo}"
                  </h5>
                  {!t.motivoFinalizacion || t.estatusTorneo ? null : (
                    <h6 className="aktive activeTxt aktive-h6">
                      Cancelado por: {t.motivoFinalizacion}
                    </h6>
                  )}
                  {t.esliguilla ? (
                    <h6
                      className="liguilla liguillaTxt body-small aktive-h6"
                      onClick={() =>
                        Swal.fire({
                          title: `Detalles del torneo ${t.nombreTorneo}`,
                          html: `
                              <div id='swalUi' style=" overflow-y: auto; padding: 0;">
                                    <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #ddd;">
                                      <img
                                          src="${getUrl(t.logoTorneo)}"
                                          alt="Local"
                                          width="150"
                                          height="150"
                                          style="border-radius: 50%;"
                                        />
                                      <div style="display: flex; align-items: center; gap: 10px; width: 100%; justify-content: center;">
                                        <div style="text-align: center;">
                                          <p>Fecha de inicio: ${
                                            t.fechaInicio
                                          }</p>
                                          <p>Fecha de fin: ${t.fechaFin}</p>
                                          <p>Vueltas: ${t.vueltas}</p>
                                          <p>Descripción: ${t.descripcion}</p>
                                          <p>Máximo de equipos: ${
                                            t.maxEquipos
                                          }</p>
                                          <p>Mínimo de equipos: ${
                                            t.minEquipos
                                          }</p>
                                          <p>Premio disputado: ${t.premio}</p>
                                        </div>
                                      </div>
                                    </div>
                              </div>
                            `,
                          confirmButtonText: "OK",
                          customClass: {
                            confirmButton: "btn-confirm",
                            cancelButton: "btn-cancel",
                            denyButton: "btn-deny",
                          },
                        })
                      }
                    >
                      En liguilla
                    </h6>
                  ) : (
                    <div className="_row w-100 align-items-center justify-content-center">
                      <button
                        className={`slide-btn-sm ${
                          t.estatusTorneo
                            ? t.iniciado
                              ? "w-100"
                              : "w-100 text-black"
                            : "w-50"
                        }`}
                        onClick={() =>
                          t.estatusTorneo
                            ? t.iniciado
                              ? null //Será editar
                              : showDetails(t)
                            : showDetails(t)
                        }
                      >
                        {t.estatusTorneo
                          ? t.iniciado
                            ? "Editar"
                            : "Detalles"
                          : "Detalles"}
                      </button>
                      {t.motivoFinalizacion || t.estatusTorneo
                        ? !t.ganador &&
                          !t.motivoFinalizacion && (
                            <button
                              className={`slide-btn-sm w-100 text-center ${
                                !t.iniciado
                                  ? "text-black"
                                  : t.iniciado
                                  ? ""
                                  : ""
                              }
                              }`}
                              onClick={
                                () =>
                                  !t.iniciado
                                    ? iniciarTorneo(t.id)
                                    : t.iniciado
                                    ? cancelarTorneo(t.id)
                                    : null //Inalcanzable jiji
                              }
                            >
                              {!t.iniciado
                                ? "Iniciar"
                                : t.iniciado
                                ? "Cancelar"
                                : "Remover"}
                            </button>
                          )
                        : null}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="derecha">
              <h5 id="confirm">{falloT}</h5>
            </div>
          )}
        </div>
        <div className="row">
          <div className="col-lg-8">
            <div className="bg-light form-div">
              <div className="container-fluid">
                <div className="d-sm-flex align-items-center justify-content-between mb-4">
                  <h3 className="mb-0">
                    {editar ? "Editar torneo" : "Nuevo torneo"}
                  </h3>
                </div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="rowInp">
                  <div className="_col2">
                    <TextField
                      fullWidth
                      label="Nombre del torneo"
                      className="txtAr txtCon mb-2 w-100"
                      {...register("nombreTorneo")}
                    />
                    {errors.nombreTorneo && (
                      <p className="text-danger">
                        {errors.nombreTorneo.message}
                      </p>
                    )}
                  </div>
                  <div className="_col2">
                    <TextField
                      fullWidth
                      label="Premio"
                      className="txtAr txtCon mb-2 w-100"
                      {...register("premio")}
                    />
                    {errors.premio && (
                      <p className="text-danger">{errors.premio.message}</p>
                    )}
                  </div>
                </div>

                <TextField
                  label="Descripción"
                  multiline
                  rows={6}
                  fullWidth
                  className="txtAr txtCon mb-2"
                  {...register("descripcion")}
                />
                {errors.descripcion && (
                  <p className="text-danger">{errors.descripcion.message}</p>
                )}

                <div>
                  <div className="fecha-label">Fecha de inicio</div>
                  <TextField
                    type="date"
                    fullWidth
                    inputProps={{ min: new Date().toISOString().split("T")[0] }}
                    className="txtAr txtCon mb-2"
                    {...register("fechaInicio")}
                  />
                  {errors.fechaInicio && (
                    <p className="text-danger">{errors.fechaInicio.message}</p>
                  )}
                </div>

                <div className="rowInp-2">
                  <div className="_col2">
                    <TextField
                      fullWidth
                      label="# máximo de equipos"
                      type="number"
                      className="txtAr txtCon mb-2 w-33"
                      {...register("maxEquipos")}
                    />
                    {errors.maxEquipos && (
                      <p className="text-danger">{errors.maxEquipos.message}</p>
                    )}
                  </div>
                  <div className="_col2">
                    <TextField
                      fullWidth
                      label="# mínimo de equipos"
                      type="number"
                      min={0}
                      className="txtAr txtCon mb-2"
                      {...register("minEquipos")}
                    />
                    {errors.minEquipos && (
                      <p className="text-danger">{errors.minEquipos.message}</p>
                    )}
                  </div>
                  <div className="_col2">
                    <TextField
                      fullWidth
                      label="# de vueltas"
                      type="number"
                      min={0}
                      className="txtAr txtCon mb-2"
                      {...register("vueltas")}
                    />
                    {errors.vueltas && (
                      <p className="text-danger">{errors.vueltas.message}</p>
                    )}
                  </div>
                  <div className="_col2">
                    <TextField
                      fullWidth
                      label="Equipos en liguilla"
                      type="number"
                      min={0}
                      className="txtAr txtCon mb-2"
                      {...register("equiposLiguilla")}
                    />
                    {errors.equiposLiguilla && (
                      <p className="text-danger">
                        {errors.equiposLiguilla.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="button-group justify-content-center">
                  {loadBtn ? (
                    <div className="my-spinner"></div>
                  ) : (
                    <button
                      type="submit"
                      className="slide-btn text-black w-50 align-items-center"
                    >
                      {editar ? "Actualizar torneo" : "Crear torneo"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card shadow mb-4">
              <div className="card-header py-3 bg-red container-fluid">
                <p className=" font-weight-bold body-small text-white ml-md-2">
                  Logo del torneo
                </p>
              </div>
              <div className="arbitro-card">
                <form>
                  <div className="fotoContainer">
                    <img className="img-fluid img" src={preview} alt="..." />
                    <Tooltip title="Elegir logo">
                      <div className="botonDiv-2">
                        <i className="fa fa-image"></i>
                        <input
                          type="file"
                          className="botonCam"
                          accept="image/*"
                          onChange={handleFileChange}
                          id="btnCam"
                        />
                      </div>
                    </Tooltip>
                  </div>
                  <h4 className="mt-1">Logo seleccionado</h4>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
