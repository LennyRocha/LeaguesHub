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
import { Edit, Delete } from "@mui/icons-material";
import Swal from "sweetalert2";

const onEdit = (arbitro) => {
  console.log("Editando ", arbitro);
};

const onDelete = (arbitro) => {
  console.log("Eliminando ", arbitro);
};

//Arbitros
export default function Admin5() {
  const [accion, setAccion] = useState("Agregar árbitro");
  const [preview, setPreview] = useState(
    "https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
  );

  function submitArbitro(e) {
    e.preventDefault();
    Swal.fire({
      icon: "success",
      title: "Datos guardados:",
      text: `Arbitro guardado con éxito`,
      customClass: {
        confirmButton: 'btn-confirm',
        cancelButton: 'btn-cancel',
        denyButton: 'btn-deny'
      }
    });
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      console.log(file.name);
    }
  };

  useEffect(() => {
    document.getElementById("btnCam").removeAttribute("title");
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
              <h5 className="m-0 font-weight-bold ml-2">{accion}</h5>
            </div>
            <div className="arbitro-card">
              <form onSubmit={(e) => submitArbitro(e)}>
                <div className="fotoContainer">
                  <img className="img-fluid img" src={preview} alt="..." />
                  <Tooltip title="Elegir una imagen">
                    <div className="botonDiv">
                      <i className="fa fa-camera"></i>
                      <input
                        type="file"
                        className="botonCam"
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
                />
                <TextField
                  className="txtAr"
                  type="email"
                  label="Correo electrónico"
                  fullWidth
                  margin="dense"
                  name="correo"
                  required
                  id="arbMail"
                />
                <TextField
                  className="txtAr"
                  type="password"
                  label="Contraseña"
                  fullWidth
                  margin="dense"
                  name="contra"
                  required
                  id="arbPass1"
                />
                <TextField
                  className="txtAr"
                  type="password"
                  label="Correo electrónico"
                  fullWidth
                  margin="dense"
                  name="contra2"
                  required
                  id="arbPass2"
                />
                <button type="submit" id="submitArb">
                  Registrar
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <TableContainer component={Paper}>
            <Table>
              <TableHead className="myThead">
                <TableRow>
                  <TableCell className="cell">Id</TableCell>
                  <TableCell className="cell">Nombre</TableCell>
                  <TableCell className="cell">Correo</TableCell>
                  <TableCell className="cell">Partidos</TableCell>
                  <TableCell className="cell">Opciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell className="no-cell">1</TableCell>
                  <TableCell className="no-cell">Nombre 1</TableCell>
                  <TableCell className="no-cell">arbitro1@gmail.com</TableCell>
                  <TableCell className="no-cell">5</TableCell>
                  <TableCell>
                    {/* <IconButton
                      onClick={() => {
                        setAccion(
                          accion == "Editar árbitro"
                            ? "Agregar árbitro"
                            : "Editar árbitro"
                        );
                      }}
                    >
                      <Edit color="primary" />
                    </IconButton> */}
                    <IconButton onClick={() => onDelete(user.id)}>
                      <Delete color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
                {/* {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.precio}</TableCell>
                    <TableCell>{user.desc}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => onEdit(user)}>
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton onClick={() => onDelete(user.id)}>
                        <Delete color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))} */}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}
