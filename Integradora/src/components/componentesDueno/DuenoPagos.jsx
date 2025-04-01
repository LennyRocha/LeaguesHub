import React, { useState } from "react";

export default function DuenoPagos({ cambiarComponente }) {
  const [load, setLoad] =  useState(false)
  return (
    <div>
      <div className="d-flex flex-row align-items-center justify-content-left g-2 mb-4 container-fluid">
        <h2 className="mb-0">Menú de pagos</h2>
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
                  {load ? (
                    <div className="my-spinner red-spinner"></div>
                  ) : (
                    <div className="col-auto">
                      <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                        Pago
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-auto">
                <i className="fas fa-trophy en-fa fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
