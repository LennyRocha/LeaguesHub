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
  Tooltip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { TextField, InputAdornment } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Swal from "sweetalert2";
import "bootstrap";
import Banner1 from "../../assets/templates/Banner1.png";
import Poster1 from "../../assets/templates/Publicidad1.png";

export default function Admin7() {
  return (
    <div>
      <div className="container-fluid">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h2 className="mb-0">Nueva Convocatoria</h2>
        </div>
        <div className="row">
          <div className="col-lg-8 div-margin">
            <div className="bg-light form-div">
              <form>
                <TextField
                  fullWidth
                  label="Nombre del torneo"
                  className="txtAr txtCon mb-2"
                />
                <div className="rowInp">
                  <TextField
                    type="date"
                    fullWidth
                    inputProps={{ min: new Date().toLocaleDateString("sv-SE") }}
                    className="txtAr txtCon mb-2"
                  />
                  <TextField
                    type="number"
                    fullWidth
                    label="Equipos en liguilla"
                    className="txtAr txtCon mb-2"
                  />
                </div>
                <TextField
                  fullWidth
                  label="Premio"
                  className="txtAr txtCon mb-2"
                />
                <TextField
                  label="Descripción"
                  multiline
                  rows={6} // Número fijo de filas
                  fullWidth
                  className="txtAr txtCon mb-2"
                />
                <div className="button-group">
                  <button className="slide-btn">Previsualizar</button>
                  <button className="slide-btn">Cancelar</button>
                  <button className="slide-btn">Crear</button>
                </div>
              </form>
            </div>
          </div>
          <div className="col-lg-4 div-margin">
            <h5 className="mb-1">Vista vértical</h5>
            <img
              src={Poster1}
              alt="BannerPlantilla"
              className="img-fluid d-block w-100"
            />
          </div>
          <div className="d-sm-flex align-items-center justify-content-between mb-4">
            <h3 className="mb-0 mt-1">Vista horizontal</h3>
          </div>
          <img
            src={Banner1}
            alt="PosterPlantilla"
            className="img-fluid d-block w-100"
          />
        </div>
      </div>
    </div>
  );
}
