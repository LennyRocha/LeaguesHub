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
import TestMap from "./testMap";

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
  const searchRef = useRef("");

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
        console.log(error.toJSON());
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

    setLocation2({ lat: place.lat, lng: place.lon });
    setSuggestions([]); // Limpia las sugerencias
    setMarker({ lat: place.lat, lng: place.lon }); // Actualiza marcador
    setValue("direccion", address); // Establece la dirección
    trigger("direccion");

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
  const { getUserId, getUserRole, getToken, api_url } = useContext(AuthContext);
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
    clearErrors, // ✅ Extraído correctamente desde useForm()
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(campo),
    mode: "onChange",
  });

  const crearCampo = async (data) => {
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
        canchas.map((c) => {
          registrarCancha(c.desc, c.pos, res.data.id);
        });
      }
      Alert.alert("¡Éxito!", "Campo registrado exitosamente");
      setReload(!reload);
    } catch (err) {
      console.error(err, err.res.message);
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
      Alert.alert("¡Éxito!", "operación exitosa");
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
      Alert.alert("¡Éxito!", "Campo actualizado exitosamente");
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
          if (e.res.message) setFallo1(e.res.message);
          else setFallo1("Error al obtener campos");
        })
        .finally(() => setLoadCamps(false));
    };
    getCampos();
    setCanchas([{ id: Date.now(), pos: 0, desc: "" }]);
  }, [reload]);

  const onSubmit = async (data) => {
    console.log(data);
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h2 className="mb-0">Menú de campos</h2>
        </div>
      </div>
      <div className="container-fluid table-overflow mb-0">
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
                src="../../../public/icons/pin.json"
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
              <TextField
                className="txtAr"
                label="Nombre del campo"
                fullWidth
                margin="dense"
                name="nombreCampo"
                required
                focused={getValues("nombre") !== ""}
                value={getValues("nombre")} // Asegúrate de que sea una cadena vacía si undefined
                {...register("nombre")}
                onInput={(e) => {
                  handleSearchPlaces(e.target.value); // Realiza la búsqueda en tiempo real
                }}
                placeholder="Buscar lugar..."
              />

              {errors.nombre && (
                <p className="text-danger">{errors.nombre.message}</p>
              )}

              {suggestions.length > 0 && (
                <ul className="suggestions-list quitarScroll w-100">
                  {suggestions.map((place) => (
                    <li key={place.id} onClick={() => handleSelect(place)}>
                      {place.display_name}{" "}
                      {/* Aquí puedes mostrar el nombre del lugar */}
                    </li>
                  ))}
                </ul>
              )}
              <TextField
                className="txtAr mt-1 mb-1"
                label="Dirección"
                fullWidth
                margin="dense"
                name="direccion"
                required
                focused={getValues("direccion") !== ""}
                value={getValues("direccion")}
                placeholder="Buscar dirección..."
                {...register("direccion")}
              />
              {errors.direccion && (
                <p className="text-danger">{errors.direccion.message}</p>
              )}
              {errors.latitud && (
                <p className="text-danger">{errors.latitud.message}</p>
              )}
              {errors.longitud && (
                <p className="text-danger">{errors.longitud.message}</p>
              )}
              <button type="submit" id="submitArb" className="text-black">
                Registrar
              </button>
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
        <div className="canchas-group quitarScroll">
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
              <div className="input-group grupo bg-light" key={index}>
                <TextField
                  className="txtAr canchaName inputo hide-when"
                  margin="dense"
                  name="nombre"
                  disabled
                  value={`#${index + 1}`}
                />
                <TextField
                  className="txtAr canchaDesc inputo"
                  type="text"
                  label="Descripción"
                  margin="dense"
                  name="correo"
                  required
                  onInput={(e) => handleInputChange(index, e.target.value)}
                />
                <Button
                  className={`butWidth text-white ${
                    index === 0 ? "btn-blue" : "btn-red"
                  }`}
                  onClick={() => {
                    if (index === 0) {
                      setCounter((prev) => prev + 1);
                    } else {
                      handleRemove(index);
                    }
                  }}
                >
                  {index === 0 ? (
                    <i
                      className="fa fa-plus icon"
                      aria-hidden="true"
                      color="white"
                    ></i>
                  ) : (
                    <i
                      className="fa fa-minus icon"
                      aria-hidden="true"
                      color="white"
                    ></i>
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
