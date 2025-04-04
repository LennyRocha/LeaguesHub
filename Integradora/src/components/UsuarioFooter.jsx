import React from "react";
import "bootstrap";
import miImagen from "../img/logo1.png";
import "../css/UsuarioHeader.css";

export default function UsuarioFooter() {
  return (
    <div>
      <footer className="py-1 px-3">
        <div className="d-flex flex-column w-100 flex-sm-row justify-content-evenly py-4 my-2 border-top">
          <p>&copy; 2025 Leagueshub, Inc. All rights reserved.</p>
          {/* <a href="https://lordicon.com/">Icons by Lordicon.com</a> */}
          <p>
            <a className="link" href="https://www.utez.edu.mx/">&copy; UTEZ</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
