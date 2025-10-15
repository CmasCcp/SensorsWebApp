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

const AlertsCreator = ({ projects = [], devices = [], indicators = [] }) => {
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
    const [email, setEmail] = useState('');
    const [applyToAllDevices, setApplyToAllDevices] = useState(true);
    const [selectedDevices, setSelectedDevices] = useState([]);

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
        // check devices if not applying to all
        if (!applyToAllDevices && (!selectedDevices || selectedDevices.length === 0)) return 'Seleccione al menos un dispositivo o marque "Aplicar a todos"';
        // validate email if provided (allow comma-separated list)
        if (email) {
            const parts = email.split(',').map(s => s.trim()).filter(Boolean);
            const emailRx = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
            for (const e of parts) {
                if (!emailRx.test(e)) return `Email inválido: ${e}`;
            }
        }
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
            email: email ? email.split(',').map(s => s.trim()).filter(Boolean) : [],
            applyToAllDevices,
            targetDevices: applyToAllDevices ? [] : selectedDevices,
            active
        };

        // call parent onSave instead of persisting locally
        // if (typeof onSave === 'function') onSave(alertObj);

        fetch(`${import.meta.env.VITE_API_URL}/insertarAlerta`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(alertObj)
        })
        .then(res => {
            console.log(res)
            if (!res.ok) return res.text().then(t => { throw new Error(t || res.statusText); });
            return res.json().catch(() => ({}));
        })
        .then(data => {
            console.log('Alerta enviada al backend', data);
            setMessage({ type: 'success', text: 'Alerta guardada exitosamente' });
            
            // Limpiar todos los campos del formulario después del envío exitoso
            setConfigValues({});
            setValidationId('');
            setEmail('');
            setApplyToAllDevices(true);
            setSelectedDevices([]);
            setActive(true);
            setRuleType('parametros');
            if (indicators.length > 0) setIndicator(indicators[0]);
            if (projects.length > 0) setProjectId(getProjectValue(projects[0]));
            
            // Cerrar modal después de un breve delay para que el usuario vea el mensaje
            setTimeout(() => {
                setShow(false);
                setMessage(null);
            }, 1500);
        })
        .catch(err => {
            console.error('Error enviando alerta:', err);
            setMessage({ type: 'error', text: 'Error enviando alerta: ' + (err.message || 'error de red') });
        });

        console.log(alertObj)
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

    const handleValidationChange = (valId) => {
        setValidationId(valId);
        const v = getValidationsForRule().find(x => x.id === valId);
        if (!v || !v.config) { setConfigValues({}); return; }
        const defaults = {};
        Object.entries(v.config).forEach(([k, vv]) => {
            // If the config indicates a parameter placeholder (parametro_izq/parametro_der
            // or config key 'izq'/'der' with placeholder strings), prefill left param with
            // the currently-selected indicator so the user doesn't have to reselect it.
            if (vv === 'parametro_izq' || vv === 'parametro_der' || k === 'izq' || k === 'der') {
                if (vv === 'parametro_izq' || k === 'izq') {
                    defaults[k] = indicator || '';
                } else {
                    defaults[k] = '';
                }
            } else if (Array.isArray(vv)) {
                // For relational operator choose a sensible default (first option),
                // otherwise leave empty so user must pick.
                if (k === 'relacion') defaults[k] = Array.isArray(vv) && vv.length > 0 ? vv[0] : '';
                else defaults[k] = '';
            }
            else if (typeof vv === 'number') defaults[k] = vv;
            else if (typeof vv === 'boolean') defaults[k] = vv;
            else defaults[k] = '';
        });
        setConfigValues(defaults);
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
                                        <option value="">-- Seleccione --</option>
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
                                    <input type="number" className="form-control" defaultValue={val} onChange={e => onChangeConfigField(key, Number(e.target.value))} />
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
                            // bind these selects to configValues by key so they are independent
                            return (
                                <div className="form-check mb-2" key={key}>
                                    <label className="form-label">Parámetro: {val}</label>
                                    <select name={val} className="form-select form-control" value={configValues[key] ?? ''} onChange={e => onChangeConfigField(key, e.target.value)}>
                                        <option value="">-- Seleccione --</option>
                                        {indicators.map(ind => (!noVariables.includes(ind) && <option key={ind} value={ind}>{ind}</option>))}
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
                <div className="modal-dialog modal-lg" role="document" onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh', display: 'flex', alignItems: 'center' }}>
                    <div className="modal-content" style={{ maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div className="modal-header d-flex flex-column w-100" style={{ flexShrink: 0 }}>
                            <h5 className="w-100 text-center">Crear alerta</h5>
                            <br />
                            <p>Las alertas se aplicarán a todos los dispositivos del proyecto y se aplicaran por cada uno de ellos.</p>
                            {/* <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button> */}
                        </div>
                        <div className="modal-body" style={{ overflowY: 'auto', flexGrow: 1, padding: '1rem' }}>
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
                                    <select className="form-select form-control" value={validationId} onChange={e => handleValidationChange(e.target.value)}>
                                        <option value="">-- Seleccione --</option>
                                        {getValidationsForRule().map(v => (
                                            <option key={v.id} value={v.id}>{v.nombre || v.id}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {renderConfigInputs()}

                            <div className="mb-3">
                                <label className="form-label d-block">Aplicar alerta a dispositivos</label>
                                <div className="form-check form-switch mb-2">
                                    <input className="form-check-input" type="checkbox" disabled checked={true} onChange={e => setApplyToAllDevices(e.target.checked)} id="applyAllDevices" />
                                    <label className="form-check-label" htmlFor="applyAllDevices">Aplicar a todos los dispositivos</label>
                                </div>
                                {!applyToAllDevices && (
                                    <div>
                                        <label className="form-label">Seleccionar dispositivos</label>
                                        <select multiple className="form-select" value={selectedDevices} onChange={e => setSelectedDevices(Array.from(e.target.selectedOptions).map(o => o.value))}>
                                            {devices.map(d => (
                                                <option key={d.value} value={d.value}>{d.label}</option>
                                            ))}
                                        </select>
                                        <div className="form-text">Mantén Ctrl/Cmd para seleccionar múltiples.</div>
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Emails (coma-separados)</label>
                                <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ops@org.cl, mantenimiento@org.cl" />
                                <div className="form-text">Direcciones separadas por coma. Se validan antes de guardar.</div>
                            </div>

                            <div className="form-check form-switch my-2">
                                <input className="form-check-input" type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} id="alertActive" />
                                <label className="form-check-label" htmlFor="alertActive">Activa</label>
                            </div>

                            {message && (<div className={`alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'}`} role="alert">{message.text}</div>)}
                        </div>
                        <div className="modal-footer" style={{ flexShrink: 0 }}>
                            <button type="button" className="btn btn-secondary" onClick={() => {
                                // reset form fields we actually have
                                setConfigValues({});
                                setValidationId('');
                                setEmail('');
                                setMessage(null);
                                setActive(true);
                                if (indicators.length > 0) setIndicator(indicators[0]);
                            }}>Limpiar</button>
                            <button type="button" className="btn btn-dark" onClick={handleSave}>Guardar alerta</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AlertsCreator;
