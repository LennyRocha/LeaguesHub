import React, { useState } from "react";
import Calendar from "react-calendar";
import Swal from "sweetalert2";

function Admin1() {
  const [date, setDate] = useState(new Date());

  const partidos = [
    { date: new Date(2025, 2, 15), description: "Final de la Copa" },
    { date: new Date(2025, 2, 20), description: "Semifinal Liga" },
    { date: new Date(2025, 2, 25), description: "Amistoso vs Tigres" },
  ];  

  const handleDateChange = (newDate) => {
    setDate(newDate);
    console.log(newDate);

    // Buscar si la fecha seleccionada tiene un partido
    const partido = partidos.find(
      (p) => p.date.toDateString() === newDate.toDateString()
    );

    if (partido) {
      Swal.fire({
        title: "Partido programado",
        text: partido.description,
        icon: "info",
        confirmButtonText: "OK",
      });
    }
  };

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
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      Domingo, 02 de febrero de 2025
                    </div>
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
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      3
                    </div>
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
                      Torneos disputados hoy
                    </div>
                    <div className="row no-gutters align-items-center">
                      <div className="col-auto">
                        <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                          5
                        </div>
                      </div>
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
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      18
                    </div>
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
                <h5 className="m-0 font-weight-bold">Solicitudes de equipos</h5>
              </div>
              <div className="card-body col-solids">

                <div className="solicitud">
                  <div className="rowDiv">
                  <img
                    className="img-fluid"
                    width="50"
                    height="50"
                    src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                    alt="..."
                  />
                  <div className="duenoSolid">
                  <b className="body-small">Francisco Pulido</b>
                  <h5>Equipo: Nombre</h5>
                  </div>
                  </div>
                  <div className="derecha">
                  <button className="aceptButton">Aceptar</button>
                  <button className="rejectButton">Rechazar</button>
                  </div>
                </div>

                <div className="solicitud">
                  <div className="rowDiv">
                  <img
                    className="img-fluid"
                    width="50"
                    height="50"
                    src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                    alt="..."
                  />
                  <div className="duenoSolid">
                  <b className="body-small">Francisco Pulido</b>
                  <h5>Equipo: Nombre</h5>
                  </div>
                  </div>
                  <div className="derecha">
                  <button className="aceptButton">Aceptar</button>
                  <button className="rejectButton">Rechazar</button>
                  </div>
                </div>

                <div className="solicitud">
                  <div className="rowDiv">
                  <img
                    className="img-fluid"
                    width="50"
                    height="50"
                    src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                    alt="..."
                  />
                  <div className="duenoSolid">
                  <b className="body-small">Francisco Pulido</b>
                  <h5>Equipo: Nombre</h5>
                  </div>
                  </div>
                  <div className="derecha">
                  <button className="aceptButton">Aceptar</button>
                  <button className="rejectButton">Rechazar</button>
                  </div>
                </div>

                <div className="solicitud">
                  <div className="rowDiv">
                  <img
                    className="img-fluid"
                    width="50"
                    height="50"
                    src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                    alt="..."
                  />
                  <div className="duenoSolid">
                  <b className="body-small">Francisco Pulido</b>
                  <h5>Equipo: Nombre</h5>
                  </div>
                  </div>
                  <div className="derecha">
                  <button className="aceptButton">Aceptar</button>
                  <button className="rejectButton">Rechazar</button>
                  </div>
                </div>

                <div className="solicitud">
                  <div className="rowDiv">
                  <img
                    className="img-fluid"
                    width="50"
                    height="50"
                    src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                    alt="..."
                  />
                  <div className="duenoSolid">
                  <b className="body-small">Francisco Pulido</b>
                  <h5>Equipo: Nombre</h5>
                  </div>
                  </div>
                  <div className="derecha">
                  <button className="aceptButton">Aceptar</button>
                  <button className="rejectButton">Rechazar</button>
                  </div>
                </div>

                <div className="solicitud">
                  <div className="rowDiv">
                  <img
                    className="img-fluid"
                    width="50"
                    height="50"
                    src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                    alt="..."
                  />
                  <div className="duenoSolid">
                  <b className="body-small">Francisco Pulido</b>
                  <h5>Equipo: Nombre</h5>
                  </div>
                  </div>
                  <div className="derecha">
                  <button className="aceptButton">Aceptar</button>
                  <button className="rejectButton">Rechazar</button>
                  </div>
                </div>

                <div className="solicitud">
                  <div className="rowDiv">
                  <img
                    className="img-fluid"
                    width="50"
                    height="50"
                    src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                    alt="..."
                  />
                  <div className="duenoSolid">
                  <b className="body-small">Francisco Pulido</b>
                  <h5>Equipo: Nombre</h5>
                  </div>
                  </div>
                  <div className="derecha">
                  <button className="aceptButton">Aceptar</button>
                  <button className="rejectButton">Rechazar</button>
                  </div>
                </div>

                <div className="solicitud">
                  <div className="rowDiv">
                  <img
                    className="img-fluid"
                    width="50"
                    height="50"
                    src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                    alt="..."
                  />
                  <div className="duenoSolid">
                  <b className="body-small">Francisco Pulido</b>
                  <h5>Equipo: Nombre</h5>
                  </div>
                  </div>
                  <div className="derecha">
                  <button className="aceptButton">Aceptar</button>
                  <button className="rejectButton">Rechazar</button>
                  </div>
                </div>

              </div>
            </div>
            <div className="card shadow mb-4 col-calendar">
              <div className="card-header py-3">
                <h5 className="m-0 font-weight-bold">Proximos partidos</h5>
              </div>
              <div className="card-body">
                <Calendar
                  onChange={handleDateChange}
                  value={date}
                  className="calendar"
                  minDate={new Date()}
                  showNeighboringMonth={false}
                  tileClassName={({ date }) =>
                    partidos.some(
                      (p) => p.date.toDateString() === date.toDateString()
                    )
                      ? "highlight"
                      : ""
                  }
                />
                <p>
                  Fecha seleccionada:{" "}
                  {date.toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 mb-4">
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h5 className="m-0 font-weight-bold">Dueños de equipos</h5>
              </div>
              <div className="card-body h-100 col-duenos">
                <div className="duenoGrid">

                  <div className="duenoCard">
                    <img
                      className="img-fluid"
                      width="80%"
                      src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                      alt="..."
                    />
                    <h3 className="duenoTeamsName">Fulano</h3>
                    <h5 className="duenoTeamsTitle">X equipos</h5>
                  </div>

                  <div className="duenoCard">
                    <img
                      className="img-fluid"
                      width="80%"
                      src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                      alt="..."
                    />
                    <h3 className="duenoTeamsName">Fulano</h3>
                    <h4 className="duenoTeamsTitle">X equipos</h4>
                  </div>

                  <div className="duenoCard">
                    <img
                      className="img-fluid"
                      width="80%"
                      src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                      alt="..."
                    />
                    <h3 className="duenoTeamsName">Fulano</h3>
                    <h4 className="duenoTeamsTitle">X equipos</h4>
                  </div>

                  <div className="duenoCard">
                    <img
                      className="img-fluid"
                      width="80%"
                      src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                      alt="..."
                    />
                    <h3 className="duenoTeamsName">Fulano</h3>
                    <h4 className="duenoTeamsTitle">X equipos</h4>
                  </div>

                  <div className="duenoCard">
                    <img
                      className="img-fluid"
                      width="80%"
                      src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                      alt="..."
                    />
                    <h3 className="duenoTeamsName">Fulano</h3>
                    <h4 className="duenoTeamsTitle">X equipos</h4>
                  </div>

                  <div className="duenoCard">
                    <img
                      className="img-fluid"
                      width="80%"
                      src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                      alt="..."
                    />
                    <h3 className="duenoTeamsName">Fulano</h3>
                    <h4 className="duenoTeamsTitle">X equipos</h4>
                  </div>

                  <div className="duenoCard">
                    <img
                      className="img-fluid"
                      width="80%"
                      src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                      alt="..."
                    />
                    <h3 className="duenoTeamsName">Fulano</h3>
                    <h4 className="duenoTeamsTitle">X equipos</h4>
                  </div>

                  <div className="duenoCard">
                    <img
                      className="img-fluid"
                      width="80%"
                      src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                      alt="..."
                    />
                    <h3 className="duenoTeamsName">Fulano</h3>
                    <h4 className="duenoTeamsTitle">X equipos</h4>
                  </div>

                  <div className="duenoCard">
                    <img
                      className="img-fluid"
                      width="80%"
                      src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                      alt="..."
                    />
                    <h3 className="duenoTeamsName">Fulano</h3>
                    <h4 className="duenoTeamsTitle">X equipos</h4>
                  </div>

                  <div className="duenoCard">
                    <img
                      className="img-fluid"
                      width="80%"
                      src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                      alt="..."
                    />
                    <h3 className="duenoTeamsName">Fulano</h3>
                    <h4 className="duenoTeamsTitle">X equipos</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Admin1;
