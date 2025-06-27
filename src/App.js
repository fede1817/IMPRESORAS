import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [impresoras, setImpresoras] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    ip: '',
    sucursal: '',
    modelo: '',
    drivers_url: '',
    tipo: 'principal'
  });

  useEffect(() => {
    fetch('http://localhost:3001/api/toners')
      .then(res => res.json())
      .then(data => setImpresoras(data.impresoras || []))
      .catch(err => console.error('Error al obtener datos:', err));
  }, []);

  const getBarClass = (value) => {
    if (value === null || value < 0) return 'toner-bar low';
    if (value <= 20) return 'toner-bar low';
    if (value <= 40) return 'toner-bar medium';
    return 'toner-bar high';
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3001/api/impresoras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setShowModal(false);
      window.location.reload();
    } catch (err) {
      console.error('Error al agregar impresora:', err);
    }
  };

  return (
    <div className="App dark-mode">
      <h1>Estado de las impresoras Ricoh</h1>

      <h2>🖨️ Impresoras Principales</h2>
      <button className="add-btn" onClick={() => setShowModal(true)}>➕ Agregar Impresora</button>

      <table className="dark-table">
        <thead>
          <tr>
            <th>IP</th>
            <th>Sucursal</th>
            <th>Modelo</th>
            <th>Nivel de Tóner Negro</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {impresoras.filter(i => i.tipo === 'principal').map((impresora, index) => (
            <tr key={`principal-${index}`}>
              <td>
                <a href={`http://${impresora.ip}`} target="_blank" rel="noopener noreferrer">
                  {impresora.ip}
                </a>
              </td>
              <td>{impresora.sucursal}</td>
              <td>
                <a href={impresora.drivers_url} target="_blank" rel="noopener noreferrer">
                  {impresora.modelo}
                </a>
              </td>
              <td>
                {impresora.toner !== null && impresora.toner >= 0 ? (
                  <div className="t-toner-bar-container">
                    <div
                      className={getBarClass(impresora.toner)}
                      style={{ width: `${impresora.toner}%` }}
                    ></div>
                    <div className="toner-text">{impresora.toner}%</div>
                  </div>
                ) : 'No disponible'}
              </td>
              <td>{impresora.error ? '❌ Error' : '✅ OK'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>📄 Impresoras Backup</h2>
      <table className="dark-table">
        <thead>
          <tr>
            <th>IP</th>
            <th>Sucursal</th>
            <th>Modelo</th>
            <th>Nivel de Tóner Negro</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {impresoras.filter(i => i.tipo === 'backup').map((impresora, index) => (
            <tr key={`backup-${index}`}>
              <td>
                <a href={`http://${impresora.ip}`} target="_blank" rel="noopener noreferrer">
                  {impresora.ip}
                </a>
              </td>
              <td>{impresora.sucursal}</td>
              <td>
                <a href={impresora.drivers_url} target="_blank" rel="noopener noreferrer">
                  {impresora.modelo}
                </a>
              </td>
              <td>
                {impresora.toner !== null && impresora.toner >= 0 ? (
                  <div className="t-toner-bar-container">
                    <div
                      className={getBarClass(impresora.toner)}
                      style={{ width: `${impresora.toner}%` }}
                    ></div>
                    <div className="toner-text">{impresora.toner}%</div>
                  </div>
                ) : 'No disponible'}
              </td>
              <td>{impresora.error ? '❌ Error' : '✅ OK'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Agregar nueva impresora</h2>
            <form onSubmit={handleSubmit}>
              <input name="ip" placeholder="IP" value={formData.ip} onChange={handleInputChange} required />
              <input name="sucursal" placeholder="Sucursal" value={formData.sucursal} onChange={handleInputChange} required />
              <input name="modelo" placeholder="Modelo" value={formData.modelo} onChange={handleInputChange} required />
              <input name="drivers_url" placeholder="URL de Drivers" value={formData.drivers_url} onChange={handleInputChange} required />
              <select name="tipo" value={formData.tipo} onChange={handleInputChange}>
                <option value="principal">Principal</option>
                <option value="backup">Backup</option>
              </select>
              <div className="form-buttons">
                <button type="submit">Guardar</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
