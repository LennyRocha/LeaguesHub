import React from "react";
import "bootstrap";

export default function UsuarioCarrusel() {
  return (
    <div
      id="torneos"
      className="carousel slide"
      data-bs-ride="carousel"
    >
      <div className="carousel-indicators">
        <button
          type="button"
          data-bs-target="#torneos"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#torneos"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target="#torneos"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
      </div>
      <div className="carousel-inner">
        <div className="carousel-item active" data-bs-interval="2000">
          <img
            src="https://image.freepik.com/vector-gratis/banner-torneo-futbol_94250-89.jpg"
            className="d-block w-100 img"
            alt="..."
          />
          <div className="overlay-dk">
            Ejemplo
            <h1>Torneo 1</h1>
          </div>
        </div>
        <div className="carousel-item" data-bs-interval="2000">
          <img
            src="https://img.freepik.com/vector-premium/vector-diseno-banner-torneo-futbol_94250-633.jpg"
            className="d-block w-100 img"
            alt="..."
          />
          <div className="overlay-dk">
            Ejemplo
            <h1>Torneo 2</h1>
          </div>
        </div>
        <div className="carousel-item" data-bs-interval="2000">
          <img
            src="https://img.freepik.com/premium-vector/football-league-tournament-poster-soccer-ball-with-golden-winner-cup-flying-confetti-invitation-banner-sport-competition-game-award-ceremony-illustration-championship-advertising-vector-concept_533410-635.jpg?w=2000"
            className="d-block w-100 img"
            alt="..."
          />
          <div className="overlay-dk">
            Ejemplo
            <h1>Torneo 3</h1>
          </div>
        </div>
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#torneos"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#torneos"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}
