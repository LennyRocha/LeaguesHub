import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

export default function Admin2({ cambiarComponent, setDueno }) {
  const [duenos, setDuenos] = useState([]);
  const [loadDuenos, setLoadDuenos] = useState(false);
  const [falloD, setFalloD] = useState("");

  const { getUserId, getUserRole, getToken, getUrl, api_url, logout } =
    useContext(AuthContext);
  const [tokData, setTokData] = useState("");

  const [reload, setReload] = useState(false);

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
          console.error(e, e.response.message);
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
          if (e.res.message) setFalloD(e.res.message);
          else setFalloD("Error al obtener dueños");
        })
        .finally(() => setLoadDuenos(false));
    };
    getDuenos();
  }, [reload]);

  const [load, setLoad] = useState(false);
  const desactivarDueño = async (id, name) => {
    console.log(id);
    setLoad(true);
    try {
      const tokData = await getToken();
      const res = await axios.put(
        `${api_url}/api/duenos/estatus/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tokData}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Registro exitoso:", res.data);
      Swal.fire({
        icon: "success",
        title: "¡Exito!",
        text: res.data || "Operación exitosa",
        confirmButtonText: "Aceptar",
        customClass: {
          confirmButton: "btn-confirm",
          cancelButton: "btn-cancel",
          denyButton: "btn-deny",
        },
      });
      setReload(!reload);
    } catch (err) {
      console.error(err);
      if (err.response.status === 400) {
        console.log(err.response.data.message);
        Swal.fire({
          icon: "error",
          title: "¡Fallo!",
          text:
            err.response?.data?.message || `No se pudo deshabilitar a ${name}`,
          confirmButtonText: "Aceptar",
          customClass: {
            confirmButton: "btn-confirm",
            cancelButton: "btn-cancel",
            denyButton: "btn-deny",
          },
        });
        return;
      }
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
      setLoad(false);
    }
  };

  const ITEMS_PER_PAGE = 6; // Número de dueños por página

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(duenos.length / ITEMS_PER_PAGE);

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = duenos.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h2 className="mb-0">Dueños de equipos</h2>
        </div>
        <div className="gridNest quitarScroll">
          <div className="myDuenoGrid">
            {loadDuenos ? (
              <div className="centered-div w-100">
                <div className="my-spinner"></div>
              </div>
            ) : falloD === "" ? (
              currentItems.map((d) => (
                <div
                  className={`dueno-container ${
                    d.usuario.estatus ? "bg-light" : "bg-gray"
                  }`}
                  key={d.id}
                >
                  <div className="dueno-head-row">
                    <div className="_row">
                      <img
                        className="img_dueno"
                        src={getUrl(d.imagenUrl)}
                        alt={d.nombreCompleto}
                      />
                      <h5>{d.nombreCompleto}</h5>
                    </div>
                    {load ? (
                      <div className="my-spinner acent-spinner"></div>
                    ) : (
                      <a
                        className="link"
                        onClick={() => desactivarDueño(d.id, d.nombreCompleto)}
                      >
                        <p>{d.usuario.estatus ? "Desactivar" : "Reactivar"}</p>
                      </a>
                    )}
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
                    onClick={() => {
                      setDueno(d);
                      cambiarComponent("dueno");
                    }}
                  >
                    Ver equipos
                  </a>
                </div>
              ))
            ) : (
              <div className="derecha">
                <h5 id="confirm">{falloD}</h5>
              </div>
            )}
          </div>
        </div>
        <div className="flex-row d-flex align-items-center mt-3 gap-3 justify-content-center">
          <button
            className="p-0 pag-btn"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            <ArrowLeftIcon fontSize="large" />
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            className="p-0 pag-btn"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            <ArrowRightIcon fontSize="large" />
          </button>
        </div>
        <br />
      </div>
    </div>
  );
}
