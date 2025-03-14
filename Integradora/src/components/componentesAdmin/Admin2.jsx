import React, { useState, useEffect } from "react";
import "bootstrap";

export default function Admin2({ cambiarComponent }) {
  useEffect(() => {}, []);

  return (
    <div>
      <div className="container-fluid">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h2 className="mb-0">Dueños de equipos</h2>
        </div>
        <div className="myDuenoGrid">
          <div className="dueno-container bg-light">
            <div className="dueno-head-row">
              <div className="_row">
                <img
                  className="img_dueno"
                  src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                  alt="..."
                />
                <h5>Nombre</h5>
              </div>
              <a className="link">
                <p>Inhabilitar</p>
              </a>
            </div>
            <div className="divider"></div>
            <div className="mini-grid">
              <div className="para_alla">
                <p>Status</p>
                <p>Correo electrónico</p>
                <p>¿Tiene adeudos?</p>
                <p>Equipos</p>
              </div>
              <div className="para_aca">
                <p>Activo</p>
                <p>dueno@example.com</p>
                <p>N/A</p>
                <p>3</p>
              </div>
            </div>
            <a className="link" onClick={() => cambiarComponent("dueno")}>
              Ver equipos
            </a>
          </div>

          <div className="dueno-container bg-light">
            <div className="dueno-head-row">
              <div className="_row">
                <img
                  className="img_dueno"
                  src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                  alt="..."
                />
                <h5>Nombre</h5>
              </div>
              <a className="link">
                <p>Inhabilitar</p>
              </a>
            </div>
            <div className="divider"></div>
            <div className="mini-grid">
              <div className="para_alla">
                <p>Status</p>
                <p>Correo electrónico</p>
                <p>¿Tiene adeudos?</p>
                <p>Equipos</p>
              </div>
              <div className="para_aca">
                <p>Activo</p>
                <p>dueno@example.com</p>
                <p>N/A</p>
                <p>3</p>
              </div>
            </div>
            <a className="link">Ver equipos</a>
          </div>

          <div className="dueno-container bg-light">
            <div className="dueno-head-row">
              <div className="_row">
                <img
                  className="img_dueno"
                  src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                  alt="..."
                />
                <h5>Nombre</h5>
              </div>
              <a className="link">
                <p>Inhabilitar</p>
              </a>
            </div>
            <div className="divider"></div>
            <div className="mini-grid">
              <div className="para_alla">
                <p>Status</p>
                <p>¿Tiene adeudos?</p>
                <p>Equipos</p>
              </div>
              <div className="para_aca">
                <p>Activo</p>
                <p>dueno@example.com</p>
                <p>N/A</p>
                <p>3</p>
              </div>
            </div>
            <a className="link">Ver equipos</a>
          </div>

          <div className="dueno-container bg-light">
            <div className="dueno-head-row">
              <div className="_row">
                <img
                  className="img_dueno"
                  src="https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                  alt="..."
                />
                <h5>Nombre</h5>
              </div>
              <a className="link">
                <p>Inhabilitar</p>
              </a>
            </div>
            <div className="divider"></div>
            <div className="mini-grid">
              <div className="para_alla">
                <p>Status</p>
                <p>Correo electrónico</p>
                <p>¿Tiene adeudos?</p>
                <p>Equipos</p>
              </div>
              <div className="para_aca">
                <p>Activo</p>
                <p>dueno@example.com</p>
                <p>Si</p>
                <p>3</p>
              </div>
            </div>
            <a className="link">Ver equipos</a>
          </div>
        </div>
        <br />
        <div className="ml-md-5 ml-sm-3 ml-xs-5 align-items-center justify-content-between mb-4 note-p">
        <p><b>NOTA:</b> En caso de tener adeudos, consulte el menú de pagos para mas información</p>
        </div>
      </div>
    </div>
  );
}
