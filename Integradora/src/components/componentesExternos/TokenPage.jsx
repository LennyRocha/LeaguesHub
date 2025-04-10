import React from "react";
import '../../css/loading.css';
import Balon from '../../assets/images/campo_cerrado.png'
import 'bootstrap'

export default function TokenPage({ removeToken, removeUser, logout, getout, clearData }) {
  return (
    <div className="err-container">
      <img src={Balon} alt="Imagen" className="logo" />
      <h1 className="text-center">Cerrando la cancha...</h1>
      <p className="body-small text-center">Tu sesión ha expirado, inicia sesión nuevamente</p>
      <div className="gap-2 w-100 justify-content-center d-flex">
      <button className="slide-btn-sm w-25 text-black" onClick={() => getout()}>Menú principal</button>
      <button className="slide-btn-sm w-25 text-black" onClick={() => {clearData(); window.location.href="/acceso"}}>Iniciar sesión</button>
      </div>
    </div>
  );
}
