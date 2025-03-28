import React from "react";
import "../../css/loading.css";
import Balon from "../../assets/templates/balon.png";

import lottie from "lottie-web";
import { defineElement } from "@lordicon/element";
// define "lord-icon" custom element with default properties
defineElement(lottie.loadAnimation);

export default function NoAuthPage() {
  return (
    <div className="centered">
      <script src="https://cdn.lordicon.com/lordicon.js"></script>
      <h1>Alto</h1>
      <p className="body-small">No tienes permisos de acceso a esta pagina</p>
      <lord-icon
        src="https://cdn.lordicon.com/fttvwdlw.json"
        trigger="loop"
        stroke="bold"
        state="loop-roll"
        colors="primary:#333333,secondary:#9a0000"
        style={{ width: "10rem", height: "10rem", MarginBottom: 20 }}
      ></lord-icon>
      <a href="https://lordicon.com/">Icons by Lordicon.com</a>
      <a href="/">Volver</a>
    </div>
  );
}
