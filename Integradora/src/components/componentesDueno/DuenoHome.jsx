import React from "react";
import "bootstrap";
import '../../css/sb-admin-2.css'

export default function DuenoHome({ cambiarComponente }) {
  return (
    <div>
      DuenoHome
      <button onClick={() => cambiarComponente("B")}>
        Ir al otro componente
      </button>
      <div className="container-fluid">
        <div className="row">
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-primary shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1 card-text">
                      Próximo partido
                    </div>
                    {/* 
                    {load1 ? (
                      <div className="my-spinner blue-spinner"></div>
                    ) : (
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {fechaReciente}
                      </div>
                    )} */}
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      Nunca
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
                    {/* {load2 ? (
                      <div className="my-spinner green-spinner"></div>
                    ) : (
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {totPagos}
                      </div>
                    )} */}
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      2
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
                      Torneos en espera
                    </div>
                    <div className="row no-gutters align-items-center">
                      {/* {load4 ? (
                        <div className="my-spinner red-spinner"></div>
                      ) : (
                        <div className="col-auto">
                          <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                            {torEspera}
                          </div>
                        </div>
                      )} */}
                      <div className="col-auto">
                        <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                          0
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
                      0
                    </div>
                    {/* {load4 ? (
                      <div className="my-spinner yellow-spinner"></div>
                    ) : (
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {solicitudes.length}
                      </div>
                    )} */}
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-bell fa-2x text-gray-300"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
