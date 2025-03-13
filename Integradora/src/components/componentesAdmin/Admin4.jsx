import React, { useEffect, useState } from "react";
import axios from "axios";
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
import { Edit, Delete, Map } from "@mui/icons-material";
import Swal from "sweetalert2";

const hereApiKey = import.meta.env.VITE_HERE_MAPS_API_KEY;

export default function Admin4() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [location, setLocation] = useState({ lat: 19.4326, lng: -99.1332 }); // CDMX

  const data = [
    {
      id: 1,
      name: "The Field",
      dir: "Av sin esquinas s/n",
      canchas: 3,
      lat: 18.852205,
      lon: -99.201187,
    },
    {
      id: 2,
      name: "Deportivo Galaxy",
      dir: "Calle pollo #12",
      canchas: 4,
      lat: 18.852461,
      lon: -99.20014,
    },
    {
      id: 3,
      name: "Campo el rayo",
      dir: "Blvd of broken dreams",
      canchas: 9,
      lat: 18.851852,
      lon: -99.200673,
    },
    {
      id: 4,
      name: "Footbalistica",
      dir: "Calle cuaderno #21",
      canchas: 5,
      lat: 18.851132,
      lon: -99.200403,
    },
    {
      id: 5,
      name: "El Rayo",
      dir: "Av Acatlipa #02",
      canchas: 1,
      lat: 18.85005,
      lon: -99.201182,
    },
    {
      id: 6,
      name: "El campo cascarudo",
      dir: "Calle concha s/n",
      canchas: 5,
      lat: 18.849287,
      lon: -99.201373,
    },
    {
      id: 7,
      name: "Estadio Azteca",
      dir: "México",
      canchas: 1,
      lat: 18.849643,
      lon: -99.200279,
    }, // Ciudad de México
  ];

  // Función para obtener sugerencias de direcciones
  const handleSearch = async (query) => {
    setSearch(query);
    if (query.length > 2) {
      const res = await axios.get(
        `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${query}&apiKey=${hereApiKey}`
      );
      setSuggestions(res.data.items);
    } else {
      setSuggestions([]);
    }
  };

  // Función para seleccionar un lugar y obtener coordenadas
  const handleSelect = async (place) => {
    const res = await axios.get(
      `https://geocode.search.hereapi.com/v1/geocode?q=${place.title}&apiKey=${hereApiKey}`
    );
    const { lat, lng } = res.data.items[0].position;
    setLocation({ lat, lng });
    setSearch(place.title);
    setSuggestions([]);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://js.api.here.com/v3/3.1/mapsjs-core.js`;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <div className="container-fluid">
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h2 className="mb-0">Menú de campos</h2>
        </div>
      </div>
      <div className="container-fluid table-overflow">
        <TableContainer component={Paper}>
          <Table>
            <TableHead className="myThead">
              <TableRow>
                <TableCell className="cell">Id</TableCell>
                <TableCell className="cell">Nombre</TableCell>
                <TableCell className="cell">Dirección</TableCell>
                <TableCell className="cell">Canchas</TableCell>
                <TableCell className="cell">Opciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((d) => {
                return (
                  <TableRow key={d.id}>
                    <TableCell>{d.id}</TableCell>
                    <TableCell>{d.name}</TableCell>
                    <TableCell>{d.dir}</TableCell>
                    <TableCell>{d.canchas}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => onEdit(d)}>
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton onClick={() => onDelete(d.id)}>
                        <Delete color="error" />
                      </IconButton>
                      <IconButton onClick={() => setLocation({lat: d.lat, lng: d.lon})}>
                        <Map color="success" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="col-lg-6"></div>
      <div className="col-lg-6"></div>
      <input
        type="text"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Buscar dirección..."
      />
      <ul className="suggestions-list">
        {suggestions.map((place) => (
          <li key={place.id} onClick={() => handleSelect(place)}>
            {place.title}
          </li>
        ))}
      </ul>
      <iframe
        title="HERE Map"
        width="100%"
        height="400"
        className="map-frame"
        src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
      />
    </div>
  );
}
