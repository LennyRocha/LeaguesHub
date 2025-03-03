import React from "react";
import "bootstrap";

export default function UsuarioCarrusel() {
  return (
    <div
      id="carouselExampleCaptions"
      class="carousel slide"
      data-bs-ride="carousel"
    >
      <div class="carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="0"
          class="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
      </div>
      <div class="carousel-inner">
        <div class="carousel-item active" data-bs-interval="2000">
          <img
            src="https://image.freepik.com/vector-gratis/banner-torneo-futbol_94250-89.jpg"
            class="d-block w-100 img"
            alt="..."
          />
          <div className="overlay-dk">Ejemplo</div>
        </div>
        <div class="carousel-item" data-bs-interval="2000">
          <img
            src="https://img.freepik.com/vector-premium/vector-diseno-banner-torneo-futbol_94250-633.jpg"
            class="d-block w-100 img"
            alt="..."
          />
          <div className="overlay-dk">Ejemplo</div>
        </div>
        <div class="carousel-item" data-bs-interval="2000">
          <img
            src="https://img.freepik.com/premium-vector/football-league-tournament-poster-soccer-ball-with-golden-winner-cup-flying-confetti-invitation-banner-sport-competition-game-award-ceremony-illustration-championship-advertising-vector-concept_533410-635.jpg?w=2000"
            class="d-block w-100 img"
            alt="..."
          />
        <div className="overlay-dk">
            Ejemplo
            <h1>Torneo</h1>
        </div>
        </div>
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  );
}
