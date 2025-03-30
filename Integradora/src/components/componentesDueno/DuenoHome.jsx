import React from "react";
import "bootstrap";

export default function DuenoHome({ cambiarComponente }) {
  return (
    <div className="mt-0">
      <div className="container-fluid duenoBox quitarScroll">
        <div className="d-sm-flex align-items-center justify-content-between mb-2">
          <h2 className="mb-0 h2-bold">Menú principal</h2>
        </div>
        <div className="row">
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-primary shadow h-100 py-2">
              <div className="_col">
                <lord-icon
                  src="/icons/cheque.json"
                  trigger="loop"
                  stroke="bold"
                  state="hover-pinch"
                  colors="primary:#333333,secondary:#9A0000"
                  style={{ width: "5em", height: "5em" }}
                ></lord-icon>
                <div className="font-weight-bold text-uppercase text-lg text-center">
                  <a className="link" onClick={() => cambiarComponente('D')}>Mis pagos</a>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-success shadow h-100 py-2">
              <div className="_col">
                <lord-icon
                  src="/icons/jugador.json"
                  trigger="loop"
                  stroke="bold"
                  state="hover-jump"
                  colors="primary:#333333,secondary:#9A0000"
                  style={{ width: "5em", height: "5em" }}
                ></lord-icon>
                <div className="font-weight-bold text-uppercase text-lg text-center">
                  <a className="link">Descargar credenciales</a>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-danger shadow h-100 py-1">
              <div className="">
                <div className="_col">
                  <lord-icon
                    src="https://cdn.lordicon.com/lewtedlh.json"
                    trigger="loop"
                    stroke="bold"
                    state="hover-jump"
                    colors="primary:#3333333,secondary:#9A0000"
                    style={{ width: "5em", height: "5em" }}
                  ></lord-icon>
                  <div className="font-weight-bold text-uppercase mb-1 text-lg">
                    <a className="link" onClick={() => cambiarComponente('B')}>Mis equipos</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-warning shadow h-100 py-2">
              <div className="_col">
                <lord-icon
                  src="/icons/book.json"
                  trigger="loop"
                  stroke="bold"
                  state="hover-flutter"
                  colors="primary:#333333,secondary:#9A0000"
                  style={{ width: "5em", height: "5em" }}
                ></lord-icon>
                <div className="font-weight-bold text-uppercase text-lg text-center">
                  <a className="link" onClick={() => cambiarComponente('E')}>Historial de pagos</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-mai">
          <div className="row mb-4 align-items-center justify-content-center">
            <div className="w-80">
              <div className="row g-0 p-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm position-relative bg-light">
                <div className="col-auto d-none p-0 d-lg-block">
                  <img
                    src="https://www.meme-arsenal.com/memes/a513f913ef43476bd2b494da4e599cbc.jpg"
                    alt="Convocatoria"
                    width={250}
                    height={"100%"}
                  />
                </div>
                <br></br>
                <div className="col gapo p-4 position-static p-2">
                  <strong className="d-inline-block mb-2 text-primary">
                    Convocatoria disponible
                  </strong>
                  <div className="container-fluid">
                    <h4 className="w-100">Nombre convocatoria</h4>
                  </div>
                  <div className="container-lg">
                    <p className="w-90 text-black">
                      <strong>Tu equipo:</strong> Tienes suficientes jugadores
                      para participar
                    </p>
                    <p className="w-90 text-black">
                      <strong>Premio:</strong> Chingos de billetes
                    </p>
                    <p className="w-90 text-black">
                      <strong>Cupo disponible:</strong> 2 lugares
                    </p>
                  </div>
                  <div
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert"
                  >
                    <strong>Fecha límite de inscripción</strong> 20/12/2025
                  </div>
                  <a className="link">Inscribirme</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
