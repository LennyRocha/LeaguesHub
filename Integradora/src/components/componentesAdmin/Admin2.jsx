import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "bootstrap";
import axios from "axios";

export default function Admin2({ cambiarComponent }) {
  const [duenos, setDuenos] = useState([]);
  const [loadDuenos, setLoadDuenos] = useState(false);
  const [falloD, setFalloD] = useState("");

  const { getUserId, getUserRole, getToken, getUrl, api_url } =
    useContext(AuthContext);
  const [tokData, setTokData] = useState("");

  function sendData(data) {
    const team = data;
    navigation.navigate("Ver equipo", { team });
  }

  useEffect(() => {
    const getDuenos = async () => {
      const id = await getUserRole();
      const rolo = await getUserId();
      const tok = await getToken();
      setTokData(tok);

      setLoadDuenos(true);
      axios
        .get(`${api_url}/api/duenos`, {
          headers: {
            Authorization: `Bearer ${tok}`,
          },
        })
        .then((res) => {
          if (res.data.length === 0) setFalloD("No hay dueños registrados");
          else setDuenos(res.data);
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
          if (e.res.message) setFalloD(e.res.message);
          else setFalloD("Error al obtener dueños");
        })
        .finally(() => setLoadDuenos(false));
    };
    getDuenos();
  }, []);

  return (
    <div>
      <div className="container-fluid">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h2 className="mb-0">Dueños de equipos</h2>
        </div>
        <div className="gridNest quitarScroll">
          <div className="myDuenoGrid">
            {loadDuenos ? (
              <div className="centered-div">
                <div className="my-spinner"></div>
              </div>
            ) : falloD === "" ? (
              duenos.map((d) => {
                return (
                  <div className="dueno-container bg-light" key={d.id}>
                    <div className="dueno-head-row">
                      <div className="_row">
                        <img
                          className="img_dueno"
                          src={getUrl(d.imagenUrl)}
                          alt={d.nombreCompleto}
                        />
                        <h5>{d.nombreCompleto}</h5>
                      </div>
                      <a className="link">
                        <p>Inhabilitar</p>
                      </a>
                    </div>
                    <div className="divider"></div>
                    <div className="mini-grid">
                      <div className="para_alla">
                        <p>Status</p>
                        <p>Correo</p>
                        <p>Equipos</p>
                      </div>
                      <div className="para_aca">
                        <p>{d.usuario.estatus ? "Activo" : "Inactivo"}</p>
                        <p>{d.usuario.email}</p>
                        <p>3</p>
                      </div>
                    </div>
                    <a
                      className="link"
                      onClick={() => cambiarComponent("dueno")}
                    >
                      Ver equipos
                    </a>
                  </div>
                );
              })
            ) : (
              <div className="derecha">
                <h5 id="confirm">{falloD}</h5>
              </div>
            )}
          </div>
        </div>
        <br />
        <div className="ml-md-5 ml-sm-3 ml-xs-5 align-items-center justify-content-between mb-4 note-p">
          <p>
            <b>NOTA:</b> En caso de tener adeudos, consulte el menú de pagos
            para mas información
          </p>
        </div>
      </div>
    </div>
  );
}
