import React from 'react';

export default function PrinterForm({
 formData, onChange, onSubmit, onCancel
}) {
  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="ip" value={formData.ip} onChange={onChange} placeholder="IP" required />
      <input type="text" name="sucursal" value={formData.sucursal} onChange={onChange} placeholder="Sucursal" required />
      <input type="text" name="modelo" value={formData.modelo} onChange={onChange} placeholder="Modelo" required />
      <input type="text" name="drivers_url" value={formData.drivers_url} onChange={onChange} placeholder="URL de drivers" />
      <select name="tipo" value={formData.tipo} onChange={onChange}>
        <option value="principal">Principal</option>
        <option value="backup">Backup</option>
      </select>
      <input type="number" name="toner_reserva" value={formData.toner_reserva} onChange={onChange} placeholder="Toner de reserva" />
      <div className="modal-buttons">
        <button type="submit">Guardar</button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}
