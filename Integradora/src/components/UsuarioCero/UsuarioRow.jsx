import React, { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import MiniLoadingScreen from "../MiniLoadingScreen";
import "../../css/usuario.css";
import "bootstrap";

export default function UsuarioRow({ getUrl, api }) {
  const [teams, setTeams] = useState([]);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(true);
    axios
      .get(`${api}/api/equipos`)
      .then((res) => {
        if (res.data.length === 0)
          console.log("No hay equipos registrados todavía");
        else setTeams(res.data);
      })
      .catch((e) => {
        console.error(e, e.response.message);
      })
      .finally(() => setLoad(false));
  }, []);

  const [touchedIndex, setTouchedIndex] = useState(null);

  const handleTouch = (index) => {
    setTouchedIndex(index);
    setTimeout(() => {
      setTouchedIndex(null);
    }, 2000); // Cierra después de 2 segundos
  };

  return (
    <div className="rowTeams" id="inicio">
      {load ? (
        <MiniLoadingScreen />
      ) : (
        teams.map((e, index) => (
          <div key={e.id}>
            <Tooltip
              title={e.nombreEquipo}
              open={touchedIndex === index}
              disableFocusListener
              disableHoverListener
              disableTouchListener
            >
              <img
                src={getUrl(e.logoEquipo)}
                alt={e.nombreEquipo}
                width={40}
                height={40}
                className="half-round"
                onTouchStart={() => handleTouch(index)} // para móviles
                onMouseEnter={() => setTouchedIndex(index)} // para escritorio
                onMouseLeave={() => setTouchedIndex(null)} // para escritorio
              />
            </Tooltip>
          </div>
        ))
      )}
    </div>
  );
}
