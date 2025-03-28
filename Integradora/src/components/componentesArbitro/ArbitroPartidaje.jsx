import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import "./ArbitroPartidaje.css";

export default function ArbitroPartidaje({
  cambiarComponente,
  partidoSeleccionado,
}) {
  const { api_url, getToken } = useContext(AuthContext);

  const [jugadoresLocal, setJugadoresLocal] = useState([]);
  const [jugadoresVisitante, setJugadoresVisitante] = useState([]);
  const [estadisticasLocal, setEstadisticasLocal] = useState([]);
  const [estadisticasVisitante, setEstadisticasVisitante] = useState([]);
  const [golesLocal, setGolesLocal] = useState(0);
  const [golesVisitante, setGolesVisitante] = useState(0);
  const [autogolesLocal, setAutogolesLocal] = useState(0);
  const [autogolesVisitante, setAutogolesVisitante] = useState(0);
  const [partidoDefault, setPartidoDefault] = useState(false);
  const [ganadorDefault, setGanadorDefault] = useState("local");

  const transformarUrl = (url) => {
    const match = url.match(/id=([^&]+)/);
    return match ? `https://lh3.googleusercontent.com/d/${match[1]}` : url;
  };

  useEffect(() => {
    const cargarJugadores = async () => {
      try {
        const [resLocal, resVisitante] = await Promise.all([
          axios.get(
            `${api_url}/api/jugadores/porEquipo/filtrados/${partidoSeleccionado.equipoLocal.id}`
          ),
          axios.get(
            `${api_url}/api/jugadores/porEquipo/filtrados/${partidoSeleccionado.equipoVisitante.id}`
          ),
        ]);
        setJugadoresLocal(resLocal.data);
        setJugadoresVisitante(resVisitante.data);
      } catch (err) {
        console.error("Error al cargar jugadores:", err);
      }
    };
    cargarJugadores();
  }, []);

  const manejarCheckbox = (jugador, equipo, activo) => {
    const estadisticas =
      equipo === "local" ? [...estadisticasLocal] : [...estadisticasVisitante];
    const setter =
      equipo === "local" ? setEstadisticasLocal : setEstadisticasVisitante;

    if (activo) {
      estadisticas.push({
        jugadorId: jugador.id,
        goles: 0,
        amarillas: 0,
        rojas: 0,
        comentarioExpulsion: "",
      });
    } else {
      const filtrados = estadisticas.filter((e) => e.jugadorId !== jugador.id);
      setter(filtrados);
      return;
    }
    setter(estadisticas);
  };

  const manejarEstadistica = (jugador, equipo, campo, valor) => {
    const estadisticas =
      equipo === "local" ? [...estadisticasLocal] : [...estadisticasVisitante];
    const setter =
      equipo === "local" ? setEstadisticasLocal : setEstadisticasVisitante;

    const index = estadisticas.findIndex((e) => e.jugadorId === jugador.id);
    if (index !== -1) {
      estadisticas[index][campo] = valor;
      setter(estadisticas);
    }
  };

  const contarCheckbox = (equipo) =>
    equipo === "local"
      ? estadisticasLocal.length
      : estadisticasVisitante.length;

  const sumarGoles = (equipo) => {
    const estadisticas =
      equipo === "local" ? estadisticasLocal : estadisticasVisitante;
    return estadisticas.reduce(
      (acc, val) => acc + (parseInt(val.goles) || 0),
      0
    );
  };

  const registrarResultado = async () => {
    if (!validarAntesDeRegistrar()) return;

    const resultado = {
      golesLocal: partidoDefault
        ? ganadorDefault === "local"
          ? 3
          : 0
        : golesLocal,
      golesVisitante: partidoDefault
        ? ganadorDefault === "visitante"
          ? 3
          : 0
        : golesVisitante,
      autogolesLocal,
      autogolesVisitante,
      estadisticasLocal: partidoDefault
        ? ganadorDefault === "visitante"
          ? []
          : estadisticasLocal.map((e) => ({ ...e, goles: 0 }))
        : estadisticasLocal,
      estadisticasVisitante: partidoDefault
        ? ganadorDefault === "local"
          ? []
          : estadisticasVisitante.map((e) => ({ ...e, goles: 0 }))
        : estadisticasVisitante,
    };

    try {
      await axios.post(
        `${api_url}/api/partidos/arbitro/registraresultado/${partidoSeleccionado.id}`,
        resultado,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      Swal.fire("¡Éxito!", "Resultado registrado correctamente", "success");
      cambiarComponente("A");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "No se pudo registrar",
        "error"
      );
    }
  };

  const validarAntesDeRegistrar = () => {
    if (!partidoDefault) {
      const sumaLocal = sumarGoles("local");
      const sumaVisitante = sumarGoles("visitante");

      if (contarCheckbox("local") < 7 || contarCheckbox("visitante") < 7) {
        Swal.fire(
          "Advertencia",
          "Debes seleccionar al menos 7 jugadores por equipo",
          "warning"
        );
        return false;
      }

      if (golesLocal !== sumaLocal + autogolesVisitante) {
        Swal.fire(
          "Advertencia",
          "Los jugadores del equipo local y autogoles del rival suman " +
            (sumaLocal + autogolesVisitante) +
            " goles y en realidad el equipo marcó " +
            golesLocal,
          "warning"
        );
        return false;
      }

      if (golesVisitante !== sumaVisitante + autogolesLocal) {
        Swal.fire(
          "Advertencia",
          "Los goles del equipo visitante y autogoles del rival suman " +
            (sumaVisitante + autogolesLocal) +
            " goles y en realidad el equipo marcó " +
            golesVisitante,
          "warning"
        );
        return false;
      }
    }

    if (partidoDefault) {
      if (ganadorDefault === "local" && contarCheckbox("local") < 7) {
        Swal.fire(
          "Advertencia",
          "Debes seleccionar al menos 7 jugadores del equipo local que es el ganador por default para registrar la asistencia de sus jugadores",
          "warning"
        );
        return false;
      }
      if (ganadorDefault === "visitante" && contarCheckbox("visitante") < 7) {
        Swal.fire(
          "Advertencia",
          "Debes seleccionar al menos 7 jugadores del equipo visitante que es el ganador por default para registrar la asistencia de sus jugadores",
          "warning"
        );
        return false;
      }
    }
    return true;
  };

  const renderJugadores = (jugadores, equipo) =>
    jugadores.map((j) => {
      const estad = (
        equipo === "local" ? estadisticasLocal : estadisticasVisitante
      ).find((e) => e.jugadorId === j.id);
      const checked = Boolean(estad);

      return (
        <div className="jugador-card" key={j.id}>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => manejarCheckbox(j, equipo, e.target.checked)}
          />
          <img src={transformarUrl(j.fotoJugador)} alt="foto" />
          <span>
            {j.nombreCompleto} - #{j.numeroCamiseta}
          </span>
          {checked && (
            <div className="stats">
              <label>Goles:</label>
              <input
                type="number"
                value={estad.goles}
                onChange={(e) =>
                  manejarEstadistica(
                    j,
                    equipo,
                    "goles",
                    parseInt(e.target.value)
                  )
                }
              />
              <label>Amarillas:</label>
              <select
                value={estad.amarillas}
                onChange={(e) =>
                  manejarEstadistica(
                    j,
                    equipo,
                    "amarillas",
                    parseInt(e.target.value)
                  )
                }
              >
                {[0, 1, 2].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <label>Roja:</label>
              <input
                type="checkbox"
                checked={estad.rojas === 1}
                onChange={(e) =>
                  manejarEstadistica(
                    j,
                    equipo,
                    "rojas",
                    e.target.checked ? 1 : 0
                  )
                }
              />
              {estad.rojas === 1 && (
                <textarea
                  placeholder="Motivo expulsión"
                  value={estad.comentarioExpulsion}
                  onChange={(e) =>
                    manejarEstadistica(
                      j,
                      equipo,
                      "comentarioExpulsion",
                      e.target.value
                    )
                  }
                />
              )}
            </div>
          )}
        </div>
      );
    });

  return (
    <div className="contenedor-partidaje">
      <button className="btn btn-danger" onClick={() => cambiarComponente("A")}>
        ← VOLVER
      </button>
      <h2>Registrar resultado</h2>
      <div className="info-top">
        <img
          src={transformarUrl(partidoSeleccionado.equipoLocal.logo)}
          alt="logo"
        />
        <strong>{partidoSeleccionado.equipoLocal.nombreEquipo}</strong> vs{" "}
        <strong>{partidoSeleccionado.equipoVisitante.nombreEquipo}</strong>
        <img
          src={transformarUrl(partidoSeleccionado.equipoVisitante.logo)}
          alt="logo"
        />
      </div>

      <div className="inputs-header">
        <label>Goles Local:</label>
        <input
          type="number"
          value={golesLocal}
          onChange={(e) => setGolesLocal(Number(e.target.value))}
        />
        <label>Autogoles Local:</label>
        <input
          type="number"
          value={autogolesLocal}
          onChange={(e) => setAutogolesLocal(Number(e.target.value))}
        />
        <label>Goles Visitante:</label>
        <input
          type="number"
          value={golesVisitante}
          onChange={(e) => setGolesVisitante(Number(e.target.value))}
        />
        <label>Autogoles Visitante:</label>
        <input
          type="number"
          value={autogolesVisitante}
          onChange={(e) => setAutogolesVisitante(Number(e.target.value))}
        />
      </div>

      <div className="default-checkbox">
        <input
          type="checkbox"
          checked={partidoDefault}
          onChange={() => setPartidoDefault(!partidoDefault)}
        />
        Partido ganado por default
        {partidoDefault && (
          <select
            value={ganadorDefault}
            onChange={(e) => setGanadorDefault(e.target.value)}
          >
            <option value="local">Ganó Local</option>
            <option value="visitante">Ganó Visitante</option>
          </select>
        )}
      </div>

      <div className="botones-superiores">
        <button className="btn btn-success" onClick={registrarResultado}>
          REGISTRAR
        </button>
        <button
          className="btn btn-danger"
          onClick={() => cambiarComponente("A")}
        >
          CANCELAR
        </button>
      </div>

      <div className="jugadores-contenedor">
        <div>
          <h4>Jugadores {partidoSeleccionado.equipoLocal.nombreEquipo}</h4>
          {renderJugadores(jugadoresLocal, "local")}
        </div>
        <div>
          <h4>Jugadores {partidoSeleccionado.equipoVisitante.nombreEquipo}</h4>
          {renderJugadores(jugadoresVisitante, "visitante")}
        </div>
      </div>
    </div>
  );
}