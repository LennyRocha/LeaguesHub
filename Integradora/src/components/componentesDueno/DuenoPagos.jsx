import React, { useState } from "react";
import { Tooltip } from "@mui/material";

const equipos = [
  {
    equipoId: 1,
    nombre: "Chivas",
    dt: {
      id: 1,
      nombre: "Juan Peréz",
      correo: "juanperez@hotmail.com",
      img: "https://th.bing.com/th/id/OIP.SVo8-p3WhGOnngP6K6tBsAHaKc?w=115&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    },
    img: "https://drive.google.com/uc?export=view&id=1-FOLUn9u4T-D5ggneCO0nZm4jOOVXItI",
  },
  {
    equipoId: 2,
    nombre: "Cruz Azul",
    dt: {
      id: 2,
      nombre: "Mauro Bahena",
      correo: "maurodfr@hotmail.com",
      img: "https://i.pinimg.com/originals/55/45/e2/5545e27dd7441dc888fa6e4669421bdc.png",
    },
    img: "https://drive.google.com/uc?export=view&id=1L4y6YuAZuIYWEOlWr0sBKmoutcMFyG54",
  },
  {
    equipoId: 3,
    nombre: "Monterrey",
    dt: {
      id: 1,
      nombre: "Nick Fury",
      correo: "vengadores@hotmail.com",
      img: "https://th.bing.com/th/id/OIP.YoIWYEmDFaQof1wx6j8xBQHaKp?w=132&h=190&c=7&pcl=1b1a19&r=0&o=5&dpr=1.5&pid=1.7",
    },
    img: "https://drive.google.com/uc?export=view&id=1L_u5cuRI6pI78YOb-0PIt_vovmV8SLLX",
  },
  {
    equipoId: 4,
    nombre: "Necaxa",
    dt: {
      id: 1,
      nombre: "Don Ramón",
      correo: "mochito@gmail.com",
      img: "https://th.bing.com/th/id/OIP.iox5J2IefKpTqQ3A0PovKwAAAA?rs=1&pid=ImgDetMain",
    },
    img: "https://drive.google.com/uc?export=view&id=1_bDUfg2szuTCPy6onk37wSbzOoZGyhWW",
  },
  {
    equipoId: 5,
    nombre: "Pumas",
    dt: {
      id: 1,
      nombre: "Francisco Pulido",
      correo: "camarapaino@utez.edu.mx",
      img: "https://th.bing.com/th/id/OIP.crgqPqen60BHAPwu_jzyAgHaNK?rs=1&pid=ImgDetMain",
    },
    img: "https://drive.google.com/uc?export=view&id=1IdFsp723ipbBX95PWsXwpURsO5L4jGei",
  },
  {
    equipoId: 6,
    nombre: "America",
    dt: {
      id: 1,
      nombre: "Daniel Aguilar",
      correo: "daniel@aguilar.com",
      img: "https://th.bing.com/th/id/OIP.9Uh0RFprWijPzuoxR2tcBQHaNL?w=115&h=181&c=7&pcl=1b1a19&r=0&o=5&dpr=1.5&pid=1.7",
    },
    img: "https://drive.google.com/uc?export=view&id=1hLeMo386b05HrRd2mruNXZZqlWJ_EbSC",
  },
  {
    equipoId: 7,
    nombre: "Atlas",
    dt: {
      id: 1,
      nombre: "El piojo Herrera",
      correo: "elpiojitoxd@gmail.com",
      img: "https://th.bing.com/th/id/OIP.vEf5l5SjcnsD1mhWGM2uRAAAAA?rs=1&pid=ImgDetMain",
    },
    img: "https://drive.google.com/uc?export=view&id=1yeIzWN8Wl6TvIrEtqci874SU7MT6E8cg",
  },
  {
    equipoId: 8,
    nombre: "Tigres",
    dt: {
      id: 1,
      nombre: "Tigre Toño",
      correo: "grrriquisimas@hotmail.com",
      img: "https://tecolotito.elsiglodetorreon.com.mx/i/2010/05/204363.jpeg",
    },
    img: "https://drive.google.com/uc?export=view&id=1HMF63odQw9WzQdVmfFbSP1H3_F8qY-uV",
  },
];

export default function DuenoPagos({ cambiarComponente }) {
  const [load, setLoad] = useState(false);
  return (
    <div>
      <div className="d-flex flex-row align-items-center justify-content-left g-2 mb-4 container-fluid">
        <h2 className="mb-0">Menú de pagos</h2>
      </div>

      <div className="flex-row gap-5 container-fluid">
        <h5>Pagos por equipo</h5>
        {equipos.map((e) => (
          <span class="badge bg-dark mx-1 p-1">{e.nombre}</span>
        ))}
      </div>

      <div class="row container-fluid my-2">
        <div class="col-md-4 order-md-last">
          <Tooltip title="Solo puedes realizar un pago por equipo">
            <h4 class="d-flex justify-content-between align-items-center mb-3">
              <span class="text-danger">Detalles del pago</span>
            </h4>
          </Tooltip>
          <ul class="list-group mb-3">
            <li class="list-group-item d-flex justify-content-between lh-sm">
              <div>
                <h6 class="my-0">Nombre del equipo</h6>
                <small class="text-muted">a realizar el pago</small>
              </div>
              <span class="text-muted">Chivas</span>
            </li>
            <li class="list-group-item d-flex justify-content-between lh-sm">
              <div>
                <h6 class="my-0">Total de pagos</h6>
                <small class="text-muted">a realizar</small>
              </div>
              <span class="text-muted">2</span>
            </li>
            <li class="list-group-item d-flex justify-content-between lh-sm">
              <div>
                <h6 class="my-0">Fecha de pago</h6>
                <small class="text-muted">a corte de</small>
              </div>
              <span class="text-muted">{new Date().toISOString().substring(0,10)}</span>
            </li>
            {/* <li class="list-group-item d-flex justify-content-between bg-light">
              <div class="text-success">
                <h6 class="my-0">Promo code</h6>
                <small>EXAMPLECODE</small>
              </div>
              <span class="text-success">−$5</span>
            </li> */}
            <li class="list-group-item d-flex justify-content-between">
              <span>Precio total</span>
              <strong>$20</strong>
            </li>
          </ul>

          <button className="slide-btn text-black">Pagar</button>
        </div>
        <div class="col-lg-8 pagos-list quitarScroll">
          <div className="payments-grid">
            {/* */}
            <div className="card border-left-danger shadow h-100 p-0">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-1">
                    <div className="text-xs font-weight-bold text-danger text-uppercase mb-2 card-text">
                      Descripción: .
                      <span className="text-black">
                        Cancha - Chelsea Sub-17 vs Juventus Sub-17
                      </span>
                    </div>
                    <div className="card-grid no-gutters align-items-center">
                      <h6 className="mb-0 mr-3">
                        <b className="text-gray-800">Tipo de pago:</b>
                      </h6>
                      <h6 className="mb-0 mr-3">Cancha</h6>
                      <h6 className="mb-0 mr-3">
                        <b className="text-gray-800">Monto:</b>
                      </h6>
                      <h6 className="mb-0 mr-3">$200</h6>
                      <h6 className="mb-0 mr-3">
                        <b className="text-gray-800">Fecha límite:</b>
                      </h6>
                      <h6 className="mb-0 mr-3">2025-05-07</h6>
                      <h6 className="mb-0 mr-3">
                        <b className="text-gray-800">Estado:</b>
                      </h6>
                      <h6 className="mb-0 mr-3">
                        <span className="text-warning">Pendiente</span>
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* */}
            <div className="card border-left-danger shadow h-100 p-0">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-1">
                    <div className="text-xs font-weight-bold text-danger text-uppercase mb-2 card-text">
                      Descripción: .
                      <span className="text-black">
                        Cancha - Chelsea Sub-17 vs Juventus Sub-17
                      </span>
                    </div>
                    <div className="card-grid no-gutters align-items-center">
                      <h6 className="mb-0 mr-3">
                        <b className="text-gray-800">Tipo de pago:</b>
                      </h6>
                      <h6 className="mb-0 mr-3">Cancha</h6>
                      <h6 className="mb-0 mr-3">
                        <b className="text-gray-800">Monto:</b>
                      </h6>
                      <h6 className="mb-0 mr-3">$200</h6>
                      <h6 className="mb-0 mr-3">
                        <b className="text-gray-800">Fecha límite:</b>
                      </h6>
                      <h6 className="mb-0 mr-3">2025-05-07</h6>
                      <h6 className="mb-0 mr-3">
                        <b className="text-gray-800">Estado:</b>
                      </h6>
                      <h6 className="mb-0 mr-3">
                        <span className="text-warning">Pendiente</span>
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* */}
            <div className="card border-left-danger shadow h-100 p-0">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-1">
                    <div className="text-xs font-weight-bold text-danger text-uppercase mb-2 card-text">
                      Descripción: .
                      <span className="text-black">
                        Cancha - Chelsea Sub-17 vs Juventus Sub-17
                      </span>
                    </div>
                    <div className="card-grid no-gutters align-items-center">
                      <h6 className="mb-0 mr-3">
                        <b className="text-gray-800">Tipo de pago:</b>
                      </h6>
                      <h6 className="mb-0 mr-3">Cancha</h6>
                      <h6 className="mb-0 mr-3">
                        <b className="text-gray-800">Monto:</b>
                      </h6>
                      <h6 className="mb-0 mr-3">$200</h6>
                      <h6 className="mb-0 mr-3">
                        <b className="text-gray-800">Fecha límite:</b>
                      </h6>
                      <h6 className="mb-0 mr-3">2025-05-07</h6>
                      <h6 className="mb-0 mr-3">
                        <b className="text-gray-800">Estado:</b>
                      </h6>
                      <h6 className="mb-0 mr-3">
                        <span className="text-warning">Pendiente</span>
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* */}
            <div className="card border-left-danger shadow h-100 p-0">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-1">
                    <div className="text-xs font-weight-bold text-danger text-uppercase mb-2 card-text">
                      Descripción: .
                      <span className="text-black">
                        Cancha - Chelsea Sub-17 vs Juventus Sub-17
                      </span>
                    </div>
                    <div className="card-grid no-gutters align-items-center">
                      <h6 className="mb-0 mr-3">
                        <b className="text-gray-800">Tipo de pago:</b>
                      </h6>
                      <h6 className="mb-0 mr-3">Cancha</h6>
                      <h6 className="mb-0 mr-3">
                        <b className="text-gray-800">Monto:</b>
                      </h6>
                      <h6 className="mb-0 mr-3">$200</h6>
                      <h6 className="mb-0 mr-3">
                        <b className="text-gray-800">Fecha límite:</b>
                      </h6>
                      <h6 className="mb-0 mr-3">2025-05-07</h6>
                      <h6 className="mb-0 mr-3">
                        <b className="text-gray-800">Estado:</b>
                      </h6>
                      <h6 className="mb-0 mr-3">
                        <span className="text-warning">Pendiente</span>
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* */}
          </div>
        </div>
      </div>
    </div>
  );
}
