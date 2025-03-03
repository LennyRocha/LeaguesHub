import React from "react";
import miImagen from "../img/logo1.png";
import Tooltip from "@mui/material/Tooltip";
import { useEffect, useState } from "react";
import "../css/access.css";
import "../css/fonts.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Swal from "sweetalert2";

import lottie from "lottie-web";
import { defineElement } from "@lordicon/element";
// define "lord-icon" custom element with default properties
defineElement(lottie.loadAnimation);

export default function Acces({ cambiarComponente }) {
  const [preview, setPreview] = useState(
    "https://www.meme-arsenal.com/memes/a513f913ef43476bd2b494da4e599cbc.jpg"
  );

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      console.log(file.name);
    }
  };

  const [user, setUser] = useState({
    email: "",
    passw: "",
    name: "",
    pass2: "",
  });
  const [iconState, setIconState] = useState("in-reveal");
  const [iconTrigger, setIconTrigger] = useState("loop");

  const handleChangeMail = (e) => {
    setUser({ ...user, email: e.target.value });
  };

  const handleChangePass = (e) => {
    setUser({ ...user, passw: e.target.value });
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (user.passw !== user.pass2) {
      setIconState("hover-lashes");
      setIconTrigger("morph");
      Swal.fire({
        icon: "Error",
        title: "Contraseña incorrecta",
        text: `Las contraseñas no coinciden`,
      });
    } else {
      setIconState("in-reveal");
      setIconTrigger("loop");
      Swal.fire({
        icon: "success",
        title: "Datos guardados:",
        text: `Nombre: ${user.name}, Correo: ${user.email}, Contraseña: ${user.passw}`,
      });
    }
    setUser({ email: "", passw: "", name: "", pass2: "" });
  };

  const swapScreen1 = () => {
    const container = document.getElementById("container");

    container.classList.add("right-panel-active");
  };

  const swapScreen2 = () => {
    const container = document.getElementById("container");

    container.classList.remove("right-panel-active");
  };

  return (
    <div className="container" id="container">
      <div className="form-container sign-up-container">
        <form action="#">
          <h3 className="bld">Crea tu Cuenta</h3>
          <div className="input-containere">
            <i className="fa fa-user icon" aria-hidden="true" id="orange"></i>
            <input
              type="text"
              name="nombre"
              required
              placeholder="Nombre"
              class="inp"
            />
          </div>
          <div className="input-containere">
            <i className="fa fa-envelope icon" aria-hidden="true" id="red"></i>
            <input
              type="email"
              name="email1"
              required
              placeholder="Correo electrónico"
              class="inp"
            />
          </div>
          <div className="input-containere">
            <i className="fa fa-lock icon" aria-hidden="true" id="orange"></i>
            <input
              type="password"
              name="nombre"
              required
              placeholder="Contraseña"
              class="inp"
            />
          </div>
          <div className="input-containere">
            <i className="fa fa-lock icon" aria-hidden="true" id="red"></i>
            <input
              type="password"
              name="nombre"
              required
              placeholder="Confirmar contraseña"
              class="inp"
            />
          </div>
          <button type="submit" id="sendSignup">
            Crear cuenta
          </button>
        </form>
      </div>
      <div className="form-container sign-in-container">
        <form action="Index3.html">
          <h3 className="bld">Iniciar Sesión</h3>
          <div className="input-containere">
            <lord-icon
              id="iconicoA1"
              src="/icons/mail-icon.json"
              trigger="loop"
              stroke="bold"
              state="reveal"
              colors="primary:#9A0000,secondary:#004D73"
              style={{ width: "1.5em", height: "1.5em" }}
            ></lord-icon>
            <input
              type="email"
              name="email1"
              required
              placeholder="Correo electónico"
              class="inp"
              onChange={handleChangeMail}
            />
          </div>
          <div className="input-containere">
            <lord-icon
              id="iconicoA2"
              src="/icons/huella-icon.json"
              trigger="loop"
              stroke="bold"
              state={iconState}
              colors="primary:#9A0000,secondary:#004D73"
              style={{ width: "1.5em", height: "1.5em" }}
            ></lord-icon>
            <input
              type="password"
              name="pswrd1"
              required
              placeholder="Contraseña"
              class="inp"
              onChange={handleChangePass}
            />
          </div>

          <a onClick={() => cambiarComponente("B")} className="loginLink">
            ¿Olvidaste tu contraseña?
          </a>
          <button type="submit" id="sendLogin">
            Acceder
          </button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <div className="signup-picture">
              <div className="foto">
                <img src={preview} alt="Foto de perfil nueva" id="selPict" />
                <Tooltip title="Elegir una imagen">
                  <div className="botonDiv">
                    <input
                      type="file"
                      className="botonCam"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <i className="fa fa-camera"></i>
                  </div>
                </Tooltip>
              </div>
              <p className="Pdesc justificado">
                Regístrate aquí, y registra a tu equipo posteriormente, espera
                la respuesta de los administradores para ingresar a tu equipo a
                los torneos de la liguilla.
              </p>
            </div>
            <button className="ghost" id="signIn" onClick={swapScreen2}>
              Inicia sesión
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <img src={miImagen} alt="Logo del sistema" className="logoSis" />
            <h3 className="whiteText">¿Aún no tienes cuenta?</h3>
            <button className="ghost" id="signUp" onClick={swapScreen1}>
              Registrate
            </button>
            <a href="/" className="loginLink">
              Volver
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
