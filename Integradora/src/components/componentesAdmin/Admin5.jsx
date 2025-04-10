import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import userPlace from "../../assets/images/user-placeholder.png";
import { Edit, Delete } from "@mui/icons-material";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

//Arbitros
export default function Admin5() {
  const [reload, setReload] = useState(false);
  const { getUserId, getUserRole, getToken, logout, api_url, getUrl } =
    useContext(AuthContext);
  const [tokData, setTokData] = useState("");
  const [arbitros, setArbitros] = useState([]);
  const [loadArb, setLoadArb] = useState(false);
  const [fallo1, setFallo1] = useState("");

  const [image, setImage] = useState(null);
  const [loadBtn, setLoadBtn] = useState(false);

  const [loadArbit, setLoadArbit] = useState(false);
  const [fallo2, setFallo2] = useState("");

  //esquema para validaciones
  const arbitro = yup.object().shape({
    nombreCompleto: yup.string().required("El nombre es requerido"),
    email: yup
      .string()
      .email("Formato de correo inválido")
      .required("El correo es requerido"),
    password: yup.string().required("Contraseña requerida"),
    password2: yup
      .string()
      .required("Confirma tu contraseña")
      .oneOf([yup.ref("password"), null], "Las contraseñas no coinciden"),
  });

  //conectar el schema con el form
  const [errorss, setErrors] = useState({});
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors, isValid },
  } = useForm({ resolver: yupResolver(arbitro), mode: "onChange" });

  const desactivarArbitro = async (id, name) => {
    try {
      const tokData = await getToken();
      const res = await axios.put(
        `${api_url}/api/arbitros/cambiarEstatus/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${tokData}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Swal.fire({
      //   icon: "success",
      //   title: "¡Exito!",
      //   text: res.data || "Operación exitosa",
      //   confirmButtonText: "Aceptar",
      //   customClass: {
      //     confirmButton: "btn-confirm",
      //     cancelButton: "btn-cancel",
      //     denyButton: "btn-deny",
      //   },
      // });
      setReload(!reload);
    } catch (err) {
      console.error(err);
      if (err.response.status === 400) {
        Swal.fire({
          icon: "error",
          title: "¡Denegado!",
          text:
            err.response?.data?.message || `No se pudo deshabilitar a ${name}`,
          confirmButtonText: "Aceptar",
          customClass: {
            confirmButton: "btn-confirm",
            cancelButton: "btn-cancel",
            denyButton: "btn-deny",
          },
        });
        return;
      }
      if (err.response.status === 403) {
        console.log("⚠️ Token expirado, redirigiendo a login...");
        Swal.fire({
          icon: "warning",
          title: "¡Denegado!",
          text: "Su sesión ha expirado, ingrese sesión nuevamente para continuar",
          confirmButtonText: "Aceptar",
          customClass: {
            confirmButton: "btn-confirm",
            cancelButton: "btn-cancel",
            denyButton: "btn-deny",
          },
        }).then((resutlt) => logout());
        return;
      }
    }
  };

  useEffect(() => {
    const getAbritros = async () => {
      const id = await getUserRole();
      const rolo = await getUserId();
      const tok = await getToken();
      setTokData(tok);

      setLoadArb(true);
      axios
        .get(`${api_url}/api/arbitros`, {
          headers: {
            Authorization: `Bearer ${tok}`,
          },
        })
        .then((res) => {
          if (res.data.length === 0) setFallo1("No hay árbitros registrados");
          else setArbitros(res.data);
        })
        .catch((e) => {
          console.error(e, e.response.message, e.res.code);
          if (e.response.status === 403) {
            console.log("⚠️ Token expirado, redirigiendo a login...");
            Swal.fire({
              icon: "warning",
              title: "¡Denegado!",
              text: "Su sesión ha expirado, ingrese sesión nuevamente para continuar",
              confirmButtonText: "Aceptar",
              customClass: {
                confirmButton: "btn-confirm",
                cancelButton: "btn-cancel",
                denyButton: "btn-deny",
              },
            }).then((resutlt) => logout());
            return;
          }
          if (e.response.message) Alert.alert("Error", e.response.message);
          Alert.alert("Error", "Error al obtener árbitros");
        })
        .finally(() => setLoadArb(false));
    };
    getAbritros();
  }, [reload]);

  const [accion, setAccion] = useState("Agregar árbitro");
  const [preview, setPreview] = useState(userPlace);

  async function submitArbitro(data, image) {
    setLoadArbit(true);
    try {
      const formData = new FormData();
      const duenoData = new Blob(
        [
          JSON.stringify({
            email: data.email,
            password: data.password,
            nombreCompleto: data.nombreCompleto,
          }),
        ],
        { type: "application/json" }
      );

      formData.append("arbitro", duenoData);
      formData.append("imagen", selectedFile);
      const response = await axios.post(`${api_url}/api/arbitros`, formData, {
        headers: {
          // "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${tokData}`,
        },
      });
      Swal.fire({
        icon: "success",
        title: "¡OK!",
        text: `Usuario creado exitosamente`,
        customClass: {
          confirmButton: "btn-confirm",
          cancelButton: "btn-cancel",
          denyButton: "btn-deny",
        },
      });
      reset();
      clearErrors();
      setPreview(userPlace);
      setSelectedFile(null);
      setReload(!reload);
    } catch (err) {
      console.error(err);
      if (err.response) {
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
      if (err.response.status === 403) {
        console.log("⚠️ Token expirado, redirigiendo a login...");
        Swal.fire({
          icon: "warning",
          title: "¡Denegado!",
          text: "Su sesión ha expirado, ingrese sesión nuevamente para continuar",
          confirmButtonText: "Aceptar",
          customClass: {
            confirmButton: "btn-confirm",
            cancelButton: "btn-cancel",
            denyButton: "btn-deny",
          },
        }).then((resutlt) => logout());
        return;
      }
    } finally {
      setLoadArbit(false);
    }
  }

  const onSubmit = async (data) => {
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

    await submitArbitro(data, selectedFile);
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const btnCam = document.getElementById("btnCam");
    if (btnCam) btnCam.removeAttribute("title");
  }, []);

  return (
    <div className="container-fluid">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h2 className="mb-0">Menú de árbitros</h2>
      </div>
      <div className="row">
        <div className="col-lg-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3 bg-red">
              <p className=" font-weight-bold body-small text-white ml-1">
                {accion}
              </p>
            </div>
            <div className="arbitro-card">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="fotoContainer">
                  <img className="img-fluid img my-img" src={preview} alt="..." />
                  <Tooltip title="Elegir foto">
                    <div className="botonDiv-2">
                      <i className="fa fa-images"></i>
                      <input
                        type="file"
                        className="botonCamArb"
                        accept="image/*"
                        onChange={handleFileChange}
                        id="btnCam"
                      />
                    </div>
                  </Tooltip>
                </div>
                <TextField
                  className="txtAr"
                  label="Nombre completo"
                  fullWidth
                  margin="dense"
                  name="nombre"
                  required
                  id="arbName"
                  {...register("nombreCompleto")}
                />
                {errors.nombreCompleto && (
                  <p className="text-danger">{errors.nombreCompleto.message}</p>
                )}
                <TextField
                  className="txtAr"
                  type="email"
                  label="Correo electrónico"
                  fullWidth
                  margin="dense"
                  name="correo"
                  required
                  id="arbMail"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-danger">{errors.email.message}</p>
                )}
                <TextField
                  className="txtAr"
                  type="password"
                  label="Contraseña"
                  fullWidth
                  margin="dense"
                  name="contra"
                  required
                  id="arbPass1"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-danger">{errors.password.message}</p>
                )}
                <TextField
                  className="txtAr"
                  type="password"
                  label="Confirmar contraseña"
                  fullWidth
                  margin="dense"
                  name="contra2"
                  required
                  id="arbPass2"
                  {...register("password2")}
                />
                {errors.password2 && (
                  <p className="text-danger">{errors.password2.message}</p>
                )}
                {loadArbit ? (
                  <div className="my-spinner"></div>
                ) : (
                  <button
                    type="submit"
                    id="submitArb"
                    disabled={!isValid}
                    className={!isValid ? "text-black opa-0" : "text-black"}
                  >
                    Registrar
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          {loadArb ? (
            <div className="centered-div w-100 cont">
              <div className="my-spinner"></div>
            </div>
          ) : fallo1 === "" ? (
            <TableContainer
              component={Paper}
              className="quitarScroll table-height"
            >
              <Table>
                <TableHead className="myThead2">
                  <TableRow>
                    <TableCell className="cell">#</TableCell>
                    <TableCell className="cell">Nombre</TableCell>
                    <TableCell className="cell">Correo</TableCell>
                    <TableCell className="cell">Estado</TableCell>
                    <TableCell className="cell">Opciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {arbitros.map((a, index) => (
                    <TableRow key={a.id}>
                      <TableCell className="no-cell">{index + 1}</TableCell>
                      <TableCell className="no-cell">
                        {a.nombreCompleto}
                      </TableCell>
                      <TableCell className="no-cell">
                        {a.usuario.email}
                      </TableCell>
                      <TableCell className="no-cell">
                        {a.usuario.estatus ? "Activo" : "Inactivo"}
                      </TableCell>
                      <TableCell>
                        <div className="switch-button">
                          <input
                            type="checkbox"
                            name="switch-button"
                            id={`switch-label-${index}`}
                            className="switch-button__checkbox"
                            checked={a.usuario.estatus}
                            onChange={async () =>
                              desactivarArbitro(a.id, a.nombreCompleto)
                            }
                          />
                          <label
                            htmlFor={`switch-label-${index}`}
                            className="switch-button__label"
                          ></label>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div className="w-100 align-items-center d-flex flex-column gap-1">
              <lord-icon
                id="input-icon-2"
                src="/icons/demanda.json"
                trigger="loop"
                stroke="bold"
                state="hover-swipe"
                colors="primary:#333333,secondary:#9A0000"
                style={{ width: "9em", height: "9em" }}
              ></lord-icon>
              <h5>{fallo1}</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
