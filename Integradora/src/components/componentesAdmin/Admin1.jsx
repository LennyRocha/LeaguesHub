import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import Calendar from "react-calendar";
import Swal from "sweetalert2";
import axios from "axios";

function Admin1() {
  const [date, setDate] = useState(new Date());

  const { getUserId, getUserRole, getToken, logout, api_url, getUrl } =
    useContext(AuthContext);

  const handleDateChange = (newDate) => {
    setDate(newDate);

    // Convertir la fecha seleccionada a 'YYYY-MM-DD' en zona horaria local
    const formattedNewDate = newDate.toLocaleDateString("sv-SE"); // Formato sueco (ISO-compatible)

    console.log("Fecha seleccionada:", formattedNewDate);

    // Buscar los partidos para la fecha seleccionada
    const partidosDelDia = partidos.filter(
      (p) => p.fechaPartido === formattedNewDate
    );

    console.log(partidosDelDia);

    if (partidosDelDia.length > 0) {
      console.log("Partidos del día:", partidosDelDia);

      Swal.fire({
        title: `Partidos programados el ${formattedNewDate}`,
        html: `
          <div id='swalUi' style=" overflow-y: auto; padding: 0;">
            ${partidosDelDia
              .map(
                (p) => `
                <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #ddd;">
                  <div>
                    <strong>${p.torneo.nombreTorneo}</strong>
                  </div>
                  <div style="display: flex; align-items: center; gap: 10px; width: 100%; justify-content: center;">
                    <div style="text-align: center;">
                      <img
                        src="${getUrl(p.equipoLocal.logo)}"
                        alt="Local"
                        width="40"
                        height="40"
                        style="border-radius: 50%;"
                      />
                      <p>${p.equipoLocal.nombreEquipo}</p>
                    </div>
                    <div style="display: flex; align-items: center;">
                      <h6 style="margin: 0;">${p.hora}</h6>
                    </div>
                    <div style="text-align: center;">
                      <img
                        src="${getUrl(p.equipoVisitante.logo)}"
                        alt="Visitante"
                        width="40"
                        height="40"
                        style="border-radius: 50%;"
                      />
                      <p>${p.equipoVisitante.nombreEquipo}</p>
                    </div>
                  </div>
                </div>
              `
              )
              .join("")}
          </div>
        `,
        icon: "info",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "btn-confirm",
          cancelButton: "btn-cancel",
          denyButton: "btn-deny",
        },
      });
    } else {
      console.log("No hay partidos para esta fecha");
    }
  };

  const [progress, setProgress] = useState(0.25);
  const [modalSolid, setModalSolid] = useState(false);
  const [modalPartid, setModalPartid] = useState(false);
  const [torName, setTorName] = useState("");
  const [partidos, setPartidos] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [partido, setPartido] = useState([]);
  const [day, setDay] = useState("");

  const [load1, setLoad1] = useState(false);
  const [load2, setLoad2] = useState(false);
  const [load3, setLoad3] = useState(false);
  const [load4, setLoad4] = useState(false);

  const increaseProgress = () => {
    setProgress((prev) => (prev < 1 ? prev + 0.1 : 1)); // Aumentar 10% cada vez
  };

  const [respuesta, setRespuesta] = useState("");
  const [respuestas, setRespuestas] = useState({});

  const [solicitudes, setSolicitudes] = useState([]);
  const [loadSolids, setLoadSolids] = useState(false);
  const [fallo, setFallo] = useState("");
  const [tokData, setTokData] = useState("");

  const [equipos, setEquipos] = useState([]);
  const [loadEqu, setLoadEqu] = useState(false);
  const [fallo2, setFallo2] = useState("");

  const [torEspera, setTorEspera] = useState(0);
  const [totPagos, setTotPagos] = useState(0);
  const [fechaReciente, setFechaReciente] = useState(
    "No hay partidos cercanos"
  );

  const [torneos, setTorneos] = useState([]);
  const [loadPartidos, setLoadPartidos] = useState(false);
  const [falloPart, setFalloPart] = useState(false);

  useEffect(() => {
    setRespuesta("");
    const getUserAll = async () => {
      const id = await getUserRole();
      const rolo = await getUserId();
      const tok = await getToken();
      setTokData(tok);
      setLoadSolids(true);
      axios
        .get(`${api_url}/api/solicitudes/admin/pendientes`, {
          headers: {
            Authorization: `Bearer ${tok}`,
          },
        })
        .then((res) => {
          if (res.data.length === 0) setFallo("No hay solicitudes pendientes");
          else setSolicitudes(res.data);
        })
        .catch((e) => {
          console.error(e, e.res.message);
          if (err.response.status === 403) {
            console.log("⚠️ Token expirado, redirigiendo a login...");
            Alert.alert(
              "Sesión expirada",
              "Por favor, inicia sesión nuevamente."
            );
            logout();
            return;
          }
          if (e.res.message) setFallo(e.res.message);
          else setFallo("Error al obtener solicitudes");
        })
        .finally(() => setLoadSolids(false));

      setLoadPartidos(true);
      axios
        .get(`${api_url}/api/partidos/todos`)
        .then((res) => {
          setPartidos(res.data);
          const newMarkedDates = res.data.reduce((acc, partido) => {
            const formattedFechaPartido = new Date(partido.fechaPartido)
              .toISOString()
              .split("T")[0]; // 'YYYY-MM-DD'

            if (!acc[formattedFechaPartido]) {
              acc[formattedFechaPartido] = {
                selected: true,
                selectedColor: "green",
              };
            }
            return acc;
          }, {});

          setMarkedDates(newMarkedDates);
        })
        .catch((err) => {
          console.error(err);
          alert("Hubo un error al cargar los partidos, inténtalo nuevamente");
        })
        .finally(() => setLoadPartidos(false));

      axios
        .get(`${api_url}/api/torneos`)
        .then((res) => {
          setTorneos(res.data);
        })
        .catch((e) => {
          console.error(e, e.res.message);
          if (err.response.status === 403) {
            console.log("⚠️ Token expirado, redirigiendo a login...");
            Alert.alert(
              "Sesión expirada",
              "Por favor, inicia sesión nuevamente."
            );
            logout();
            return;
          }
        });

      axios
        .get(`${api_url}/api/pagos/admin/contarpendientes`, {
          headers: {
            Authorization: `Bearer ${tok}`,
          },
        })
        .then((res) => {
          if (res.data.length === "") setTotPagos(0);
          else setTotPagos(res.data);
        })
        .catch((e) => {
          console.error(e, e.res.message);
          if (err.response.status === 403) {
            console.log("⚠️ Token expirado, redirigiendo a login...");
            Alert.alert(
              "Sesión expirada",
              "Por favor, inicia sesión nuevamente."
            );
            logout();
            return;
          }
          setTotPagos(0);
        })
        .finally(() => {
          setLoad2(false);
          setLoad3(false);
        });
    };
    getUserAll();

    setLoad1(true);
    setLoad2(true);
    setLoad3(true);
    setLoad4(true);
    setLoadEqu(true);
    axios
      .get(`${api_url}/api/equipos`)
      .then((res) => {
        if (res.data.length === 0)
          setFallo("No hay equipos registrados todavía");
        else setEquipos(res.data);
      })
      .catch((e) => {
        console.error(e, e.res.message);
        if (err.response.status === 403) {
          console.log("⚠️ Token expirado, redirigiendo a login...");
          Alert.alert(
            "Sesión expirada",
            "Por favor, inicia sesión nuevamente."
          );
          logout();
          return;
        }
        if (e.res.message) setFallo2(e.res.message);
        else setFallo2("Error al obtener equipos");
      })
      .finally(() => setLoadEqu(false));

    axios
      .get(`${api_url}/api/torneos/espera`)
      .then((res) => {
        if (res.data.length === 0) setTorEspera(0);
        else setTorEspera(res.data.length);
      })
      .catch((e) => {
        console.error(e, e.res.message);
        if (err.response.status === 403) {
          console.log("⚠️ Token expirado, redirigiendo a login...");
          Alert.alert(
            "Sesión expirada",
            "Por favor, inicia sesión nuevamente."
          );
          logout();
          return;
        }
        setTorEspera(0);
      })
      .finally(() => {
        setLoad4(false);
      });

    axios
      .get(`${api_url}/api/partidos/todos/masproximo`)
      .then((res) => {
        if (res.data === "") setFechaReciente("No hay partidos próximos");
        else setFechaReciente(res.data);
      })
      .catch((e) => {
        console.error(e, e.res.message);
        if (err.response.status === 403) {
          console.log("⚠️ Token expirado, redirigiendo a login...");
          Alert.alert(
            "Sesión expirada",
            "Por favor, inicia sesión nuevamente."
          );
          logout();
          return;
        }
        setFechaReciente("No disponible");
      })
      .finally(() => {
        setLoad1(false);
      });
  }, []);

  const rechazarSolid = async (id) => {
    await axios
      .put(
        `${api_url}/api/solicitudes/${id}/rechazar`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tokData}`,
          },
        }
      )
      .then((res) => {
        setRespuestas((prev) => ({
          ...prev,
          [id]: "Solicitud rechazada",
        }));
      })
      .catch((error) => {
        console.error(error, error.response);
        if (error.response?.status === 403) {
          console.log("⚠️ Token expirado, redirigiendo a login...");
          Alert.alert(
            "Sesión expirada",
            "Por favor, inicia sesión nuevamente."
          );
          logout();
          return;
        }
        setRespuestas((prev) => ({
          ...prev,
          [id]: "Error al rechazar la solicitud",
        }));
      });
  };

  const aceptarSolid = async (id) => {
    await axios
      .put(
        `${api_url}/api/solicitudes/${id}/aceptar`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tokData}`,
          },
        }
      )
      .then((res) => {
        setRespuestas((prev) => ({
          ...prev,
          [id]: "Solicitud aceptada",
        }));
        Alert.alert("Éxito", res.data);
      })
      .catch((error) => {
        console.error(error, error.response?.data?.message);
        Alert.alert(
          "Denegado",
          error.response?.data?.message || "Error desconocido"
        );
        setRespuestas((prev) => ({
          ...prev,
          [id]: "Error al aceptar la solicitud",
        }));
      });
  };

  function getTorneoLogo(id) {
    const torneo = torneos.find((tor) => tor.id === id);
    if (torneo) {
      return getUrl(torneo.logoTorneo);
    } else {
      return "https://th.bing.com/th/id/OIP.vxFF12mSgYf6Cs5z9O2i7QAAAA?rs=1&pid=ImgDetMain"; // Imagen de respaldo
    }
  }

  return (
    <>
      {/* Main Content */}
      <div className="container-fluid">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h2 className="mb-0">Inicio</h2>
        </div>

        <div className="row">
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-primary shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 card-text">
                      Próximo partido
                    </div>
                    {load1 ? (
                      <div className="my-spinner blue-spinner"></div>
                    ) : (
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {fechaReciente}
                      </div>
                    )}
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-calendar fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-success shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1 card-text">
                      Pagos pendientes
                    </div>
                    {load2 ? (
                      <div className="my-spinner green-spinner"></div>
                    ) : (
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {totPagos}
                      </div>
                    )}
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-wallet fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-danger shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-danger text-uppercase mb-1 card-text">
                      Torneos en espera
                    </div>
                    <div className="row no-gutters align-items-center">
                      {load4 ? (
                        <div className="my-spinner red-spinner"></div>
                      ) : (
                        <div className="col-auto">
                          <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                            {torEspera}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-trophy fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-warning shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1 card-text">
                      Solicitudes pendientes
                    </div>
                    {load4 ? (
                      <div className="my-spinner yellow-spinner"></div>
                    ) : (
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {solicitudes.length}
                      </div>
                    )}
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-bell fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6 mb-4">
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h5 className="m-0 font-weight-bold ml-3">
                  Solicitudes de equipos
                </h5>
              </div>
              <div className="card-body col-solids">
                {loadSolids ? (
                  <div className="centered-div">
                    <div className="my-spinner"></div>
                  </div>
                ) : fallo === "" ? (
                  solicitudes.map((s) => {
                    return (
                      <div className="solicitud" key={s.id}>
                        <div className="rowDiv">
                          <img
                            className="img-fluid"
                            width="50"
                            height="50"
                            src={getTorneoLogo(s.idTorneo)}
                            alt="Logo del torneo"
                          />
                          <div className="duenoSolid">
                            <b className="body-small"> {s.nombreEquipo}</b>
                            <h5 className="m-0 ml-2">
                              Toneo: {s.nombreTorneo}
                            </h5>
                          </div>
                        </div>
                        {!respuestas[s.id] ? (
                          <div className="derecha">
                            <button
                              className="aceptButton"
                              onClick={async () => aceptarSolid(s.id)}
                            >
                              Aceptar
                            </button>
                            <button
                              className="rejectButton"
                              onClick={async () => rechazarSolid(s.id)}
                            >
                              Rechazar
                            </button>
                          </div>
                        ) : (
                          <div className="derecha">
                            <h5 id="confirm">{respuestas[s.id]}</h5>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <h4 className="falloMess">{fallo}</h4>
                )}
              </div>
            </div>
            <div className="card shadow mb-4 col-calendar">
              <div className="card-header py-3">
                <h5 className="m-0 font-weight-bold ml-3">Proximos partidos</h5>
              </div>
              <div className="card-body">
                {loadPartidos ? (
                  <div className="centered-div">
                    <div className="my-spinner"></div>
                  </div>
                ) : (
                  <Calendar
                    onChange={handleDateChange}
                    value={date}
                    className="calendar"
                    minDate={new Date()} // Asegura que no se puedan seleccionar fechas pasadas
                    showNeighboringMonth={false} // No mostrar días del mes anterior o siguiente
                    tileClassName={({ date }) => {
                      const dateString = date.toISOString().split("T")[0]; // 'YYYY-MM-DD'
                      const todayString = new Date()
                        .toISOString()
                        .split("T")[0]; // Fecha de hoy

                      if (dateString === todayString) {
                        return "today-highlight"; // Clase especial para el día actual
                      }

                      return markedDates[dateString] ? "highlight" : "";
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-6 mb-4">
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h5 className="m-0 font-weight-bold ml-3">
                  Equipos registrados
                </h5>
              </div>
              <div className="card-body h-100 col-duenos">
                {loadEqu ? (
                  <div className="centered-div">
                    <div className="my-spinner"></div>
                  </div>
                ) : fallo2 === "" ? (
                  <div className="duenoGrid">
                    {equipos.map((e) => (
                      <div className="duenoCard" key={e.id}>
                        <img
                          className="img-fluid"
                          width="80%"
                          src={getUrl(e.logoEquipo)}
                          alt={e.nombreEquipo}
                        />
                        <h4 className="duenoTeamsName">{e.nombreEquipo}</h4>
                        <h5 className="duenoTeamsTitle">Ver jugadores</h5>
                      </div>
                    ))}
                  </div>
                ) : (
                  <h4 className="falloMess">{fallo2}</h4>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Admin1;
