import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../css/perfil.css";
import "../css/fonts.css";
import PerfilAppBar from "./perfil/PerfilHeader";
import { TextField } from "@mui/material";

export default function Perfil() {
  const [preview, setPreview] = useState(
    "https://www.meme-arsenal.com/memes/a513f913ef43476bd2b494da4e599cbc.jpg"
  );

  const [hasText, setHasText] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleInput = (e) => {
    setHasText(e.target.value.trim() !== "");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      console.log(file.name);
    }
  };

  return (
    <>
      <PerfilAppBar />
      <div id="perfil_container">
        <div id="back_div"></div>
        <div className="update-picture">
          <div className="foto2">
            <img src={preview} alt="Foto de perfil" id="selPictu" />
            <div className="buttonDiv">
              <input
                type="file"
                className="botonCama"
                accept="image/*"
                onChange={handleFileChange}
              />
              <i className="fa fa-image"></i>
            </div>
          </div>
        </div>
        <form action="" id="profForm">
          <div className="row container-fluid">
            <h4>Datos personales</h4>
            <div className="col-md-4">
              <TextField
                name="email"
                label="Correo electrónico"
                fullWidth
                margin="dense"
                className="txtField readonly"
                inputProps={{ readOnly: true }}
                value={"20233tn094@utez.edu.mx"}
              />
            </div>
            <div className="col-md-4">
              <TextField
                name="name"
                label="Nombre"
                fullWidth
                margin="dense"
                className="txtField"
              />
            </div>
            <div className="col-md-4"></div>
          </div>
          <br />
          <div className="row container-fluid">
            <h4>Cambiar tu contraseña</h4>
            <div className="col-md-4">
              <TextField
                name="current"
                label="Contraseña actual"
                fullWidth
                margin="dense"
                className="txtField"
                type="password"
              />
            </div>
            <div className="col-md-4">
              <TextField
                name="new"
                label="Nueva contraseña"
                fullWidth
                margin="dense"
                className="txtField"
                type="password"
              />
            </div>
            <div className="col-md-4">
              <TextField
                name="confirm"
                label="Confirmar contraseña"
                fullWidth
                margin="dense"
                className="txtField"
                type="password"
              />
            </div>
          </div>
          <br />
          <div className="row container-fluid" id="buttonRow">
            <input type="submit" name="updateP" id="sendCambio" />
          </div>
        </form>
      </div>
    </>
  );
}
