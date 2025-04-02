import React from "react";
import { Edit, Delete, Map, FilterList } from "@mui/icons-material";

export default function DuenoHistorial({ cambiarComponente }) {
  return (
    <div>
      <div className="d-flex flex-row align-items-center justify-content-left g-2 mb-4 container-fluid">
        <h2 className="mb-0">Historial de pagos</h2>
      </div>
      <div className="d-flex flex-row container-fluid align-items-center justify-content-start gap-2">
        <FilterList fontSize="large" />
        <h5 className="mb-0">Filtrar por</h5>
        <select name="fecha" id="">
          <option value="">Por fecha</option>
        </select>
        <select name="tipo" id="">
          <option value="">Tipo de pago</option>
          <option value="cancha">Cancha</option>
          <option value="arbitraje">Arbitraje</option>
          <option value="inscripcion">Inscripción</option>
        </select>
        <select name="equipo" id="">
          <option value="">Por equipo</option>
        </select>
      </div>
      <br />
      <div className="container-fluid">
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-center my-3">
          <div className="w-75 bg-light rounded p-3">
            <p className="px-2 py-1 align-content-center d-flex mb-0">
              Separador
            </p>
            <hr className="bg-dark mx-1 my-1" />

            <div className="row py-2 justify-content-center align-items-center">
              <div className="col-lg-2 col-md-3 d-flex justify-content-center align-items-center m-0 mb-1">
                <img
                  src="https://th.bing.com/th/id/OIP.ABzYBv5Vq5z4oXr9m_hIhAHaHa?rs=1&pid=ImgDetMain"
                  alt="Logo torneo"
                  className="img-fluid histCard"
                />
              </div>
              <div className="col-lg-10 col-md-9">
                <div className="row align-items-center">
                  <div className="col-12 col-md-8 text-center text-md-left">
                    <h4>Nombre del torneo</h4>
                    <h5>Nombre del equipo</h5>
                    <h6>Tipo de pago</h6>
                    <p>Descripción del pago</p>
                  </div>
                  <div className="col-12 col-md-4 d-flex justify-content-center">
                    <button className="slide-btn-sm text-black">
                      Ver
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <hr className="bg-success mx-1 my-1" />

          </div>
        </div>
      </div>

    </div>
  );
}
