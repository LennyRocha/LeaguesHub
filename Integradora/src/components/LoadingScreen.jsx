import React from "react";
import '../css/loading.css';
import Balon from '../assets/templates/balon.png'

export default function LoadingScreen() {
  return (
    <div className="centered">
      <h1>Pantalla de carga</h1>
      <img src={Balon} alt="logo-balon" className="balon" />
      <div className="span-col">
        <span className="span-load"></span>
        <span className="span-load"></span>
        <span className="span-load"></span>
      </div>
    </div>
  );
}
