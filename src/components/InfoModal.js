import React from 'react';

export default function InfoModal({ visible, data, onClose }) {
  if (!visible || !data) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Información del Tóner</h3>
        <p><strong>Sucursal:</strong> {data.sucursal}</p>
        <p><strong>Modelo:</strong> {data.modelo}</p>
        <p><strong>Tipo:</strong> {data.tipo}</p>
        <p><strong>Último cambio:</strong> {data.fecha_ultimo_cambio || 'No registrado'}</p>
        <p><strong>Toner de reserva:</strong> {data.toner_reserva || 0}</p>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
