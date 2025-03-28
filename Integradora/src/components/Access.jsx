import React from "react";
import miImagen from "../img/logo1.png";
import Tooltip from "@mui/material/Tooltip";
import { useEffect, useState } from "react";
import { useContext } from "react";
import "../css/access.css";
import "../css/fonts.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";

import lottie from "lottie-web";
import { defineElement } from "@lordicon/element";
defineElement(lottie.loadAnimation);
import axios from "axios";

const Access = ({ cambiarComponente }) => {
  const context = useContext(AuthContext);

  const {
    login,
    isLoading,
    setIsLoading,
    failure,
    saveToken,
    saveUser,
    getToken,
    removeToken,
    mensaje,
    setMensaje,
    setFailure,
    api_url,
    getUserRole,
  } = useContext(AuthContext);

  const [loadPost, setLoadPost] = useState(false);

  useEffect(() => {
    console.log("Contexto recibido:", context);
    console.log(context.login);
  }, []);

  const [emptyField, setEmptyField] = useState("");

  const [preview, setPreview] = useState(
    "https://www.meme-arsenal.com/memes/a513f913ef43476bd2b494da4e599cbc.jpg"
  );

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file); // Guarda el archivo seleccionado
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result); // Crea la vista previa
      reader.readAsDataURL(file);
      console.log("Archivo seleccionado:", file.name, file);
    }
  };

  const [userL, setUserL] = useState({
    email: "",
    passw: "",
  });

  const [userS, setUserS] = useState({
    email: "",
    passw: "",
    name: "",
    pass2: "",
    img: "",
  });

  //Login
  const handleChangeMailL = (e) => {
    setUserL({ ...userL, email: e.target.value });
  };

  const handleChangePassL = (e) => {
    setUserL({ ...userL, passw: e.target.value });
  };

  //Sign up
  const handleChangeName = (e) => {
    setUserS({ ...userS, [e.target.name]: e.target.value });
  };

  const handleChangeMail = (e) => {
    setUserS({ ...userS, [e.target.name]: e.target.value });
  };

  const handleChangePass = (e) => {
    setUserS({ ...userS, [e.target.name]: e.target.value });
  };

  const handleChangePass2 = (e) => {
    setUserS({ ...userS, [e.target.name]: e.target.value });
  };

  const handleChangeImg = async (e) => {
    if (
      preview !==
      "https://www.meme-arsenal.com/memes/a513f913ef43476bd2b494da4e599cbc.jpg"
    ) {
      setUserS({ ...userS, img: preview });
    }
  };

  const handleSubmit1 = async (e) => {
    e.preventDefault();
    if (userL.passw === "" || userL.email === "" || emptyField !== "") {
      Swal.fire({
        icon: "error",
        title: "Campos vacios",
        text: `             
        ${
          mensaje === "" || mensaje === undefined
            ? "Algo salió mal, intentalo nuevamente"
            : mensaje
        }`,
        customClass: {
          confirmButton: "btn-confirm",
          cancelButton: "btn-cancel",
          denyButton: "btn-deny",
        },
      });
    } else {
      setIsLoading(true);
      try {
        const res = await axios.post(`${api_url}/auth/login`, {
          email: userL.email,
          password: userL.passw,
        });
        saveToken(res.data.token);
        saveUser(res.data.roles, res.data.id, res.data.correo);

        switch (res.data.roles) {
          case "ROLE_ADMIN":
            window.location.href = "/admin";
            break;
          case "ROLE_ARBITRO":
            window.location.href = "/arbitro";
            break;
          case "ROLE_DUENO":
            window.location.href = "/dueno";
            break;
          default:
            return;
        }

        //setUser({ role: res.data.roles.replace("ROLE_", "").toLowerCase() });

        setFailure(false);
      } catch (err) {
        console.log(err, err.message);
        if (err.response) {
          setMensaje(err.response.data.message);
          Swal.fire({
            icon: "error",
            title: "¡Denegado!",
            text:
              err.response?.data?.message ||
              "Algo salió mal, inténtalo nuevamente",
            customClass: {
              confirmButton: "btn-confirm",
              cancelButton: "btn-cancel",
              denyButton: "btn-deny",
            },
          });
        }
        setFailure(true);
      } finally {
        setIsLoading(false);
      }
    }
    setUserL({ email: "", passw: "" });
    e.target.reset();
    setEmptyField("");
    setIsLoading(false);
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    handleChangeImg();
    if (userS.passw !== userS.pass2) {
      Swal.fire({
        icon: "error",
        title: "Contraseña incorrecta",
        text: `Las contraseñas no coinciden`,
        customClass: {
          confirmButton: "btn-confirm",
          cancelButton: "btn-cancel",
          denyButton: "btn-deny",
        },
      });
    } else if (
      userS.passw === "" ||
      userS.pass2 === "" ||
      userS.email === "" ||
      userS.name === ""
    ) {
      console.log(userS);
      Swal.fire({
        icon: "error",
        title: "Campos vacios",
        text: `El campo ${emptyField} está vacío`,
        customClass: {
          confirmButton: "btn-confirm",
          cancelButton: "btn-cancel",
          denyButton: "btn-deny",
        },
      });
    } else if (
      preview ===
      "https://www.meme-arsenal.com/memes/a513f913ef43476bd2b494da4e599cbc.jpg"
    ) {
      Swal.fire({
        icon: "error",
        title: "Imagen no seleccionada",
        text: `Elige una imagen para continuar`,
        customClass: {
          confirmButton: "btn-confirm",
          cancelButton: "btn-cancel",
          denyButton: "btn-deny",
        },
      });
    } else {
      if (!selectedFile) {
        Swal.fire({
          icon: "error",
          title: "Imagen no seleccionada",
          text: `Elige una imagen para continuar`,
          customClass: {
            confirmButton: "btn-confirm",
            cancelButton: "btn-cancel",
            denyButton: "btn-deny",
          },
        });
        return;
      }

      setLoadPost(true);

      const formData = new FormData();

      // Agregar los datos del dueño como un Blob para que el backend lo procese correctamente
      const duenoData = new Blob(
        [
          JSON.stringify({
            email: userS.email,
            password: userS.passw,
            nombreCompleto: userS.name,
          }),
        ],
        { type: "application/json" }
      );

      formData.append("dueno", duenoData); // ✅ Ahora es un Blob con tipo JSON
      formData.append("imagen", selectedFile); // ✅ Archivo correctamente adjuntado

      try {
        const response = await axios.post(`${api_url}/api/duenos`, formData, {
          headers: {
            // "Content-Type": "multipart/form-data",
          },
        });
        console.log("Respuesta del servidor:", response.data);
        Swal.fire({
          icon: "success",
          title: "¡OK!",
          text: `Usuario creado exitosamente`,
          customClass: {
            confirmButton: "btn-confirm",
            cancelButton: "btn-cancel",
            denyButton: "btn-deny",
          },
        }).then(() => {
          window.location.reload();
        });
      } catch (error) {
        console.error("Error al subir:", error.response?.data || error.message);
        Swal.fire({
          icon: "error",
          title: "¡Error de registro!",
          text: `${
            error.response.data.message
              ? error.response.data.message
              : "Ocurrió un error inesperado, intentalo nnuevamente"
          }`,
          customClass: {
            confirmButton: "btn-confirm",
            cancelButton: "btn-cancel",
            denyButton: "btn-deny",
          },
        });
      } finally {
        setLoadPost(false);
      }
    }
    setUserS({ email: "", passw: "", name: "", pass2: "", img: "" });
    e.target.reset();
    setEmptyField("");
  };

  const swapScreen1 = () => {
    const container = document.getElementById("container");

    container.classList.add("right-panel-active");
  };

  const swapScreen2 = () => {
    const container = document.getElementById("container");

    container.classList.remove("right-panel-active");
  };

  return (
    <div className="container" id="container">
      <div className="form-container sign-up-container">
        <form onSubmit={handleSubmit2}>
          <h3 className="bld">Crea tu Cuenta</h3>
          <div className="input-containere">
            <i className="fa fa-user icon" aria-hidden="true" id="orange"></i>
            <input
              type="text"
              name="name"
              required
              placeholder="Nombre"
              className="inp"
              onInput={handleChangeName}
            />
          </div>
          <div className="input-containere">
            <i className="fa fa-envelope icon" aria-hidden="true" id="red"></i>
            <input
              type="email"
              name="email"
              required
              placeholder="Correo electrónico"
              className="inp"
              onInput={handleChangeMail}
            />
          </div>
          <div className="input-containere">
            <i className="fa fa-lock icon" aria-hidden="true" id="orange"></i>
            <input
              type="password"
              name="passw"
              required
              placeholder="Contraseña"
              className="inp"
              onInput={handleChangePass}
            />
          </div>
          <div className="input-containere">
            <i className="fa fa-lock icon" aria-hidden="true" id="red"></i>
            <input
              type="password"
              name="pass2"
              required
              placeholder="Confirmar contraseña"
              className="inp"
              onInput={handleChangePass2}
            />
          </div>
          {!loadPost ? (
            <button type="submit" id="sendSignup">
              Crear cuenta
            </button>
          ) : (
            <div className="my-spinner mt-3"></div>
          )}
        </form>
      </div>
      <div className="form-container sign-in-container">
        <form onSubmit={handleSubmit1}>
          <h3 className="bld">Iniciar Sesión</h3>
          <div className="input-containere">
            <i className="fa fa-user icon" aria-hidden="true" id="red"></i>
            <input
              type="email"
              name="email1"
              required
              placeholder="Correo electónico"
              className="inp"
              id="mail1"
              onInput={handleChangeMailL}
            />
          </div>
          <div className="input-containere">
            <i className="fa fa-lock icon" aria-hidden="true" id="red"></i>
            <input
              type="password"
              name="pswrd1"
              required
              placeholder="Contraseña"
              className="inp"
              id="pass1"
              onInput={handleChangePassL}
            />
          </div>

          <a onClick={() => cambiarComponente("B")} className="loginLink">
            ¿Olvidaste tu contraseña?
          </a>
          {!isLoading ? (
            <button type="submit" id="sendLogin">
              Acceder
            </button>
          ) : (
            <div className="my-spinner mt-3"></div>
          )}
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <div className="signup-picture">
              <div className="foto">
                <img src={preview} alt="Foto de perfil nueva" id="selPict" />
                <Tooltip title="Elegir una imagen">
                  <div className="botonDiv">
                    <input
                      type="file"
                      className="botonCam"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <i className="fa fa-camera"></i>
                  </div>
                </Tooltip>
              </div>
              <p className="Pdesc justificado">
                Regístrate aquí, y registra a tu equipo posteriormente, espera
                la respuesta de los administradores para ingresar a tu equipo a
                los torneos de la liguilla.
              </p>
            </div>
            <button className="ghost" id="signIn" onClick={swapScreen2}>
              Inicia sesión
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <img src={miImagen} alt="Logo del sistema" className="logoSis" />
            <h3 className="whiteText">¿Aún no tienes cuenta?</h3>
            <button className="ghost" id="signUp" onClick={swapScreen1}>
              Registrate
            </button>
            <a href="/" className="loginLink">
              Volver
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Access;
