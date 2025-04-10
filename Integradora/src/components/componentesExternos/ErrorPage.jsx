import React from "react";
import ErrorImg from '../../assets/images/error_bot.png'
import "../../css/loading.css";

function ErrorPage() {
  return (
    <div className="err-container">
      <div className="row container-fluid">
        <div className="col-md-8 d-flex flex-column justify-content-center gap-2">
          <h1 className="body-big oswald normalWeight text-danger">Leagues Hub</h1>
          <h2>404, Eso es un error</h2>
          <p className="body-med text-justify">La URL solicitada no fue encontrada en el servidor. Eso es todo lo que sabemos.</p>
          <a href="/" className="link">Salir al menú principal</a>
        </div>
        <div className="col-md-4 align-items-center d-flex justify-content-center">
          <img src={ErrorImg} alt="Imagen 404" className="img404" />
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
