import React, { useState, useEffect } from 'react';

export default function Admin2() {
  const week = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  // Función para agregar ceros a la izquierda
  const zeroPadding = (num, digit) => {
    return String(num).padStart(digit, '0');
  };

  // useEffect se encarga de actualizar la hora cada segundo
  useEffect(() => {
    function updateTime() {
      const now = new Date();
      setTimeStr(
        `${zeroPadding(now.getHours(), 2)}:${zeroPadding(now.getMinutes(), 2)}:${zeroPadding(now.getSeconds(), 2)}`
      );
      setDateStr(
        `${now.getFullYear()}-${zeroPadding(now.getMonth() + 1, 2)}-${zeroPadding(now.getDate(), 2)} ${week[now.getDay()]}`
      );
    }

    updateTime(); // Inicializa con el valor actual
    const intervalId = setInterval(updateTime, 1000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []); // Se ejecuta una sola vez al montar el componente

  return (
    <div>
      <div className="clock">
        <h2 className="date">{dateStr}</h2>
        <h2 className="time">{timeStr}</h2>
      </div>
    </div>
  );
}