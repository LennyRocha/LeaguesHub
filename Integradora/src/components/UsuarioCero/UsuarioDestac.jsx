import React from "react";
import "bootstrap";
import '../../css/usuario.css'

export default function UsuarioDestac() {
  return (
    <div id="destac">
    <h1>Lo mejor de esta semana</h1>
    <div class="row" id="theBest">
      <div class="col-lg-3">
        <center>
          <img
            src="IMG/7.jpg"
            class="bd-placeholder-img rounded-circle"
            width="140"
            height="140"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
          />
          <h2 class="fw-normal">Goleador</h2>
          <p>
            Maquila de cualquier producto textil desde trapos hasta peluches.
          </p>
          {/*<p>
            <a class="btn btn-secondary" href="#">
              Ver detalles &raquo;
            </a>
          </p>*/}
        </center>
      </div>

      <div class="col-lg-3">
        <center>
          <img
            src="IMG/8.jpg"
            class="bd-placeholder-img rounded-circle"
            width="140"
            height="140"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
          />
          <h2 class="fw-normal">Mejor ofensiva</h2>
          <p>
            Envios nacionales e internacionales a través de nuestros socios
            paqueterias.
          </p>
        </center>
      </div>

      <div class="col-lg-3">
        <center>
          <img
            src="IMG/9.jpg"
            class="bd-placeholder-img rounded-circle"
            width="140"
            height="140"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
          />
          <h2 class="fw-normal">Mejor defensiva</h2>
          <p>Ofrecemos membresias para que usted ahorre más con nostros.</p>
        </center>
      </div>

      <div class="col-lg-3">
        <center>
          <img
            src="IMG/9.jpg"
            class="bd-placeholder-img rounded-circle"
            width="140"
            height="140"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
          />
          <h2 class="fw-normal">Juego limpio</h2>
          <p>Ofrecemos membresias para que usted ahorre más con nostros.</p>
        </center>
      </div>
    </div>
    </div>
  );
}
