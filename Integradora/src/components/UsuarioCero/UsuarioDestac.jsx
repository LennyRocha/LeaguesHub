import React from "react";
import "bootstrap";
import '../../css/usuario.css'

export default function UsuarioDestac() {
  return (
    <div>
    <h1 id="destac">Lo mejor de esta semana</h1>
    <div className="row" id="theBest">
      <div className="col-lg-3 bestCol">
        <center>
          <img
            src="https://lindamood.net/wp-content/uploads/2019/09/Blank-profile-image.jpg"
            className="bd-placeholder-img"
            width="140"
            height="140"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
          />
          <h2 className="fw-normal">Goleador</h2>
          <h3 className="fw-normal">Juan Peréz</h3>
          <p>
            Anotó: 9 goles
          </p>
          {/*<p>
            <a class="btn btn-secondary" href="#">
              Ver detalles &raquo;
            </a>
          </p>*/}
        </center>
      </div>

      <div className="col-lg-3 bestCol">
        <center>
          <img
            src="https://logodix.com/logo/1804837.png"
            className="bd-placeholder-img rounded-circle"
            width="140"
            height="140"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
          />
          <h2 className="fw-normal">Mejor ofensiva</h2>
          <h3 className="fw-normal">Chivas</h3>
          <p>
            Goles a favor: 50
          </p>
        </center>
      </div>

      <div className="col-lg-3 bestCol">
        <center>
          <img
            src="https://seeklogo.com/images/P/pumas-de-la-unam-logo-356E15504A-seeklogo.com.png"
            className="bd-placeholder-img rounded-circle"
            width="140"
            height="140"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
          />
          <h2 className="fw-normal">Mejor defensiva</h2>
          <h3 className="fw-normal">Pumas</h3>
          <p>Goles en contra: 29</p>
        </center>
      </div>

      <div className="col-lg-3 bestCol">
        <center>
          <img
            src="https://th.bing.com/th/id/OIP.AXn365kLTIEJmzZm7fDYVgHaM5?rs=1&pid=ImgDetMain"
            className="bd-placeholder-img rounded-circle"
            width="140"
            height="140"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
          />
          <h2 className="fw-normal">Juego limpio</h2>
          <h3 className="fw-normal">Tigres</h3>
          <p>Tarjetas rojas: 0, Tarjetas amarillas: 1</p>
        </center>
      </div>
    </div>
    </div>
  );
}
