import React, { useEffect, useRef, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
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
  Button,
} from "@mui/material";
import { Edit, Delete, Map, FilterList } from "@mui/icons-material";
import Swal from "sweetalert2";
import logo1 from "../../img/logo1.png";
const hereApiKey = import.meta.env.VITE_HERE_MAPS_API_KEY;

export default function Admin4() {
  const [counter, setCounter] = useState(1);
  const [inputs, setInputs] = useState({});
  const [address, setAddress] = useState("");
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [marker, setMarker] = useState(null);
  const [isFirst, setIsFirst] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [finding, setFinding] = useState(false);
  const [location, setLocation] = useState(null); // CDMX
  const [location2, setLocation2] = useState(null); // CDMX
  const [src, setSrc] = useState("");
  const [restart, setRestart] = useState(false);
  const [linkMaps, setLinkMaps] = useState("");
  const [found, setFound] = useState(false);
  const [linkVis, setLinkVis] = useState(false);
  const [selection, setSelection] = useState({
    nombre: "",
    direccion: "",
    latitud: "",
    longitud: "",
    cancha: "",
  });
  const [loadBtn, setLoadBtn] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setLocation2({ lat: latitude, lng: longitude });
          setSrc(
            `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`
          );
        },
        (error) => {
          console.error("Error al obtener la ubicación:", error.message);
          // Aquí puedes usar IP como respaldo
        }
      );
    } else {
      console.warn("Geolocalización no disponible en este navegador");
      setLocation({
        lat: 18.849136305780387,
        lng: -99.20017382614945,
      });
      setLocation2({
        lat: 18.849136305780387,
        lng: -99.20017382614945,
      });
      setSrc(
        `https://www.google.com/maps?q=${18.849136305780387},${-99.20017382614945}&z=15&output=embed`
      );
    }
  }, [restart]);

  const handleShowToast = () => {
    const toastEl = document.getElementById("liveToast");
    const toast = new bootstrap.Toast(toastEl); // 👈 crea la instancia
    toast.show(); // 👈 muestra el toast
  };

  const handleShowToast2 = () => {
    const toastEl = document.getElementById("liveToastQuest");
    const toast = new bootstrap.Toast(toastEl); // 👈 crea la instancia
    toast.show(); // 👈 muestra el toast
  };

  // Función para obtener sugerencias de direcciones
  const handleSearchPlaces = async (query) => {
    setFinding(true);
    if (query.length > 2) {
      try {
        // Hacemos una solicitud GET a la API de búsqueda de Nominatim
        const res = await axios.get(
          `https://corsproxy.io/?https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            query.toLowerCase()
          )}&countrycodes=MX&format=json`
        );

        // Se puede utilizar los resultados de 'res.data' para obtener los lugares sugeridos
        setSuggestions(res.data);
        if (res.data.length === 0) {
          handleShowToast();
          setLinkVis(true);
        } else {
          setLinkVis(false);
        }

        if (res.data.length > 0) {
          // Si hay resultados, el primer lugar es el más relevante
          const firstPlace = res.data[0];
          setAddress(firstPlace.display_name);
          setLocation2({
            lat: firstPlace.lat,
            lng: firstPlace.lon,
          });
        }
      } catch (error) {
        console.error("Error obteniendo lugares:", error);
        setSuggestions([]);
      } finally {
        setFinding(false);
      }
    } else {
      setSuggestions([]);
      setAddress("");
      setFinding(false);
    }
  };

  // Función para seleccionar un lugar y obtener coordenadas
  const handleSelect = async (place) => {
    console.log(place);
    // Separar el nombre del lugar y la dirección
    const addressParts = place.display_name.split(",");
    const name = addressParts[0]; // Nombre del lugar
    const address = addressParts.slice(1).join(","); // Dirección (todo menos el nombre)
    setFound(false);

    setLocation2({ lat: place.lat, lng: place.lon });
    setSuggestions([]); // Limpia las sugerencias
    setMarker({ lat: place.lat, lng: place.lon }); // Actualiza marcador
    setValue("direccion", address); // Establece la dirección
    setValue("longitud", place.lat); // Establece la longitud
    setValue("latitud", place.lon); // Establece la latitud
    trigger();
    setSelection({
      ...selection,
      nombre: name,
      direccion: address,
      latitud: place.lat,
      longitud: place.lon,
    });

    setSrc(
      `https://www.google.com/maps?q=${place.lat},${place.lon}&z=15&output=embed`
    );
  };

  // Función para deseleccionar un lugar
  const handleDiselect = () => {
    setSearch(""); // Limpia la búsqueda
    setSuggestions([]); // Limpia las sugerencias
    setAddress(""); // Limpia la dirección
    setMarker(null); // Restablece el marcador
    setSrc(""); // Restablece la vista del mapa
    setRestart(!restart);
    reset();
    clearErrors();
    setSelection({
      nombre: "",
      direccion: "",
      latitud: "",
      longitud: "",
      cancha: "",
    });
    setLinkVis(false);
    setInputs({});
    setCounter(1);
    setFound(false);
  };
  const submitCampo = (e) => {
    e.preventDefault();
    console.log("Guardando campo");
  };

  // 🔹 Función para manejar clics en el mapa
  const handleMapClick = (event) => {
    console.log(event, "Si");
    const [lat, lng] = event.latLng.split(",").map(Number);
    setLocation2({ lat, lng });
  };

  //Importado de Native
  const { getUserId, getUserRole, getToken, api_url, logout } =
    useContext(AuthContext);
  const [tokData, setTokData] = useState("");
  const [vis, setVis] = useState(false);
  const [editando, setEditando] = useState(false);
  const [campoEdit, setCampoEdit] = useState({});
  const [canchasEdit, setCanchasEdit] = useState([]);

  const [idCancha, setIdCancha] = useState({});
  const [modalCancha, setModalCancha] = useState(false);

  const [lugar, setLugar] = useState("");
  const [elecc, setElecc] = useState("");
  const [address2, setAddress2] = useState("");
  const [campos, setCampos] = useState([]);
  //const [canchas, setCanchas] = useState([]);
  const [canchas, setCanchas] = useState([
    { id: Date.now(), pos: 0, desc: "" },
  ]); // Fila por defecto
  const [canchasDesc, setCanchasDesc] = useState([]);
  const [loadCamps, setLoadCamps] = useState(false);
  const [fallo1, setFallo1] = useState("");

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [rows, setRows] = useState(1);
  const [rowsEdit, setRowsEdit] = useState(1);

  const [id, setId] = useState(0);

  const [reload, setReload] = useState(false);

  //esquema para validaciones
  const campo = yup.object().shape({
    id: yup.number(),
    nombre: yup.string().required("El nombre es requerido"),
    direccion: yup.string().required("La dirección es requerida"),
    latitud: yup
      .number("No válido")
      .typeError("Debe ser un número")
      .required("Latitud Requerida"),
    longitud: yup
      .number("No válido")
      .typeError("Debe ser un número")
      .required("Longitud Requerida"),
    cancha: yup.string().required("Debes registrar al menos 1 cancha"),
  });

  // Al momento de editar, puedes establecer estos valores como predeterminados
  const setEdicion = (campo, cancha, canchas) => {
    setId(campo.id);
    setEditando(true);
    // Usamos setValue para rellenar el formulario con los valores de miCampo
    setValue("id", campo.id);
    setValue("nombre", campo.nombre);
    setValue("direccion", campo.direccion);
    setValue("latitud", campo.latitud);
    setValue("longitud", campo.longitud);
    setValue("cancha", cancha);
    setCanchasEdit(canchas);
    trigger();
    canchas.map((c) => {
      console.log(c);
    });
  };

  // Al momento de editar, puedes establecer estos valores como predeterminados
  const removeEdicion = () => {
    // Usamos setValue para rellenar el formulario con los valores de miCampo
    setId(0);
    setValue("nombre", "");
    setValue("direccion", "");
    setValue("latitud", "");
    setValue("longitud", "");
    setValue("cancha", "");
    setEditando(false);
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
    clearErrors,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(campo),
    mode: "onChange",
  });

  const [edit, setEdit] = useState(false);

  const crearCampo = async (data) => {
    setLoadBtn(true);
    try {
      const res = await axios.post(
        `${api_url}/api/campos`,
        JSON.stringify({
          nombre: data.nombre,
          direccion: data.direccion,
          latitud: data.latitud,
          longitud: data.longitud,
        }),
        {
          headers: {
            Authorization: `Bearer ${tokData}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res.data);
      if (res.data.id) {
        Object.entries(inputs).forEach(([key, value]) => {
          console.log(`Clave: ${key}, Valor: ${value}`);
          registrarCancha(value, key + 1, res.data.id);
        });
      }
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Campo registrado exitosamente",
        customClass: {
          confirmButton: "btn-confirm",
          cancelButton: "btn-cancel",
          denyButton: "btn-deny",
        },
      });
      setReload(!reload);
      handleDiselect();
    } catch (err) {
      console.log(err)
      console.error(err, err.response?.message);
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
    } finally {
      setLoadBtn(false);
    }
  };

  const registrarCancha = async (desc, pos, id) => {
    try {
      const res = await axios.post(
        `${api_url}/api/canchas`,
        JSON.stringify({
          numeroCancha: pos,
          descripcion: desc,
          idCampo: id,
        }),
        {
          headers: {
            Authorization: `Bearer ${tokData}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res.data);
    } catch (err) {
      console.log(err);
      console.error(err, err.response?.message);
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
      return;
    }
  };

  const quitarCancha = async (id) => {
    try {
      const res = await axios.put(
        `${api_url}/api/canchas/estatus/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tokData}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res.data);

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: res.data || "Operación exitosa",
        customClass: {
          confirmButton: "btn-confirm",
          cancelButton: "btn-cancel",
          denyButton: "btn-deny",
        },
      });
      setReload(!reload);
    } catch (err) {
      console.log(err.toJSON());
      console.error(err, err.response.message);
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
    } finally {
      setModalCancha(false);
    }
  };

  const updateCampo = async (data) => {
    const token = await getToken();
    try {
      const res = await axios.put(
        `${api_url}/api/campos/${data.id || id}`,
        JSON.stringify({
          nombre: data.nombre,
          direccion: data.direccion,
          latitud: data.latitud,
          longitud: data.longitud,
        }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res.data);
      if (res.data.id) {
        canchasEdit.map((c) => {
          updateCancha(c.descripcion, c.numeroCancha, res.data.id, c.id);
          console.log(c);
        });
      }
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Campo actualizado exitosamente",
        customClass: {
          confirmButton: "btn-confirm",
          cancelButton: "btn-cancel",
          denyButton: "btn-deny",
        },
      });
      setReload(!reload);
      removeEdicion();
      setCampoEdit({});
      setCanchasEdit([]);
    } catch (err) {
      console.error(err, err.response.message, err.toJSON());
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
    }
  };

  const updateCancha = async (desc, pos, id, idCan) => {
    const token = await getToken();
    try {
      const res = await axios.put(
        `${api_url}/api/canchas/${idCan}`,
        JSON.stringify({
          numeroCancha: pos,
          descripcion: desc,
          idCampo: id,
        }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res.data);
    } catch (err) {
      console.log(err.toJSON());
      console.error(err, err.response.message);
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
    }
  };

  function extraerCoordenadas(url) {
    // Expresión regular para extraer coordenadas de una URL de Google Maps
    const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const resultado = url.match(regex);

    if (resultado) {
      const latitud = resultado[1];
      const longitud = resultado[2];

      console.log("Coordenadas extraídas: ", latitud, longitud);
      setValue("longitud", longitud); // Establece la longitud
      setValue("latitud", latitud); // Establece la latitud
      trigger();
      setSelection({
        ...selection,
        latitud: latitud,
        longitud: longitud,
      });
      setFound(true);
      setLinkVis(false);
    } else {
      // Si no se pueden extraer coordenadas, mostrar un Sweet Alert
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: "No se pudieron extraer las coordenadas del enlace de Google Maps. ",
        confirmButtonText: "Ingresar manualmente",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "btn-confirm",
          cancelButton: "btn-cancel",
          denyButton: "btn-deny",
        },
      }).then((resutlt) => {
        if (resutlt.isConfirmed) {
          setFound(true);
          setLinkVis(false);
        } else {
          handleDiselect();
        }
      });
    }
  }

  useEffect(() => {
    const getCampos = async () => {
      const id = await getUserRole();
      const rolo = await getUserId();
      const tok = await getToken();
      setTokData(tok);

      setLoadCamps(true);
      axios
        .get(`${api_url}/api/campos/activos`, {
          headers: {
            Authorization: `Bearer ${tok}`,
          },
        })
        .then((res) => {
          if (res.data.length === 0) setFallo1("No hay campos registrados");
          else setCampos(res.data);
          console.log(res.data);
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
          if (e.response.message) setFallo1(e.response.message);
          else setFallo1("Error al obtener campos");
        })
        .finally(() => setLoadCamps(false));
    };
    getCampos();
    setCanchas([{ id: Date.now(), pos: 0, desc: "" }]);
  }, [reload]);

  const onSubmit = async (data) => {
    console.log(data);
    console.log(inputs);
    !edit ? crearCampo(data) : updateCampo(data);
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h2 className="mb-0">Menú de campos</h2>
        </div>
      </div>
      <div className="px-3 table-overflow mb-1">
        {loadCamps ? (
          <div className="w-100 align-items-center d-flex row justify-content-center">
            <div className="my-spinner"></div>
          </div>
        ) : fallo1 === "" ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead className="myThead theadContainer">
                <TableRow>
                  <TableCell className="cell">#</TableCell>
                  <TableCell className="cell">Nombre</TableCell>
                  <TableCell className="cell">Dirección</TableCell>
                  <TableCell className="cell">Canchas</TableCell>
                  <TableCell className="cell">Opciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {campos.map((d, index) => {
                  return (
                    <TableRow key={d.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{d.nombre}</TableCell>
                      <TableCell>{d.direccion}</TableCell>
                      <TableCell>{d.canchas.length}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => onEdit(d)}>
                          <Edit color="primary" />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            setLocation({ lat: d.latitud, lng: d.longitud })
                          }
                        >
                          <Map color="success" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div>
            <div className="w-100 align-items-center d-flex flex-column gap-1">
              <lord-icon
                id="input-icon-2"
                src="/icons/pin.json"
                trigger="loop"
                stroke="bold"
                state="hover-swipe"
                colors="primary:#333333,secondary:#9A0000"
                style={{ width: "9em", height: "9em" }}
              ></lord-icon>
              <h5>{fallo1}</h5>
            </div>
          </div>
        )}
      </div>
      {fallo1 === "" && (
        <div className="centered-map">
          <iframe
            title="HERE Map"
            width="95%"
            height="400"
            className="map-frame map1"
            src={
              location === null
                ? `https://www.google.com/maps?q=${18.849136305780387},${-99.20017382614945}&z=15&output=embed`
                : `https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`
            }
          />
        </div>
      )}
      <div className="row px-2">
        <div className="col-lg-6">
          <iframe
            title="Mapa registro"
            width="100%"
            height="400"
            className="map-frame"
            src={src}
            onLoad={(e) => {
              const iframe = e.target;
              iframe.addEventListener("click", handleMapClick);
            }}
          />
        </div>
        <div className="col-lg-6">
          <div className="card bg-light shadow p-4 h-100">
            <div className="card-header bg-red d-flex justify-content-between align-items-center flex-row container-fluid">
              <p className="font-weight-bold body-small text-white">
                Registrar campo
              </p>
              {finding ? (
                <div className="my-spinner-sm"></div>
              ) : (
                <Tooltip title="Reinciar campos">
                  <IconButton onClick={() => handleDiselect()}>
                    <Delete color="warning" />
                  </IconButton>
                </Tooltip>
              )}
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="gap-5">
              <div className="input-group mt-2">
                <TextField
                  className="txtAr w-90"
                  label="Nombre del campo"
                  margin="none"
                  name="nombreCampo"
                  required
                  fullWidth
                  focused={getValues("nombre") !== ""}
                  value={selection.nombre}
                  {...register("nombre")}
                  onInput={(e) => {
                    setSelection({
                      ...selection,
                      nombre: e.target.value,
                    });
                  }}
                  placeholder="Buscar lugar..."
                />
                <div className="input-group-append w-10">
                  <button
                    className="btn red-btn"
                    type="button"
                    onClick={() => handleSearchPlaces(selection.nombre)}
                  >
                    <i className="fas fa-search fa-sm"></i>
                  </button>
                </div>
              </div>

              {errors.nombre && (
                <p className="text-danger">{errors.nombre.message}</p>
              )}

              {suggestions.length > 0 && (
                <div>
                  <a
                    className="link"
                    onClick={() => {
                      setLinkVis(true);
                      setSuggestions([]);
                    }}
                  >
                    Ingresar manualmente
                  </a>
                  <ul className="suggestions-list quitarScroll w-100">
                    {suggestions.map((place) => (
                      <li key={place.id} onClick={() => handleSelect(place)}>
                        {place.display_name}{" "}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <TextField
                className="txtAr mt-1 mb-1"
                label="Dirección"
                fullWidth
                margin="dense"
                name="direccion"
                required
                focused={getValues("direccion") !== ""}
                value={selection.direccion}
                onInput={(e) =>
                  setSelection({
                    ...selection,
                    direccion: e.target.value,
                  })
                }
                placeholder="Buscar dirección..."
                {...register("direccion")}
              />
              {errors.direccion && (
                <p className="text-danger">{errors.direccion.message}</p>
              )}
              {found && (
                <TextField
                  className="txtAr mt-1 mb-1"
                  label="Latitud"
                  fullWidth
                  margin="dense"
                  name="latitud"
                  required
                  focused={getValues("latitud")}
                  value={selection.latitud}
                  onInput={(e) =>
                    setSelection({
                      ...selection,
                      latitud: e.target.value,
                    })
                  }
                  placeholder="Ingresa la longitud"
                  {...register("latitud")}
                />
              )}
              {errors.latitud && (
                <p className="text-danger">{errors.latitud.message}</p>
              )}
              {found && (
                <TextField
                  className="txtAr mt-1 mb-1"
                  label="Longitud"
                  fullWidth
                  margin="dense"
                  name="longitud"
                  placeholder="Ingresa la longitud"
                  required
                  focused={getValues("longitud")}
                  value={selection.longitud}
                  onInput={(e) =>
                    setSelection({
                      ...selection,
                      longitud: e.target.value,
                    })
                  }
                  {...register("longitud")}
                />
              )}
              {errors.longitud && (
                <p className="text-danger">{errors.longitud.message}</p>
              )}
              {linkVis && (
                <div className="input-group mt-2 mb-2">
                  <TextField
                    className="txtAr w-90"
                    label="Enlace de google maps"
                    margin="none"
                    name="nombreCampo"
                    required
                    fullWidth
                    onChange={(e) => {
                      extraerCoordenadas(e.target.value);
                    }}
                    placeholder="Ingresa el enlace para obtener sus coordenadas"
                  />
                  <div className="input-group-append w-10">
                    <button
                      className="btn red-btn"
                      type="button"
                      onClick={() => handleShowToast2()}
                    >
                      <i className="fas fa-circle-info fa-sm"></i>
                    </button>
                  </div>
                </div>
              )}
              {loadBtn ? (
                <div className="w-100 mt-3 d-flex align-items-center justify-content-center">
                  <div className="my-spinner"></div>
                </div>
              ) : (
                <button
                  type="submit"
                  id="submitArb"
                  disabled={!isValid}
                  className={`${isValid ? "" : "opa-0"} text-black`}
                >
                  Registrar
                </button>
              )}
              {errors.cancha && (
                <p className="text-danger">{errors.cancha.message}</p>
              )}
            </form>
          </div>
        </div>
        <div className="container-fluid">
          <div className="d-sm-flex align-items-center justify-content-between mt-4 mb-1">
            <h4 className="mb-0">Asignacion de canchas</h4>
          </div>
        </div>
        <div className="canchas-group bg-light quitarScroll">
          {Array.from({ length: counter }).map((_, index) => {
            const handleInputChange = (i, text) => {
              setInputs((prev) => ({
                ...prev,
                [i]: text,
              }));
            };

            const handleRemove = (i) => {
              if (!inputs[i]) {
                setCounter((prev) => prev - 1);
                const updatedInputs = { ...inputs };
                delete updatedInputs[i];
                setInputs(updatedInputs);
              }
            };

            return (
              <div className="w-100 mb-2" key={index}>
                <div className="row align-items-center gap-0 justify-content-center container-fluid">
                  <div className="col-1 text-center p-1 hide-when">
                    <TextField
                      className="txtAr canchaName inputo hide-when"
                      margin="dense"
                      name="nombre"
                      disabled
                      value={`#${index + 1}`}
                      fullWidth
                      variant="outlined"
                    />
                  </div>
                  <div
                    className={
                      window.innerWidth >= 991 ? "col-8 p-1" : "col-10"
                    }
                  >
                    {index === 0 ? (
                      <TextField
                        className="txtAr canchaDesc inputo"
                        type="text"
                        label="Descripción"
                        margin="dense"
                        name="correo"
                        required
                        value={selection.cancha}
                        fullWidth
                        variant="outlined"
                        {...register("cancha")}
                        onInput={(e) => {
                          setSelection({
                            ...selection,
                            cancha: e.target.value,
                          });
                          handleInputChange(index, e.target.value);
                        }}
                      />
                    ) : (
                      <TextField
                        className="txtAr canchaDesc inputo"
                        type="text"
                        label="Descripción"
                        margin="dense"
                        name="correo"
                        required
                        fullWidth
                        variant="outlined"
                        onInput={(e) =>
                          handleInputChange(index, e.target.value)
                        }
                      />
                    )}
                  </div>
                  <div className="col-2 d-flex justify-content-center p-1">
                    <Button
                      className={`butWidth mb-1 text-white ${
                        index === 0 ? "btn-blue" : "btn-red"
                      }`}
                      onClick={() => {
                        if (index === 0) {
                          setCounter((prev) => prev + 1);
                        } else {
                          handleRemove(index);
                        }
                      }}
                      fullWidth
                    >
                      {index === 0 ? (
                        <i className="fa fa-plus icon" aria-hidden="true"></i>
                      ) : (
                        <i className="fa fa-minus icon" aria-hidden="true"></i>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div
          className="position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 11 }}
        >
          <div
            id="liveToast"
            className="toast hide fade"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header bg-dark-base">
              <img
                src={logo1}
                className="rounded me-2"
                alt="Logo"
                width="15rem"
                height="15rem"
              />
              <strong className="me-auto text-white">
                ¡Lugar no encontrado!
              </strong>
              <small className="text-white">Justo ahora</small>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="toast"
                aria-label="Close"
              ></button>
            </div>
            <div className="toast-body">
              No se pudo encontrar el lugar desado, localice el lugar en el
              mapa, obtenga el enlace de google Maps, y peguelo en campo de
              texto correspondiente
            </div>
          </div>
        </div>
        <div
          className="position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 11 }}
        >
          <div
            id="liveToastQuest"
            className="toast hide fade"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header bg-dark-base">
              <img
                src={logo1}
                className="rounded me-2"
                alt="Logo"
                width="15rem"
                height="15rem"
              />
              <strong className="me-auto text-white">
                ¿No encontraste tu ubicación deseada?
              </strong>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="toast"
                aria-label="Close"
              ></button>
            </div>
            <div className="toast-body">
              No te preocupes, localice el lugar en el mapa, da click en
              'Ampliar el mapa' y obtenga el enlace de google Maps, y peguelo en
              campo de texto correspondiente
              <p>El formato del enlace debe ser similar a este:</p>
              <pre>
                <code>
                  https://www.google.com/maps/place/Some+Location/@latitud,longitud
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
