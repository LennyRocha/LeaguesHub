import React, { useEffect, useRef, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
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
import { Edit, Delete, Map } from "@mui/icons-material";
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
  const [location, setLocation] = useState({
    lat: 18.849136305780387,
    lng: -99.20017382614945,
  }); // CDMX

  const [location2, setLocation2] = useState({
    lat: 18.849136305780387,
    lng: -99.20017382614945,
  }); // CDMX

  const addressInput = useRef(null);

  const data = [
    {
      id: 1,
      name: "The Field",
      dir: "Av sin esquinas s/n",
      canchas: 3,
      lat: 18.852205,
      lon: -99.201187,
    },
    {
      id: 2,
      name: "Deportivo Galaxy",
      dir: "Calle pollo #12",
      canchas: 4,
      lat: 18.852461,
      lon: -99.20014,
    },
    {
      id: 3,
      name: "Campo el rayo",
      dir: "Blvd of broken dreams",
      canchas: 9,
      lat: 18.851852,
      lon: -99.200673,
    },
    {
      id: 4,
      name: "Footbalistica",
      dir: "Calle cuaderno #21",
      canchas: 5,
      lat: 18.851132,
      lon: -99.200403,
    },
    {
      id: 5,
      name: "El Rayo",
      dir: "Av Acatlipa #02",
      canchas: 1,
      lat: 18.85005,
      lon: -99.201182,
    },
    {
      id: 6,
      name: "El campo cascarudo",
      dir: "Calle concha s/n",
      canchas: 5,
      lat: 18.849287,
      lon: -99.201373,
    },
    {
      id: 7,
      name: "Estadio Azteca",
      dir: "México",
      canchas: 1,
      lat: 18.849643,
      lon: -99.200279,
    }, // Ciudad de México
  ];
  const [src, setSrc] = useState(
    `https://www.google.com/maps?q=${location2.lat},${location2.lng}&z=15&output=embed`
  );

  // Función para obtener sugerencias de direcciones
  const handleSearch = async (query) => {
    if (query.length > 2) {
      const res = await axios.get(
        `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${query.toLowerCase()}&in=countryCode:MEX&apiKey=${hereApiKey}`
      );
      setSuggestions(res.data.items);
      setAddress(res.data.items[0].address.label);
    } else {
      setSuggestions([]);
      setAddress("");
    }
  };

  // Función para obtener sugerencias de direcciones
  const handleSearchPlaces = async (query) => {
    setSearch(query);
    if (query.length > 2) {
      try {
        const res = await axios.get(
          `https://discover.search.hereapi.com/v1/discover?q=${query.toLowerCase()}&in=countryCode:MEX&at=${
            location.lat
          },${location.lng}&apikey=${hereApiKey}`
        );
        setSuggestions(res.data.items);
      } catch (error) {
        console.error("Error obteniendo lugares:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
      setAddress("");
    }
  };

  // Función para seleccionar un lugar y obtener coordenadas
  const handleSelect = async (place) => {
    const res = await axios.get(
      `https://geocode.search.hereapi.com/v1/geocode?q=${place.title}&in=countryCode:MEX&apiKey=${hereApiKey}`
    );
    const { lat, lng } = res.data.items[0].position;
    if (res.data.items.length > 0) {
      setAddress(res.data.items[0].address.label);
      addressInput.current = address;
    } else {
      setAddress(" ");
      addressInput.current = address;
    }
    setLocation({ lat, lng });
    setSearch(place.title);
    setSuggestions([]);
    setMarker({ lat, lng }); // 📌 Agregar marcador
    setSrc(`https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://js.api.here.com/v3/3.1/mapsjs-core.js`;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const submitCampo = (e) => {
    e.preventDefault();
    console.log("Guardando campo");
  };

  // 🔹 Función para obtener la dirección de coordenadas
  const getAddress = async (lat, lng) => {
    try {
      const res = await axios.get(
        `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${lng}&apikey=${hereApiKey}`
      );

      if (res.data.items.length > 0) {
        setAddress(res.data.items[0].address.label);
        setSearch(res.data.items[0].title);
      } else {
        setAddress("Dirección no encontrada");
      }

      console.log(res.data.res.data.items[0].address.label);

      setMarker({ lat, lng }); // 📌 Agregar marcador
    } catch (error) {
      console.error("Error obteniendo la dirección:", error);
      setAddress("Error al obtener la dirección");
    }
  };

  // 🔹 Función para manejar clics en el mapa
  const handleMapClick = (event) => {
    console.log(event, "Si");
    const [lat, lng] = event.latLng.split(",").map(Number);
    setLocation2({ lat, lng });
    getAddress(lat, lng);
  };

  //Importado de Native
  const { getUserId, getUserRole, getToken } = useContext(AuthContext);
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
  const [slideAnim] = useState(new Animated.Value(-400));
  const [rows, setRows] = useState(1);
  const [rowsEdit, setRowsEdit] = useState(1);

  const [id, setId] = useState(0);

  const [reload, setReload] = useState(false);

  //esquema para validaciones
  // const campo = yup.object().shape({
  //   id: yup.number(),
  //   nombre: yup.string().required("El nombre es requerido"),
  //   direccion: yup.string().required("La dirección es requerida"),
  //   latitud: yup
  //     .number("No válido")
  //     .typeError("Debe ser un número")
  //     .required("Latitud Requerida"),
  //   longitud: yup
  //     .number("No válido")
  //     .typeError("Debe ser un número")
  //     .required("Longitud Requerida"),
  //   cancha: yup.string().required("Debes registrar al menos 1 cancha"),
  // });

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
    control,
    formState: { errors, isValid },
  } = useForm({
    mode: "onBlur",
  });

  const crearCampo = async (data) => {
    try {
      const res = await api.post(
        `/api/campos`,
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
        Alert.alert("Sesión expirada", "Por favor, inicia sesión nuevamente.");
        logout();
        return;
      }
    }
  };

  const registrarCancha = async (desc, pos, id) => {
    try {
      const res = await api.post(
        `/api/canchas`,
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
        Alert.alert("Sesión expirada", "Por favor, inicia sesión nuevamente.");
        logout();
        return;
      }
    }
  };

  const quitarCancha = async (id) => {
    try {
      const res = await api.put(
        `/api/canchas/estatus/${id}`,
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
        Alert.alert("Sesión expirada", "Por favor, inicia sesión nuevamente.");
        logout();
        return;
      }
    } finally {
      setModalCancha(false);
    }
  };

  const updateCampo = async (data) => {
    console.log(data, "Wey");
    const token = await getToken();
    try {
      const res = await api.put(
        `/api/campos/${data.id || id}`,
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
        Alert.alert("Sesión expirada", "Por favor, inicia sesión nuevamente.");
        logout();
        return;
      }
    }
  };

  const updateCancha = async (desc, pos, id, idCan) => {
    const token = await getToken();
    try {
      const res = await api.put(
        `/api/canchas/${idCan}`,
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
        Alert.alert("Sesión expirada", "Por favor, inicia sesión nuevamente.");
        logout();
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
      api
        .get(`/api/campos/activos`, {
          headers: {
            Authorization: `Bearer ${tok}`,
          },
        })
        .then((res) => {
          if (res.data.length === 0) setFallo1("No hay campos registrados");
          else setCampos(res.data);
        })
        .catch((e) => {
          console.error(e, e.res.message);
          if (e.response.status === 403) {
            console.log("⚠️ Token expirado, redirigiendo a login...");
            Alert.alert(
              "Sesión expirada",
              "Por favor, inicia sesión nuevamente."
            );
            logout();
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

  return (
    <div>
      <div className="container-fluid">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h2 className="mb-0">Menú de campos</h2>
        </div>
      </div>
      <div className="container-fluid table-overflow mb-0">
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
              {data.map((d, index) => {
                return (
                  <TableRow key={d.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{d.name}</TableCell>
                    <TableCell>{d.dir}</TableCell>
                    <TableCell>{d.canchas}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => onEdit(d)}>
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton
                        onClick={() => setLocation({ lat: d.lat, lng: d.lon })}
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
      </div>
      <div className="centered">
        <iframe
          title="HERE Map"
          width="95%"
          height="400"
          className="map-frame map1"
          src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
        />
      </div>
      <div className="row px-2">
        <div className="col-lg-6">
          <iframe
            title="HERE Map"
            width="100%"
            height="400"
            className="map-frame"
            src={src}
            onLoad={(e) => {
              const iframe = e.target;
              iframe.addEventListener("click", handleMapClick);
            }}
          />
          {marker && (
            <p
              style={{
                textAlign: "center",
                fontSize: "14px",
                color: "#9a0000",
                marginTop: "5px",
              }}
            >
              📍 Marcador en: {marker.lat}, {marker.lng}
            </p>
          )}
        </div>
        <div className="col-lg-6">
          <div className="card bg-light shadow p-4 h-100">
            <div className="card-header bg-red container-fluid">
              <p className="font-weight-bold body-small text-white ml-1 tit-campo">
                Registrar campo
              </p>
            </div>
            <form onSubmit={(e) => submitCampo(e)}>
              <TextField
                className="txtAr"
                label="Nombre del campo"
                fullWidth
                margin="dense"
                name="nombre"
                required
                value={search}
                onChange={(e) => handleSearchPlaces(e.target.value)}
                placeholder="Buscar lugar..."
              />
              {Object.keys(suggestions).length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map((place) => (
                    <li key={place.id} onClick={() => handleSelect(place)}>
                      {place.title}
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
                value={address}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar dirección..."
              />
              <button type="submit" id="submitArb" className="text-black">
                Registrar
              </button>
            </form>
          </div>
        </div>
        <div className="container-fluid">
          <div className="d-sm-flex align-items-center justify-content-between mt-4 mb-1">
            <h4 className="mb-0">Asignacion de canchas</h4>
          </div>
        </div>
        <div className="canchas-group">
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
