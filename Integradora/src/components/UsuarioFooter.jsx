import React from "react";
import "bootstrap";
import miImagen from "../img/logo1.png";
import "../css/UsuarioHeader.css";

export default function UsuarioFooter() {
  return (
    <div>
      <footer className="py-5 px-5">
        <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-2 border-top">
          <p>&copy; 2025 Leagueshub, Inc. All rights reserved.</p>
          <br></br>
          <a href="https://lordicon.com/">Icons by Lordicon.com</a>
          <br></br>
          <p>
            <a href="https://www.utez.edu.mx/">&copy; UTEZ</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
