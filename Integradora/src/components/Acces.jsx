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
  const [emptyField, setEmptyField] = useState('');

  const [preview, setPreview] = useState(
    "https://www.meme-arsenal.com/memes/a513f913ef43476bd2b494da4e599cbc.jpg"
  );

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      console.log(file.name, file);
    }
  };

  const [userL, setUserL] = useState({
    email: "",
    passw: "",
  });

  const [userS, setUserS] = useState({
    email: "",
    passw: "",
    name: "",
    pass2: "",
    img: ''
  });

  //Login
  const handleChangeMailL = (e) => {
    setUserL({ ...userL, email: e.target.value });
    console.log(e.target.value)
  };

  const handleChangePassL = (e) => {
    setUserL({ ...userL, passw: e.target.value }); 
  };

  //Sign up
  const handleChangeName = (e) => {
    setUserS({ ...userS, [e.target.name]: e.target.value }); 
  };

  const handleChangeMail = (e) => {
    setUserS({ ...userS, [e.target.name]: e.target.value }); 
    console.log(e.target.value)
  };

  const handleChangePass = (e) => {
    setUserS({ ...userS, [e.target.name]: e.target.value }); 
  };

  const handleChangePass2 = (e) => {
    setUserS({ ...userS, [e.target.name]: e.target.value }); 
  };

  const handleChangeImg = async (e) => {
    if(preview !== "https://www.meme-arsenal.com/memes/a513f913ef43476bd2b494da4e599cbc.jpg"){
      setUserS({ ...userS, img: preview });
    }
  };

  const handleSubmit1 = (e) => {
    e.preventDefault();
    if (userL.passw === "" || userL.email === "" || emptyField !== '') {
      Swal.fire({
        icon: "error",
        title: "Campos vacios",
        text: `El campo ${emptyField} está vacío`,
        customClass: {
          confirmButton: 'btn-confirm',
          cancelButton: 'btn-cancel',
          denyButton: 'btn-deny'
        }
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Datos guardados:",
        text: `Correo: ${userL.email}, Contraseña: ${userL.passw}`,
        customClass: {
          confirmButton: 'btn-confirm',
          cancelButton: 'btn-cancel',
          denyButton: 'btn-deny'
        }
      });
      window.location.href = '/admin'
    }
    setUserL({ email: "", passw: ""});
    e.target.reset();
    setEmptyField('');
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();
    handleChangeImg();
    if (userS.passw !== userS.pass2) {
      Swal.fire({
        icon: "error",
        title: "Contraseña incorrecta",
        text: `Las contraseñas no coinciden`,
        customClass: {
          confirmButton: 'btn-confirm',
          cancelButton: 'btn-cancel',
          denyButton: 'btn-deny'
        }
      });
    } else if (userS.passw === "" || userS.pass2 === "" || userS.email === "" || userS.name === "") {
      console.log(userS)
      Swal.fire({
        icon: "error",
        title: "Campos vacios",
        text: `El campo ${emptyField} está vacío`,
        customClass: {
          confirmButton: 'btn-confirm',
          cancelButton: 'btn-cancel',
          denyButton: 'btn-deny'
        }
      });
    } else if (preview === "https://www.meme-arsenal.com/memes/a513f913ef43476bd2b494da4e599cbc.jpg") {
      Swal.fire({
        icon: "error",
        title: "Imagen no seleccionada",
        text: `Elige una imagen para continuar`,
        customClass: {
          confirmButton: 'btn-confirm',
          cancelButton: 'btn-cancel',
          denyButton: 'btn-deny'
        }
      });
    }else {
      Swal.fire({
        icon: "success",
        title: "Datos guardados:",
        text: `Nombre: ${userS.name}, Correo: ${userS.email}, Contraseña: ${userS.passw}`,
        customClass: {
          confirmButton: 'btn-confirm',
          cancelButton: 'btn-cancel',
          denyButton: 'btn-deny'
        }
      });
    }
    setUserS({ email: "", passw: "", name: "", pass2: "", img: '' });
    e.target.reset();
    setEmptyField('');
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
        <form onSubmit={handleSubmit2}>
          <h3 className="bld">Crea tu Cuenta</h3>
          <div className="input-containere">
            <i className="fa fa-user icon" aria-hidden="true" id="orange"></i>
            <input
              type="text"
              name="name"
              required
              placeholder="Nombre"
              class="inp"
              onInput={handleChangeName}
            />
          </div>
          <div className="input-containere">
            <i className="fa fa-envelope icon" aria-hidden="true" id="red"></i>
            <input
              type="email"
              name="email"
              required
              placeholder="Correo electrónico"
              class="inp"
              onInput={handleChangeMail}
            />
          </div>
          <div className="input-containere">
            <i className="fa fa-lock icon" aria-hidden="true" id="orange"></i>
            <input
              type="password"
              name="passw"
              required
              placeholder="Contraseña"
              class="inp"
              onInput={handleChangePass}
            />
          </div>
          <div className="input-containere">
            <i className="fa fa-lock icon" aria-hidden="true" id="red"></i>
            <input
              type="password"
              name="pass2"
              required
              placeholder="Confirmar contraseña"
              class="inp"
              onInput={handleChangePass2}
            />
          </div>
          <button type="submit" id="sendSignup">
            Crear cuenta
          </button>
        </form>
      </div>
      <div className="form-container sign-in-container">
        <form onSubmit={handleSubmit1}>
          <h3 className="bld">Iniciar Sesión</h3>
          <div className="input-containere">
          <i className="fa fa-user icon" aria-hidden="true" id="red"></i>
            <input
              type="email"
              name="email1"
              required
              placeholder="Correo electónico"
              class="inp"
              id="mail1"
              onInput={handleChangeMailL}
            />
          </div>
          <div className="input-containere">
          <i className="fa fa-lock icon" aria-hidden="true" id="red"></i>
            <input
              type="password"
              name="pswrd1"
              required
              placeholder="Contraseña"
              class="inp"
              id="pass1"
              onInput={handleChangePassL}
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
