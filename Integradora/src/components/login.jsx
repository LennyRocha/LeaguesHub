import {  useEffect, useState } from "react";
import LoginUser from "../js/userLogin";
import miImagen from "../img/logo1.png";

import "../css/login.css";
import "../css/fonts.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Swal from 'sweetalert2'

import lottie from "lottie-web";
import { defineElement } from "@lordicon/element";

// define "lord-icon" custom element with default properties
defineElement(lottie.loadAnimation);

function Login({ cambiarComponente }) {
    const [user, setUser] = useState({ email: '', passw: '' });
    const [iconState, setIconState] = useState("loop");

    const handleChangeMail = (e) => {
    setUser({ ...user, email: e.target.value });
    };

    const handleChangePass = (e) => {
    setUser({ ...user, passw: e.target.value });
    };

    const handleSubmit = (e) => {
    e.preventDefault();
      if (user.email === '' || user.passw === '') {
          setIconState("hover-wrong");
      } else {
          setIconState("reveal");
          Swal.fire({
          icon: "success",
          title: "Datos guardados:",
          text: `Correo: ${user.email}, Contraseña: ${user.passw}`,
          });
      }
      setUser({ email: '', passw: '' });
    };

  return (
    <>
    <script src="https://cdn.lordicon.com/lordicon.js"></script>
      <section className="myContainer">
        <img src={miImagen} alt="Logo del sistema" className="logoSis" />
        <h1 className="_h1">Iniciar sesión</h1>
        <form action="POST" className="login">
        <div className="input-contenedor">
        <lord-icon
            id="iconico1"
            src="/icons/mail-icon.json"
            trigger="loop"
            stroke="bold"
            state="reveal"
            colors="primary:#9A0000,secondary:#004D73"
            style={{width:"1.5em", height:"1.5em"}}>
        </lord-icon>
          <input
            type="email"
            className="loginInput"
            name="mail"
            id="emailLogin"
            placeholder="Correo electrónico"
            value={user.email}
            onChange={handleChangeMail}
          />
        </div>
        <div className="input-contenedor">
        <lord-icon
            id="iconico2"
            src="/icons/huella-icon.json"
            trigger="loop"
            stroke="bold"
            state={iconState}
            colors="primary:#9A0000,secondary:#004D73"
            style={{width:"1.5em", height:"1.5em"}}>
        </lord-icon>
          <input
            type="password"
            className="loginInput"
            name="pass"
            id="passLogin"
            placeholder="Contraseña"
            value={user.passw}
            onChange={handleChangePass}
          />
        </div>
          <p className="link-left">
            <a className="loginLink" onClick={() => cambiarComponente("C")}>¿Olvidaste tu contraseña?</a>
          </p>
          <input type="submit" name="envio" id="sendLogin" onClick={handleSubmit} value="Acceder"/>
          <br />
          <br />
          <hr className="line"/>
          <p id="pLink" className="body-small">¿No tienes cuenta? <b><a className="loginLink" onClick={() => cambiarComponente("B")}>Registrate</a></b></p>
        </form>
      </section>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.7.10/lottie.min.js"></script>
      {/* a href="https://lordicon.com/">Icons by Lordicon.com</a> */}
    </>
  );
}

export default Login;
