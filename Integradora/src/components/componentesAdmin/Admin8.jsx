import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import "bootstrap";

export default function Admin8({ cambiarComponent, dueno, setDueno }) {
  const [visible, setVisible] = useState(false);
  const [equipo, setEquipo] = useState([]);
  useEffect(() => {
    console.log(dueno, dueno.usuario);
  }, []);

  const [teams, setTeams] = useState([]);
  const [loadTeams, setLoadTeams] = useState(false);
  const [players, setPlayers] = useState([]);
  const [loadPlayers, setLoadPlayers] = useState(false);
  const [fallo, setFallo] = useState("");
  const [falloJ, setFalloJ] = useState("");

  const { getUserId, getUserRole, getToken, getUrl, api_url, logout } =
    useContext(AuthContext);
  const [tokData, setTokData] = useState("");

  const [reload, setReload] = useState(false);

  const [nombreTeam, setNombreTeam] = useState("");

  const getJugadores = (id, name) => {
    setVisible(true);
    setLoadPlayers(true);
    axios
      .get(`${api_url}/api/jugadores/porEquipo/${id}`, {})
      .then((res) => {
        if (res.data.length === 0) setFalloJ(`No hay jugadores en ${name}`);
        else setPlayers(res.data);
        setNombreTeam(name);
      })
      .catch((e) => {
        console.error(e, e.response?.message);
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
        if (e.response.message) setFallo(e.response.message);
        else setFallo(`Error al obtener jugadores de ${name}`);
      })
      .finally(() => setLoadPlayers(false));
  };

  useEffect(() => {
    const getDuenoEquipos = async () => {
      const id = await getUserRole();
      const rolo = await getUserId();
      const tok = await getToken();
      setTokData(tok);

      setLoadTeams(true);
      axios
        .get(`${api_url}/api/equipos/porDueno/${dueno.usuario.id}`, {})
        .then((res) => {
          if (res.data.length === 0)
            setFallo(`No hay equipos asociados a ${dueno.nombreCompleto}`);
          else setTeams(res.data);
        })
        .catch((e) => {
          console.error(e, e.response?.message);
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
          if (e.response.message) setFallo(e.response.message);
          else setFallo(`Error al obtener equipos de ${dueno.nombreCompleto}`);
        })
        .finally(() => {
          setLoadTeams(false);
          setVisible(!visible);
        });
    };
    getDuenoEquipos();
  }, [reload]);

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a
              onClick={() => {
                cambiarComponent("home");
                setDueno({});
              }}
              className="link"
            >
              Inicio
            </a>
          </li>
          <li className="breadcrumb-item">
            <a
              onClick={() => {
                cambiarComponent("equipos");
                setDueno({});
              }}
              className="link"
            >
              Dueños
            </a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Equipos
          </li>
        </ol>
      </nav>
      <div className="container-fluid">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h2 className="mb-0">Equipos de {dueno.nombreCompleto}</h2>
        </div>
        <div className="overf-auto">
          {loadTeams ? (
            <div className="w-100 justify-content-center d-flex">
              <div className="my-spinner mt-3"></div>
            </div>
          ) : fallo === "" ? (
            teams.map((e) => {
              return (
                <div className="dueno-container-2 bg-light" key={e.equipoId}>
                  <img
                    src={getUrl(e.logoEquipo)}
                    alt={e.nombreEquipo}
                    className="teamImage"
                  />
                  <h5 className="w-100">{e.nombreEquipo}</h5>
                  <button
                    className="slide-btn-sm text-black"
                    onClick={() => getJugadores(e.id, e.nombreEquipo)}
                  >
                    Ver jugadores
                  </button>
                </div>
              );
            })
          ) : (
            <div className="w-100 justify-content-center d-flex mt-5">
              <h3>{fallo}</h3>
            </div>
          )}
        </div>
        <div className={`${visible ? "teamsVisible" : "teamsInvisible"}`}>
          <div className="d-sm-flex align-items-center justify-content-between mt-4 mb-2 ml-2">
            <h3 className="mb-0">{nombreTeam}</h3>
          </div>
          {loadPlayers ? (
            <div className="w-100 justify-content-center d-flex">
              <div className="my-spinner mt-3"></div>
            </div>
          ) : falloJ === "" ? (
            <div className="players-grid">
              {players.map((j) => {
                console.log(j.expulsado);
                return (
                  <div className="over-card" key={j.id}>
                    <div className="kard">
                      <div className="face card-front">
                        <div
                          className={`front-head ${
                            j.habilitado ? "aktive" : "inactive"
                          }`}
                        >
                          <img
                            src={getUrl(j.fotoJugador)}
                            alt={j.nombreCompleto}
                            className="jugImg"
                          />
                        </div>
                        <h6 className="h_tz f-col text-center px-2 w-75">
                          {j.nombreCompleto}
                        </h6>
                        <div
                          className={`mini-alert ${
                            j.habilitado
                              ? "aktive activeTxt"
                              : "inactive inactiveTxt"
                          }`}
                        >
                          {j.habilitado ? "Activo" : "Inactivo"}
                        </div>
                      </div>
                      <div className="face card-back _col">
                        <h3>Datos</h3>
                        <div className="mini-grid">
                          <div className="para_alla">
                            <p>Partidos</p>
                            <p># camiseta</p>
                            <p>¿Expulsado?</p>
                          </div>
                          <div className="para_aca">
                            <p>{j.partidosJugados}</p>
                            <p>{j.numeroCamiseta}</p>
                            <p>{j.expulsado ? "Si" : "No"}</p>
                          </div>
                        </div>
                        <p className="pb-2 pt-0">{j.fechaNacimiento}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="w-100 justify-content-center d-flex mt-5">
              <h3>{falloJ}</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
