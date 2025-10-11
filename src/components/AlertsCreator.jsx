import React, { useState, useEffect } from 'react';
import alertsAbstraction from '../helpers/alertsAbstraction.json';
import noVariables from '../helpers/noVariables.json';

/**
 * Simplified AlertsCreator modal
 * Props:
 * - projects: [{ value|id, label }]
 * - indicators: [string]
 * - onSave: function(alertObj)
 */

const AlertsCreator = ({ projects = [], indicators = [], onSave }) => {
    const [show, setShow] = useState(false);
    const getProjectValue = (p) => (p == null ? '' : (p.value ?? p.id ?? ''));
    const getProjectLabel = (p) => (p == null ? '' : (p.label ?? p.name ?? ''));

    const [projectId, setProjectId] = useState(projects.length > 0 ? getProjectValue(projects[0]) : '');
    const [indicator, setIndicator] = useState(indicators.length > 0 ? indicators[0] : '');
    const [ruleType, setRuleType] = useState('parametros');
    const [validationId, setValidationId] = useState('');
    const [configValues, setConfigValues] = useState({});
    const [active, setActive] = useState(true);
    const [message, setMessage] = useState(null);

    useEffect(() => { if (projects.length > 0 && !projectId) setProjectId(getProjectValue(projects[0])); }, [projects]);
    useEffect(() => { if (indicators.length > 0 && !indicator) setIndicator(indicators[0]); }, [indicators]);

    // when ruleType changes, reset validation & config
    useEffect(() => {
        setValidationId('');
        setConfigValues({});
    }, [ruleType]);

    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape' && show) setShow(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [show]);

    const validate = () => {
        if (!projectId) return 'Debe seleccionar un proyecto';
        if (ruleType === 'parametros' && !indicator) return 'Debe elegir un indicador';
        // check validation selected
        if (!validationId) return 'Debe seleccionar una validación';
        // basic config validation: if any config field required and empty, skip deep validation
        return null;
    };

    const handleSave = () => {
        const err = validate();
        if (err) { setMessage({ type: 'error', text: err }); return; }

        const projectObj = projects.find(p => String(getProjectValue(p)) === String(projectId));
        const alertObj = {
            id: `alert_${Date.now()}`,
            projectId,
            projectLabel: projectObj ? getProjectLabel(projectObj) : '',
            ruleType,
            validationId,
            parameter: ruleType === 'parametros' ? indicator : null,
            config: configValues,
            active
        };

        // persistir localmente
        const existing = JSON.parse(localStorage.getItem('alerts') || '[]');
        existing.push(alertObj);
        localStorage.setItem('alerts', JSON.stringify(existing));

        if (typeof onSave === 'function') onSave(alertObj);
        setMessage({ type: 'success', text: 'Alerta guardada' });
        setThreshold('');
        setComparator('>');
        setShow(false);
    };

    const handleClose = () => setShow(false);

    const getValidationsForRule = () => {
        if (ruleType === 'fecha_de_medicion') return alertsAbstraction.fecha_de_medicion?.validaciones || [];
        if (ruleType === 'parametros') return alertsAbstraction.parametros?.validaciones || [];
        return [];
    };

    const onChangeConfigField = (key, value) => {
        setConfigValues(prev => ({ ...prev, [key]: value }));
    };

    const renderConfigInputs = () => {
        const validations = getValidationsForRule();
        const v = validations.find(x => x.id === validationId);
        if (!v || !v.config) return null;
        const cfg = v.config;
        return (
            <div className="mb-3">
                <p><small>{v.descripcion}</small></p>
                <label className="form-label">Configuración</label>
                <div>
                    {Object.keys(cfg).map((key) => {
                        const val = cfg[key];
                        const current = configValues[key] ?? '';
                        if (Array.isArray(val)) {
                            return (
                                <div className="form-check mb-2" key={key}>
                                    <label className="form-label">{key}</label>
                                    <select className="form-select form-control" value={current} onChange={e => onChangeConfigField(key, e.target.value)}>
                                        {val.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                                    </select>
                                    {/* <input className="form-control" value={current} onChange={e => onChangeConfigField(key, e.target.value)} /> */}
                                </div>
                            );
                        }
                        if (typeof val === 'number') {
                            return (
                                <div className="form-check mb-2" key={key}>
                                    <label className="form-label">{key}</label>
                                    <input type="number" className="form-control" value={val} onChange={e => onChangeConfigField(key, Number(e.target.value))} />
                                </div>
                            );
                        }
                        if (typeof val === 'boolean') {
                            return (
                                <div className="form-check mb-2" key={key}>
                                    <input type="checkbox" className="form-check-input" checked={val} onChange={e => onChangeConfigField(key, e.target.checked)} />
                                    <label className="form-check-label">{key}</label>
                                </div>
                            );
                        }
                        if (val === 'parametro_izq' || val === 'parametro_der') {
                            return (
                                <div className="form-check mb-2" key={key}>
                                    <label className="form-label">Parámetro</label>
                                    <select className="form-select form-control" value={indicator} onChange={e => setIndicator(e.target.value)}>
                                        {indicators.map(ind => (<option key={ind} value={ind}>{ind}</option>))}
                                    </select>
                                </div>
                            );
                        }
                        // fallback: text
                        return (
                            <div className="form-check mb-2" key={key}>
                                <label className="form-label">{key}</label>
                                <input className="form-control" value={val} onChange={e => onChangeConfigField(key, e.target.value)} />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <>
            <button className="btn m-1 ml-auto custom-button" onClick={() => setShow(true)}>Crear alerta

                <span className="ml-2" role="img" aria-label="Alerta">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.964 0L.165 13.233c-.457.778.091 1.767.982 1.767h13.706c.89 0 1.438-.99.982-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                    </svg>
                </span>
            </button>

            <div
                className={`modal fade ${show ? 'show' : ''} px-2`}
                tabIndex="-1"
                role="dialog"
                style={{ display: show ? 'block' : 'none' }}
                aria-modal={show}
                onClick={handleClose}
            >
                <div className="modal-dialog modal-lg" role="document" onClick={e => e.stopPropagation()}>
                    <div className="modal-content">
                        <div className="modal-header d-flex flex-column w-100">
                            <h5 className="w-100 text-center">Crear alerta</h5>
                            <br />
                            <p>Las alertas se aplicarán a todos los dispositivos del proyecto y se aplicaran por cada uno de ellos.</p>
                            {/* <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button> */}
                        </div>
                        <div className="modal-body">
                            <div className="form-check mb-3">
                                <label className="form-label">Proyecto</label>
                                <input disabled className="form-select form-control" value={projects[0].label} onChange={e => setProjectId(e.target.value)}>
                                </input>
                            </div>

                            <div className="d-flex flex-row justify-content-around">
                                <div className="form-group mb-2">
                                    <label className="form-label">Tipo de regla</label>
                                    <select className="form-select form-control" value={ruleType} onChange={e => setRuleType(e.target.value)}>
                                        <option value="parametros">Parámetros</option>
                                        <option value="fecha_de_medicion">Fecha de medición</option>
                                    </select>
                                </div>

                                {ruleType === 'parametros' && (
                                    <div className="col-4 m-0">
                                        <label className="form-label">Parámetro</label>
                                        <select className="form-select form-control" value={indicator} onChange={e => setIndicator(e.target.value)}>
                                            <option value="">-- Seleccione --</option>
                                            {indicators.map(ind => (!noVariables.includes(ind) && <option key={ind} value={ind}>{ind}</option>))}
                                        </select>
                                    </div>
                                )}

                                <div className="col-md-4 mb-2">
                                    <label className="form-label">Validación</label>
                                    <select className="form-select form-control" value={validationId} onChange={e => { setValidationId(e.target.value); setConfigValues({}); }}>
                                        <option value="">-- Seleccione --</option>
                                        {getValidationsForRule().map(v => (
                                            <option key={v.id} value={v.id}>{v.nombre || v.id}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {renderConfigInputs()}

                            <div className="form-check form-switch my-2">
                                <input className="form-check-input" type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} id="alertActive" />
                                <label className="form-check-label" htmlFor="alertActive">Activa</label>
                            </div>

                            {message && (<div className={`alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'}`} role="alert">{message.text}</div>)}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => { setThreshold(''); setComparator('>'); setMessage(null); }}>Limpiar</button>
                            <button type="button" className="btn btn-dark" onClick={handleSave}>Guardar alerta</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AlertsCreator;
