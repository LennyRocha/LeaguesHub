import React from "react";
import "../../css/loading.css";
import lottie from "lottie-web";
import { defineElement } from "@lordicon/element";
// define "lord-icon" custom element with default properties
defineElement(lottie.loadAnimation);

export default function NoAuthPage() {
  return (
    <div className="err-container">
      <script src="https://cdn.lordicon.com/lordicon.js"></script>
      <lord-icon
        src="https://cdn.lordicon.com/fttvwdlw.json"
        trigger="loop"
        stroke="bold"
        state="loop-flying"
        colors="primary:#333333,secondary:#9a0000"
        style={{ width: "20rem", height: "20rem", }}
      ></lord-icon>
      <h2 className="text-center">¡Acceso denegado!</h2>
      <p className="mx-0 px-0 text-center">No tienes permisos de acceso a esta pagina</p>
      <div className="gap-2 w-100 justify-content-center d-flex mt-0">
        <a href="/" className="link">Ir al menú principal</a>
      </div>
      {/* <lord-icon
        src="/icons/detengase.json"
        trigger="morph"
        stroke="bold"
        state="morph-stop"
        colors="primary:#333333,secondary:#9a0000"
        style={{ width: "3rem", height: "3rem", MarginBottom: 20 }}
      ></lord-icon> */}
    </div>
  );
}
