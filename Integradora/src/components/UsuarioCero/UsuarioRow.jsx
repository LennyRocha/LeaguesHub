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

  return (
    <div className="rowTeams" id="inicio">
      {load ? (
        <MiniLoadingScreen />
      ) : (
        teams.map((e, index) => {
          return (
            <div key={e.id}>
              <Tooltip title={e.nombreEquipo}>
                <img
                  src={getUrl(e.logoEquipo)}
                  alt={e.nombreEquipo}
                  width={40}
                  height={40}
                  className="half-round"
                />
              </Tooltip>
            </div>
          );
        })
      )}
    </div>
  );
}
