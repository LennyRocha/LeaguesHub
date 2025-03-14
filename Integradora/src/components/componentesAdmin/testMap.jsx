import React, { useEffect, useState } from "react";
import axios from "axios";

const hereApiKey = import.meta.env.VITE_HERE_MAPS_API_KEY;

const TestMap = () => {
  const [map, setMap] = useState(null);
  const [ui, setUi] = useState(null);
  const [marker, setMarker] = useState(null);
  const [userMarker, setUserMarker] = useState(null);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [sidebar, setSidebar] = useState(null);

  useEffect(() => {
    const platform = new window.H.service.Platform({ apikey: hereApiKey });
    const defaultLayers = platform.createDefaultLayers();

    const mapContainer = document.getElementById("here-map");
    if (!mapContainer) return;

    const newMap = new window.H.Map(
      mapContainer,
      defaultLayers.vector.normal.map,
      {
        center: { lat: 19.4326, lng: -99.1332 },
        zoom: 12,
      }
    );

    const behavior = new window.H.mapevents.Behavior(
      new window.H.mapevents.MapEvents(newMap)
    );
    const newUi = window.H.ui.UI.createDefault(newMap, defaultLayers);

    setMap(newMap);
    setUi(newUi);
    getUserLocation(newMap);

    return () => newMap.dispose();
  }, []);

  const getUserLocation = (newMap) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        placeMarker(latitude, longitude, "Tu ubicación", true);
        newMap.setCenter({ lat: latitude, lng: longitude });
      });
    }
  };

  const placeMarker = (lat, lng, title = "Ubicación seleccionada", isUser = false) => {
    if (!map) return;

    if (isUser) {
      if (userMarker) map.removeObject(userMarker);
      const newUserMarker = new window.H.map.Marker(new window.H.geo.Point(lat, lng), {
        icon: new window.H.map.Icon("https://maps.google.com/mapfiles/ms/icons/blue-dot.png"),
      });
      map.addObject(newUserMarker);
      setUserMarker(newUserMarker);
      return;
    }

    if (marker) map.removeObject(marker);
    const newMarker = new window.H.map.Marker(new window.H.geo.Point(lat, lng));
    newMarker.setData(title);
    newMarker.addEventListener("tap", (evt) => showSidebar(evt.target.getData()));
    map.addObject(newMarker);
    setMarker(newMarker);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (query.length > 2) {
      const res = await axios.get(
        `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${query}&apikey=${hereApiKey}`
      );
      setSuggestions(res.data.items);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = async (place) => {
    const res = await axios.get(
      `https://geocode.search.hereapi.com/v1/geocode?q=${place.title}&apikey=${hereApiKey}`
    );
    const { lat, lng } = res.data.items[0].position;
    placeMarker(lat, lng, place.title);
    setSearch(place.title);
    setSuggestions([]);
  };

  const showSidebar = (info) => {
    setSidebar(info);
  };

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Buscar ubicación..."
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />
      <ul>
        {suggestions.map((s) => (
          <li key={s.id} onClick={() => handleSelect(s)}>
            {s.title}
          </li>
        ))}
      </ul>
      <div id="here-map" style={{ width: "100%", height: "400px", backgroundColor: "lightgray" }}></div>
      <button onClick={() => placeMarker(19.4326, -99.1332, "CDMX")}>📍 Poner marcador en CDMX</button>
      {sidebar && <div className="sidebar">📍 {sidebar}</div>}
    </div>
  );
};

export default TestMap;