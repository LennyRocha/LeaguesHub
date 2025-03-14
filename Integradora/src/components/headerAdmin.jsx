import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@fortawesome/fontawesome-free/css/all.min.css";
import miImagen from "../img/logo1.png";

import "../css/sb-admin-2.css";
import "../css/fonts.css";
import "../js/sb-admin-2";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@popperjs/core";

import lottie from "lottie-web";
import { defineElement } from "@lordicon/element";
// define "lord-icon" custom element with default properties
defineElement(lottie.loadAnimation);

import Admin1 from "./componentesAdmin/Admin1";
import Admin2 from "./componentesAdmin/Admin2";
import Admin3 from "./componentesAdmin/Admin3";
import Admin4 from "./componentesAdmin/Admin4";
import Admin5 from "./componentesAdmin/Admin5";
import Admin6 from "./componentesAdmin/Admin6";
import Admin7 from "./componentesAdmin/Admin7";
import Admin8 from "./componentesAdmin/Admin8";

function AdminDashboard() {
  const [userName, setUserName] = useState("Usuario");
  const [activeComponent, setActiveComponent] = useState("home");

  const week = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const [timeStr, setTimeStr] = useState("");
  const [dateStr, setDateStr] = useState("");

  // Función para agregar ceros a la izquierda
  const zeroPadding = (num, digit) => {
    return String(num).padStart(digit, "0");
  };

  // useEffect se encarga de actualizar la hora cada segundo
  useEffect(() => {
    function updateTime() {
      const now = new Date();
      setTimeStr(
        `${zeroPadding(now.getHours(), 2)}:${zeroPadding(
          now.getMinutes(),
          2
        )}:${zeroPadding(now.getSeconds(), 2)}`
      );
      setDateStr(
        `${week[now.getDay()]}, ${now.getFullYear()}-${zeroPadding(
          now.getMonth() + 1,
          2
        )}-${zeroPadding(now.getDate(), 2)}`
      );
    }

    updateTime(); // Inicializa con el valor actual
    const intervalId = setInterval(updateTime, 1000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []); // Se ejecuta una sola vez al montar el componente

  const renderComponent = () => {
    switch (activeComponent) {
      case "home":
        return <Admin1 />;
      case "equipos":
        return <Admin2 cambiarComponent={setActiveComponent} />;
      case "torneos":
        return <Admin3 />;
      case "campos":
        return <Admin4 />;
      case "arbitros":
        return <Admin5 />;
      case "pagos":
        return <Admin6 />;
      case "publicidad":
        return <Admin7 />;
      case "dueno":
        return <Admin8 cambiarComponent={setActiveComponent}/>;
      default:
        return <Admin1 />;
    }
  };
  return (
    <>
      <div id="wrapper">
        {/* Sidebar */}
        <ul
          className="navbar-nav bg-gradient sidebar sidebar-dark accordion bar-wrap"
          id="accordionSidebar"
        >
          <a
            className="sidebar-brand d-flex align-items-center justify-content-center"
          >
            <div className="sidebar-brand-icon">
              <img src={miImagen} alt="" width={"50em"} height={"50em"} />
              {/*<i className="fas fa-laugh-wink"></i>*/}
            </div>
            <div className="sidebar-brand-text mx-3 non-h-text">Menú</div>
          </a>

          <hr className="sidebar-divider my-0" />

          <li
            className={`nav-item ${activeComponent === "home" ? "active" : ""}`}
          >
            <a className="nav-link" onClick={() => setActiveComponent("home")}>
              <i className="fa-solid fa-house fap"></i>
              <span>Inicio</span>
            </a>
          </li>

          <li
            className={`nav-item ${
              activeComponent === "equipos" || activeComponent === "dueno"  ? "active" : ""
            }`}
          >
            <a
              className="nav-link"
              onClick={() => setActiveComponent("equipos")}
            >
              <i className="fa-solid fa-user fap"></i>
              <span>Dueños</span>
            </a>
          </li>

          <li
            className={`nav-item ${
              activeComponent === "torneos" ? "active" : ""
            }`}
          >
            <a
              className="nav-link"
              onClick={() => setActiveComponent("torneos")}
            >
              <i className="fa-solid fa-trophy fap"></i>
              <span>Torneos</span>
            </a>
          </li>

          <li
            className={`nav-item ${
              activeComponent === "campos" ? "active" : ""
            }`}
          >
            <a
              className="nav-link"
              onClick={() => setActiveComponent("campos")}
            >
              <i className="fa-solid fa-futbol fap"></i>
              <span>Campos</span>
            </a>
          </li>

          <li
            className={`nav-item ${
              activeComponent === "arbitros" ? "active" : ""
            }`}
          >
            <a
              className="nav-link"
              onClick={() => setActiveComponent("arbitros")}
            >
              <i className="fa-solid fa-hand-paper fap"></i>
              <span>Arbitros</span>
            </a>
          </li>

          <li
            className={`nav-item ${
              activeComponent === "pagos" ? "active" : ""
            }`}
          >
            <a className="nav-link" onClick={() => setActiveComponent("pagos")}>
              <i className="fa-solid fa-wallet fap"></i>
              <span>Pagos</span>
            </a>
          </li>

          <li
            className={`nav-item ${
              activeComponent === "publicidad" ? "active" : ""
            }`}
          >
            <a
              className="nav-link"
              onClick={() => setActiveComponent("publicidad")}
            >
              <i className="fa-solid fa-newspaper fap"></i>
              <span>Convocatorias</span>
            </a>
          </li>

          <hr className="sidebar-divider d-none d-md-block" />

          <div className="text-center d-none d-md-inline">
            <button
              className="rounded-circle border-0"
              id="sidebarToggle"
            ></button>
          </div>

          <div className="sidebar-card d-none d-lg-flex clock">
            <lord-icon
              src="https://cdn.lordicon.com/lewtedlh.json"
              trigger="loop"
              stroke="bold"
              state="loop-roll"
              colors="primary:#333333,secondary:#9a0000"
              style={{ width: "3.5rem", height: "3.5rem", MarginBottom: 20 }}
            ></lord-icon>
            <p className="text-center text-white mb-0 mt-1">{dateStr}</p>
            <p className="text-center mb-2 time">{timeStr}</p>
            {/*<a className="btn btn-success btn-sm" href="/admin">
              Upgrade to Pro!
            </a>*/}
          </div>
        </ul>
        {/* Content Wrapper */}
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            {/* Topbar */}
            <nav
              className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow"
              id="navbar"
            >
              <button
                id="sidebarToggleTop"
                className="btn btn-link d-md-none rounded-circle mr-3"
              >
                <i className="fa fa-bars"></i>
              </button>

              <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 navbar-search">
                <div className="input-group">
                  <input
                    type="search"
                    className="form-control border-0 small seark"
                    placeholder="Search for..."
                    aria-label="Search"
                    aria-describedby="basic-addon2"
                  />
                  <div className="input-group-append">
                    <button className="btn red-btn" type="button">
                      <i className="fas fa-search fa-sm"></i>
                    </button>
                  </div>
                </div>
              </form>

              <ul className="navbar-nav ml-auto">
                <li className="nav-item dropdown no-arrow d-sm-none">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="searchDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="fas fa-search fa-fw"></i>
                  </a>

                  <div
                    className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
                    aria-labelledby="searchDropdown"
                  >
                    <form className="form-inline mr-auto w-100 navbar-search">
                      <div className="input-group">
                        <input
                          type="search"
                          className="form-control border-0 small seark"
                          placeholder="Search for..."
                          aria-label="Search"
                          aria-describedby="basic-addon2"
                        />
                        <div className="input-group-append">
                          <button className="btn red-btn" type="button">
                            <i className="fas fa-search fa-sm"></i>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </li>

                <li className="nav-item dropdown no-arrow mx-auto">
                  <a
                    className="nav-link dropdown-toggle gray-back"
                    id="alertsDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="true"
                  >
                    <i className="fa-regular fa-bell fa-fw"></i>
                    <span className="badge badge-danger badge-counter">3+</span>
                  </a>

                  <div
                    className="dropdown-list dropdown-menu shadow animated--grow-in"
                    aria-labelledby="alertsDropdown"
                  >
                    <h6 className="dropdown-header">Alerts Center</h6>
                    <a className="dropdown-item d-flex align-items-center">
                      <div className="mr-3">
                        <div className="icon-circle bg-primary">
                          <i className="fas fa-file-alt text-white"></i>
                        </div>
                      </div>
                      <div>
                        <div className="small text-gray-500">
                          December 12, 2019
                        </div>
                        <span className="font-weight-bold">
                          A new monthly report is ready to download!
                        </span>
                      </div>
                    </a>
                    <a
                      className="dropdown-item d-flex align-items-center"
                      href="#"
                    >
                      <div className="mr-3">
                        <div className="icon-circle bg-success">
                          <i className="fas fa-donate text-white"></i>
                        </div>
                      </div>
                      <div>
                        <div className="small text-gray-500">
                          December 7, 2019
                        </div>
                        $290.29 has been deposited into your account!
                      </div>
                    </a>
                    <a
                      className="dropdown-item d-flex align-items-center"
                      href="#"
                    >
                      <div className="mr-3">
                        <div className="icon-circle bg-warning">
                          <i className="fas fa-exclamation-triangle text-white"></i>
                        </div>
                      </div>
                      <div>
                        <div className="small text-gray-500">
                          December 2, 2019
                        </div>
                        Spending Alert: We've noticed unusually high spending
                        for your account.
                      </div>
                    </a>
                    <a
                      className="dropdown-item text-center small text-gray-500"
                      href="#"
                    >
                      Show All Alerts
                    </a>
                  </div>
                </li>

                <li className="nav-item dropdown no-arrow mx-1">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="messagesDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="fa-regular fa-envelope fa-fw"></i>
                    <span className="badge badge-danger badge-counter">7</span>
                  </a>

                  <div
                    className="dropdown-list dropdown-menu shadow animated--grow-in"
                    aria-labelledby="messagesDropdown"
                    id="messagesCenter"
                  >
                    <h6 className="dropdown-header">Message Center</h6>
                    <a
                      className="dropdown-item d-flex align-items-center"
                      href="#"
                    >
                      <div className="dropdown-list-image mr-1">
                        <img
                          className="rounded-circle"
                          src="img/undraw_profile_1.svg"
                          alt="..."
                        />
                        <div className="status-indicator bg-success"></div>
                      </div>
                      <div>
                        <div className="text-truncate">
                          Hi there! I am wondering if you can help me with a
                          problem I've been having.
                        </div>
                        <div className="small text-gray-500">
                          Emily Fowler · 58m
                        </div>
                      </div>
                    </a>
                    <a
                      className="dropdown-item d-flex align-items-center"
                      href="#"
                    >
                      <div className="dropdown-list-image mr-1">
                        <img
                          className="rounded-circle"
                          src="img/undraw_profile_2.svg"
                          alt="..."
                        />
                        <div className="status-indicator bg-success"></div>
                      </div>
                      <div>
                        <div className="text-truncate">
                          I have the photos that you ordered last month, how
                          would you like them sent to you?
                        </div>
                        <div className="small text-gray-500">Jae Chun · 1d</div>
                      </div>
                    </a>
                    <a
                      className="dropdown-item d-flex align-items-center"
                      href="#"
                    >
                      <div className="dropdown-list-image mr-1">
                        <img
                          className="rounded-circle"
                          src="img/undraw_profile_3.svg"
                          alt="..."
                        />
                        <div className="status-indicator bg-success"></div>
                      </div>
                      <div>
                        <div className="text-truncate">
                          Last month's report looks great, I am very happy with
                          the progress so far, keep up the good work!
                        </div>
                        <div className="small text-gray-500">
                          Morgan Alvarez · 2d
                        </div>
                      </div>
                    </a>
                    <a
                      className="dropdown-item d-flex align-items-center"
                      href="#"
                    >
                      <div className="dropdown-list-image mr-1">
                        <img
                          className="rounded-circle"
                          src="img/undraw_profile_4.svg"
                          alt="..."
                        />
                        <div className="status-indicator bg-success"></div>
                      </div>
                      <div>
                        <div className="text-truncate">
                          Am I a good boy? The reason I ask is because someone
                          told me that people say this to all dogs, even if they
                          aren't good...
                        </div>
                        <div className="small text-gray-500">
                          Chicken the Dog · 2w
                        </div>
                      </div>
                    </a>
                    <a
                      className="dropdown-item text-center small text-gray-500"
                      href="#"
                    >
                      Read More Messages
                    </a>
                  </div>
                </li>

                <div className="topbar-divider d-none d-sm-block"></div>

                <li className="nav-item dropdown no-arrow">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="userDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span class="mr-3 d-none d-lg-inline text-gray-600 small">
                      {userName} #0000000001
                    </span>
                    <img
                      className="img-profile rounded-circle"
                      src="https://www.meme-arsenal.com/memes/a513f913ef43476bd2b494da4e599cbc.jpg"
                      alt="..."
                    />
                  </a>

                  <div
                    className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                    aria-labelledby="userDropdown"
                  >
                    <a className="dropdown-item" href="#">
                      <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                      Profile
                    </a>
                    <a className="dropdown-item" href="#">
                      <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                      Settings
                    </a>
                    <a className="dropdown-item" href="#">
                      <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                      Activity Log
                    </a>
                    <div className="dropdown-divider"></div>
                    <a
                      className="dropdown-item"
                      href="/"
                      data-toggle="modal"
                      data-target="#logoutModal"
                    >
                      <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                      Logout
                    </a>
                  </div>
                </li>
              </ul>
            </nav>
            {/* Contenido */}
            <div style={{ width: "100%", marginBottom: "1rem"}}>
              {renderComponent()}
            </div>
          </div>

          {/* Footer */}
          <footer className="sticky-footer bg-base">
            <div className="container my-auto">
              <div className="copyright text-center my-auto">
                <span>Copyright &copy; Leagues Hub 2025</span>
                <br />
                <a href="https://lordicon.com/">Icons by Lordicon.com</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
