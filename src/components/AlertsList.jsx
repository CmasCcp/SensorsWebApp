import React, { useEffect, useState } from 'react';

/**
 * AlertsList
 * - Reads alerts from backend endpoint /listarAlertas
 * - Displays alerts as square cards with pulsing green indicators
 * - Allows exporting to JSON and refreshing the list
 *
 * Usage: import AlertsList from '../components/AlertsList'; <AlertsList />
 */

const AlertsList = () => {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadAlerts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/listarAlertas`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      
      // Asumir que el backend devuelve un array de alertas o un objeto con propiedad 'data'
      const alertsData = Array.isArray(data) ? data : (data.data || data.alerts || []);
      setAlerts(alertsData);
    } catch (err) {
      console.error('Error cargando alertas desde el backend:', err);
      setError(err.message);
      setAlerts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const refresh = () => loadAlerts();

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
          }
          .pulse-animation {
            animation: pulse 1.5s infinite;
          }
        `}
      </style>
      <div className="card my-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            Alertas del Backend 
            {isLoading && <span className="spinner-border spinner-border-sm ms-2" role="status"></span>}
          </h5>
        <div>
          <button 
            className="btn btn-sm btn-outline-primary me-2" 
            disabled={isLoading}
            onClick={() => {
              const payload = JSON.stringify(alerts, null, 2);
              const blob = new Blob([payload], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              const now = new Date();
              const pad = (n) => String(n).padStart(2, '0');
              const filename = `alerts-backend-${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}.json`;
              a.href = url;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
          >
            Exportar JSON
          </button>
          <button 
            className="btn btn-sm btn-outline-secondary" 
            onClick={refresh}
            disabled={isLoading}
          >
            Refrescar
          </button>
        </div>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger" role="alert">
            <strong>Error:</strong> {error}
            <button 
              className="btn btn-sm btn-outline-secondary ms-2" 
              onClick={() => setError(null)}
            >
              Cerrar
            </button>
          </div>
        )}
        
        {isLoading && (
          <div className="text-center py-4">
            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
            Cargando alertas...
          </div>
        )}
        
        {!isLoading && alerts.length === 0 && (
          <div className="text-center py-4">
            <p className="text-muted mb-0">
              {error ? 'Error cargando alertas' : 'No hay alertas guardadas'}
            </p>
          </div>
        )}

        {!isLoading && alerts.length > 0 && (
          <div className="row">
            {alerts.map(a => (
              <div key={a.id} className="card px-0 pt-0">
                  <div className="card-header d-flex justify-content-between align-items-center py-2">
                    <small className="text-muted text-truncate" title={a.id}>
                      {a.id.substring(0, 15)}...
                    </small>
                    {a.active && (
                      <div 
                        className="rounded-circle bg-success pulse-animation" 
                        style={{ 
                          width: '12px', 
                          height: '12px'
                        }}
                        title="Activa"
                      ></div>
                    )}
                    {!a.active && (
                      <div 
                        className="rounded-circle bg-secondary" 
                        style={{ width: '12px', height: '12px' }}
                        title="Inactiva"
                      ></div>
                    )}
                  </div>
                  
                  <div className="card-body d-flex flex-column p-3">
                    
                    <div className="mb-2">
                      <small className="text-muted d-block">Proyecto:</small>
                      <span className="text-dark">
                      {a.projectLabel ?? a.projectId}
                        </span>
                    </div>

                    <div className="mb-2">
                      <small className="text-muted d-block">Tipo:</small>
                      <span className="badge bg-info text-dark">{a.ruleType}</span>
                    </div>
                    
                    <div className="mb-2">
                      <small className="text-muted d-block">Validación:</small>
                      <small className="fw-bold">{a.validationId}</small>
                    </div>
                    
                    {a.parameter && (
                      <div className="mb-2">
                        <small className="text-muted d-block">Parámetro:</small>
                        <small className="text-dark">{a.parameter}</small>
                      </div>
                    )}
                    
                    {a.config && Object.keys(a.config).length > 0 && (
                      <div className="mb-2">
                        <small className="text-muted d-block">Configuración:</small>
                        <div className="bg-light p-2 rounded" style={{ fontSize: '10px', maxHeight: '80px', overflowY: 'auto' }}>
                          <pre className="mb-0">{JSON.stringify(a.config, null, 1)}</pre>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-auto">
                      {a.email && a.email.length > 0 && (
                        <div className="mb-2">
                          <small className="text-muted d-block">Emails:</small>
                          <small className="text-dark">{a.email.slice(0, 2).join(', ')}{a.email.length > 2 ? '...' : ''}</small>
                        </div>
                      )}
                    </div>
                  </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
    </>
  );
};

export default AlertsList;
