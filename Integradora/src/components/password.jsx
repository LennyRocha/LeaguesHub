import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../css/pass.css";
import lottie from "lottie-web";
import { defineElement } from "@lordicon/element";
import Swal from "sweetalert2";

export default function Password({ cambiarComponente }) {
  const [iconState, setIconState] = useState("loop");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (e.target.value === "") {
      setIconState("hover-wrong");
    } else {
      setIconState("reveal");
      Swal.fire({
        icon: "success",
        title: "Datos guardados:",
        text: `Correo: ${e.target.value}`,
      });
    }
  };
  return (
    <div className="container-fluid" id="pass_container">
      <h1 id="h1-pass">¿Olvidaste tu contraseña?</h1>
      <div className="row">
        <div className="col-md-6 myCol" id="imgcol">
          <img src="src\assets\images\noPass.png" id="noPassImg" alt="" />
        </div>
        <div className="col-md-6 myCol" id="textCol">
          <p className="texto body-big">
            Lo entendemos, las cosas pasan. Simplemente ingrese su dirección de
            correo electrónico a continuación y le enviaremos un enlace para
            restablecer su contraseña.
          </p>
          <form action="" id="mini-form">
            <div class="input-cont">
              <lord-icon
                id="iconPass"
                src="/icons/correo-icon.json"
                trigger="loop"
                stroke="bold"
                state={iconState}
                colors="primary:#9A0000,secondary:#004D73"
                style={{ width: "2em", height: "2em" }}
              ></lord-icon>
              <input
                type="email"
                className="newPassInput"
                name="pass"
                id="passChange"
                placeholder="Correo electrónico"
                inputMode="email"
              />
            </div>
            <input
              type="submit"
              value={"Recuperar mi contraseña"}
              id="sendMail"
            />
            <br />
            <p>
              <a className="loginLink" onClick={() => cambiarComponente("A")}>
                Regresar
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
