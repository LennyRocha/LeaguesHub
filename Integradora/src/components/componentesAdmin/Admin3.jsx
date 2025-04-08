import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import "bootstrap";
import lottie from "lottie-web";
import { defineElement } from "@lordicon/element";
import userPlace from "../../assets/images/user-placeholder.png"
import fotoPlace from "../../assets/images/foto-placeholder.png"
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
import { Edit, Delete, LibraryAdd, EmojiEvents } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
// define "lord-icon" custom element with default properties
defineElement(lottie.loadAnimation);

const torneo = yup.object().shape({
  id: yup.number(),
  foto: yup.string(),
  iniciado: yup.boolean(),
  nombreTorneo: yup.string("No válido").required("El nombre es requerido"),
  descripcion: yup
    .string("No válido")
    .max(500, "Tamaño de descripción excedido")
    .required("La descripción del torneo es requerida"),
  fechaInicio: yup
    .string("No válido")
    .required("La fecha de inicio es requerida")
    .test("es-futura", "La fecha debe ser hoy o en el futuro", (value) => {
      const fechaIngresada = new Date(value);
      const fechaActual = new Date();
      fechaActual.setHours(0, 0, 0, 0);
      return fechaIngresada >= fechaActual;
    })
    .test("es-domingo", "La fecha debe ser un domingo", (value) => {
      const fechaIngresada = new Date(value);
      return fechaIngresada.getDay() === 6; // 0 representa el domingo en JavaScript
    }),
  minEquipos: yup
    .number("No válido")
    .typeError("Debe ser un número")
    .integer("Se requiere un número entero")
    .min(2, "Debe ser al menos 2")
    .test("es-par", "El número debe ser par", (value) => value % 2 === 0)
    .required("Este campo es obligatorio")
    .test("max-min", "Debe ser menor o igual al máximo", function (value) {
      return value <= this.parent.maxEquipos;
    }),
  maxEquipos: yup
    .number("No válido")
    .typeError("Debe ser un número")
    .integer("Se requiere un número entero")
    .min(2, "Debe ser al menos 2")
    .test("es-par", "El número debe ser par", (value) => value % 2 === 0)
    .required("Este campo es obligatorio")
    .test("min-max", "Debe ser mayor o igual al mínimo", function (value) {
      return value >= this.parent.minEquipos;
    }),
  equiposLiguilla: yup
    .number()
    .typeError("Debe ser un número")
    .integer("Debe ser un número entero")
    .min(4, "Debe ser al menos 4")
    .required("Debes especificar cuántos pasan a liguilla")
    .max(yup.ref("maxEquipos"), "No puede ser mayor que el máximo de equipos"),
  vueltas: yup
    .number("No válido")
    .typeError("Debe ser un número")
    .integer("Debe ser un número entero")
    .min(1, "Debe ser mayor a 0")
    .required("Se requieren las vueltas"),
  premio: yup.string().required("Se requiere especificar premio"),
});

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
  const inputRef = useRef(null);

  const getEstadoTorneo = (tor) => {
    if (tor.motivoFinalizacion) return "torCancel"; // Cancelado
    if (!tor.estatusTorneo) return "torAcabado"; // Finalizado con ganador
    if (tor.iniciado && tor.esliguilla) return "torLiguilla"; // En liguilla
    if (tor.iniciado) return "torAct"; // En juego
    if (!tor.estatusLlenado) return "bg-light"; // En espera

    return "torAct"; // Por defecto
  };

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    reset,
    trigger,
    resetField,
    clearErrors, // ✅ Extraído correctamente desde useForm()
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(torneo),
    mode: "onChange",
  });

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
    fotoPlace
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
      });
  };

  const cancelarTorneo = async (id) => {
    const tokData = await getToken();
    Swal.fire({
      title: "¿Cancelar torneo?",
      text: "Esta acción es irreversible, de confirmarlo, especifica un motivo para su cancelación",
      input: "text",
      showDenyButton: true,
      confirmButtonText: "Cancelar torneo",
      denyButtonText: `Volver`,
      icon: "question",
      customClass: {
        confirmButton: "btn-confirm",
        cancelButton: "btn-cancel",
        denyButton: "btn-deny",
      },
    }).then(async (result) => {
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
          });
      } else if (result.isDenied) {
        return;
      }
    });
  };

  const [id, setId] = useState(0);
  const [selection, setSelection] = useState({
    id: "",
    nombreTorneo: "",
    descripcion: "",
    fechaInicio: "",
    minEquipos: "",
    maxEquipos: "",
    equiposLiguilla: "",
    vueltas: "",
    premio: "",
    foto: "",
  });

  const doEdit = (tor) => {
    setSelection({
      id: tor.id,
      nombreTorneo: tor.nombreTorneo,
      descripcion: tor.descripcion,
      fechaInicio: tor.fechaInicio,
      minEquipos: tor.minEquipos,
      maxEquipos: tor.maxEquipos,
      equiposLiguilla: tor.equiposLiguilla,
      vueltas: tor.vueltas,
      premio: tor.premio,
      foto: tor.logoTorneo,
    });
    setValue("id", tor.id);
    setValue("nombreTorneo", tor.nombreTorneo);
    setValue("descripcion", tor.descripcion);
    setValue("fechaInicio", tor.fechaInicio);
    setValue("minEquipos", tor.minEquipos);
    setValue("maxEquipos", tor.maxEquipos);
    setValue("equiposLiguilla", tor.equiposLiguilla);
    setValue("vueltas", tor.vueltas);
    setValue("premio", tor.premio);
    setValue("foto", tor.logoTorneo);
    trigger();
    setPreview(tor.logoTorneo);
    setEditar(true);
  };

  const [nombreTorneo, setNombreTorneo] = useState("");

  async function submitTorneo(data, image) {
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
        const response = await axios.post(`${api_url}/api/torneos`, formData, {
          headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${tokData}`,
          },
        });
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
        setPreview(
          fotoPlace
        );
        setEditar(false);
        setSelection({
          id: "",
          nombreTorneo: "",
          descripcion: "",
          fechaInicio: "",
          minEquipos: "",
          maxEquipos: "",
          equiposLiguilla: "",
          vueltas: "",
          premio: "",
          foto: "",
        });
        reset();
        clearErrors();
        resetField("descripcion");
        setValue("descripcion", "");
      } catch (err) {
        console.error(err);
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
        if (selectedFile) {
          formData.append("imagen", selectedFile);
        } else {
          formData.append("imagen", null);
        }
        const response = await axios.put(
          `${api_url}/api/torneos/${data.id}`,
          formData,
          {
            headers: {
              // "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${tokData}`,
            },
          }
        );
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
        setPreview(
          fotoPlace
        );
        setEditar(false);
        setSelection({
          id: "",
          nombreTorneo: "",
          descripcion: "",
          fechaInicio: "",
          minEquipos: "",
          maxEquipos: "",
          equiposLiguilla: "",
          vueltas: "",
          premio: "",
          foto: "",
        });
        reset();
        clearErrors();
        resetField("descripcion");
        setValue("descripcion", "");
      } catch (err) {
        console.error(err);
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
        .catch((err) => {
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
  }, []);

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
                      className="torImg"
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
                              ? doEdit(t) //Será editar
                              : doEdit(t)
                            : showDetails(t)
                        }
                      >
                        {t.estatusTorneo
                          ? t.iniciado
                            ? "Editar"
                            : "Editar"
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
            <div className="w-100 align-items-center d-flex flex-column gap-1">
              <lord-icon
                src="https://cdn.lordicon.com/lewtedlh.json"
                trigger="loop"
                stroke="bold"
                state="hover-swipe"
                colors="primary:#333333,secondary:#9A0000"
                style={{ width: "8em", height: "8em" }}
              ></lord-icon>
              <h5>{falloT}</h5>
            </div>
          )}
        </div>
        <div className="row">
          <div className="col-lg-8">
            <div className="bg-light form-div">
              <div className="">
                <div className="d-flex w-100 flex-row align-items-center justify-content-left mb-4">
                  <h3 className="mb-0">
                    {editar ? "Editar torneo" : "Nuevo torneo"}
                  </h3>
                  {editar && (
                    <Tooltip title="Crear un torneo">
                      <IconButton
                        onClick={() => {
                          setPreview(
                            fotoPlace
                          );
                          setEditar(false);
                          setSelection({
                            id: "",
                            nombreTorneo: "",
                            descripcion: "",
                            fechaInicio: "",
                            minEquipos: "",
                            maxEquipos: "",
                            equiposLiguilla: "",
                            vueltas: "",
                            premio: "",
                            foto: "",
                          });
                          reset();
                          clearErrors();
                          resetField("descripcion");
                          setValue("descripcion", "");
                        }}
                      >
                        <EmojiEvents color="warning" />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="rowInp">
                  <div className="_col2">
                    <TextField
                      fullWidth
                      label="Nombre del torneo"
                      value={selection.nombreTorneo}
                      onInput={(e) =>
                        setSelection({
                          ...selection, // Mantén los valores actuales
                          nombreTorneo: e.target.value, // Actualiza solo el campo 'nombreTorneo'
                        })
                      }
                      focused={getValues("nombreTorneo") !== ""}
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
                      value={selection.premio}
                      onInput={(e) =>
                        setSelection({
                          ...selection, // Mantén los valores actuales
                          premio: e.target.value, // Actualiza solo el campo 'nombreTorneo'
                        })
                      }
                      focused={getValues("premio") !== ""}
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
                  value={selection.descripcion}
                  onInput={(e) =>
                    setSelection({
                      ...selection, // Mantén los valores actuales
                      descripcion: e.target.value, // Actualiza solo el campo 'nombreTorneo'
                    })
                  }
                  focused={getValues("descripcion") !== ""}
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
                    value={getValues("fechaInicio")}
                    focused={getValues("fechaInicio") !== ""}
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
                      inputProps={{ min: 0 }}
                      focused={getValues("maxEquipos") !== ""}
                      value={selection.maxEquipos}
                      onInput={(e) =>
                        setSelection({
                          ...selection, // Mantén los valores actuales
                          maxEquipos: e.target.value, // Actualiza solo el campo 'nombreTorneo'
                        })
                      }
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
                      inputProps={{ min: 0 }}
                      focused={getValues("minEquipos") !== ""}
                      value={selection.minEquipos}
                      onInput={(e) =>
                        setSelection({
                          ...selection, // Mantén los valores actuales
                          minEquipos: e.target.value, // Actualiza solo el campo 'nombreTorneo'
                        })
                      }
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
                      inputProps={{ min: 0 }}
                      value={selection.vueltas}
                      onInput={(e) =>
                        setSelection({
                          ...selection, // Mantén los valores actuales
                          vueltas: e.target.value, // Actualiza solo el campo 'nombreTorneo'
                        })
                      }
                      focused={getValues("vueltas") !== ""}
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
                      inputProps={{ min: 0 }}
                      value={selection.equiposLiguilla}
                      onInput={(e) =>
                        setSelection({
                          ...selection, // Mantén los valores actuales
                          equiposLiguilla: e.target.value, // Actualiza solo el campo 'nombreTorneo'
                        })
                      }
                      focused={getValues("equiposLiguilla") !== ""}
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

                <div className="button-group justify-content-center w-100">
                  {loadBtn ? (
                    <div className="my-spinner"></div>
                  ) : (
                    <button
                      type="submit"
                      className={`slide-btn w-50 text-black align-items-center w-chiqui-100 ${
                        isValid ? "" : "opa-0"
                      }`}
                      disabled={!isValid}
                    >
                      {editar ? "Actualizar" : "Crear torneo"}
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
                    <img
                      className="img-fluid img my-img"
                      src={getValues("foto") !== "" ? getUrl(preview) : preview}
                      alt="..."
                    />
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