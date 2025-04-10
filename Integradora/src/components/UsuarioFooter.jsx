import React from "react";
import "bootstrap";
import miImagen from "../img/logo1.png";
import "../css/UsuarioHeader.css";

export default function UsuarioFooter() {
  return (
    <div>
      <footer className="spy-1 px-3">
        <div className=" my-auto">
          <div className="copyright text-center text-white my-auto">
            <p>&copy; 2025 Leagueshub, Inc. All rights reserved.</p>
            {/* <a href="https://lordicon.com/">Icons by Lordicon.com</a> */}
            <a className="link" href="https://www.utez.edu.mx/">
              &copy; UTEZ
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
