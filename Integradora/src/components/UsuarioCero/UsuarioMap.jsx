import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow, Autocomplete } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "500px" };
const defaultCenter = { lat: 19.4326, lng: -99.1332 }; // Ciudad de México

const UsuarioMap = () => {
  const [map, setMap] = useState(null);
  const [position, setPosition] = useState(null);
  const [info, setInfo] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // 🔹 Obtener ubicación del usuario al cargar la página
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          console.error("No se pudo obtener la ubicación");
        }
      );
    }
  }, []);

  // 🔹 Manejar búsqueda en el input
  const onPlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places.length === 0) return;

      const place = places[0];
      setPosition({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
      setInfo({ name: place.name, address: place.formatted_address });
      map.panTo({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
    }
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={["places"]}>
      <div>
        {/* 🔍 Input de búsqueda */}
        <Autocomplete onLoad={setSearchBox} onPlaceChanged={onPlacesChanged}>
          <input
            type="text"
            placeholder="Buscar lugar..."
            style={{ width: "300px", padding: "10px", marginBottom: "10px" }}
          />
        </Autocomplete>

        {/* 📌 Botón para agregar un marcador en coordenadas específicas */}
        <button onClick={() => setPosition({ lat: 40.7128, lng: -74.006 })}>
          Mostrar Nueva York
        </button>

        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation || defaultCenter}
          zoom={12}
          onLoad={(map) => setMap(map)}
        >
          {/* 📍 Pin Azul - Ubicación Actual */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Pin azul de Google Maps
                scaledSize: new window.google.maps.Size(40, 40), // Tamaño del icono
              }}
            />
          )}

          {/* 📌 Marcador dinámico (ej. búsqueda o botón) */}
          {position && (
            <Marker position={position} onClick={() => setInfo({ name: "Ubicación seleccionada" })} />
          )}

          {/* ℹ️ InfoWindow (Sidebar) */}
          {info && (
            <InfoWindow position={position} onCloseClick={() => setInfo(null)}>
              <div>
                <h3>{info.name}</h3>
                {info.address && <p>{info.address}</p>}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default UsuarioMap;