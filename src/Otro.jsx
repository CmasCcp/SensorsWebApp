import React, { useMemo, useState } from "react";

/** ---------- Catálogos y esquema dinámico ---------- */
const GLOBAL_DEFAULTS = {
  timezone: "America/Santiago",
  cooldown: "PT10M",
  deduplicacion: { ventana: "PT5M", clave: ["id_regla", "dispositivo_id", "parametro"] },
  emailFrom: "alertas@sistema.tld",
  subjectPrefix: "[ALERTA]"
};

const TIPO_OPCIONES = [
  { value: "fecha_de_medicion", label: "Fecha de medición" },
  { value: "parametros", label: "Parámetros" }
];

const SEVERITIES = ["info", "low", "medium", "high", "critical"];
const OPS = [">", ">=", "<", "<=", "==", "!="];

const VALIDATIONS = {
  fecha_de_medicion: {
    stale_data: {
      label: "Dato atrasado",
      fields: [
        { name: "max_age", label: "Edad máxima (ISO 8601)", type: "duration", placeholder: "PT15M", required: true }
      ],
      subjectTpl: "Dato atrasado en {{dispositivo_id}}"
    },
    future_dating: {
      label: "Fecha futura",
      fields: [
        { name: "tolerancia", label: "Tolerancia (ISO 8601)", type: "duration", placeholder: "PT2M", required: true }
      ],
      subjectTpl: "Fecha futura detectada en {{dispositivo_id}}"
    },
    gap_detection: {
      label: "Brecha de muestreo",
      fields: [
        { name: "intervalo_esperado", label: "Intervalo esperado (ISO)", type: "duration", placeholder: "PT5M", required: true },
        { name: "umbral_gap", label: "Umbral de brecha (ISO)", type: "duration", placeholder: "PT20M", required: true },
        { name: "clave_agrupacion", label: "Clave agrupación", type: "tags", placeholder: "dispositivo_id", default: ["dispositivo_id"] }
      ],
      subjectTpl: "Brecha de muestreo en {{dispositivo_id}}"
    },
    out_of_order: {
      label: "Desorden temporal",
      fields: [{ name: "clave_agrupacion", label: "Clave agrupación", type: "tags", default: ["dispositivo_id"] }],
      subjectTpl: "Desorden temporal en {{dispositivo_id}}"
    },
    duplicate_timestamp: {
      label: "Timestamp duplicado",
      fields: [{ name: "clave_agrupacion", label: "Clave agrupación", type: "tags", default: ["dispositivo_id"] }],
      subjectTpl: "Timestamp duplicado en {{dispositivo_id}}"
    }
  },

  parametros: {
    missing_value: {
      label: "Valor ausente/nulo",
      fields: [],
      subjectTpl: "{{parametro}} ausente/nulo en {{dispositivo_id}}"
    },
    between_range: {
      label: "Rango esperado",
      fields: [
        { name: "min", label: "Mínimo", type: "number", required: true },
        { name: "max", label: "Máximo", type: "number", required: true },
        { name: "inclusivo", label: "Inclusivo", type: "boolean", default: true },
        {
          name: "alertar_si",
          label: "Alertar si",
          type: "select",
          options: [
            { value: "fuera", label: "Fuera de rango" },
            { value: "dentro", label: "Dentro de rango" }
          ],
          default: "fuera"
        }
      ],
      subjectTpl: "{{parametro}} fuera de rango ({{valor}})"
    },
    range_threshold: {
      label: "Umbral absoluto",
      fields: [
        { name: "operador", label: "Operador", type: "select", options: OPS.map(o => ({ value: o, label: o })), default: ">" },
        { name: "limite", label: "Límite", type: "number", required: true }
      ],
      subjectTpl: "{{parametro}} supera umbral ({{valor}})"
    },
    rate_of_change: {
      label: "Velocidad de cambio",
      fields: [
        { name: "ventana_muestras", label: "Ventana (muestras)", type: "number", default: 1 },
        { name: "max_delta_pct", label: "Δ% máx", type: "number", default: 20 }
        // Puedes agregar max_delta_abs si lo necesitas
      ],
      subjectTpl: "Cambio brusco en {{parametro}} ({{valor}})"
    },
    rolling_outlier: {
      label: "Atípico (ventana)",
      fields: [
        {
          name: "metodo",
          label: "Método",
          type: "select",
          options: [
            { value: "zscore", label: "Z-Score" },
            { value: "iqr", label: "IQR" },
            { value: "mad", label: "MAD" }
          ],
          default: "zscore"
        },
        { name: "ventana_muestras", label: "Ventana (muestras)", type: "number", default: 30 },
        { name: "z", label: "Z (si zscore)", type: "number", default: 3 },
        { name: "iqr_factor", label: "IQR factor (si iqr)", type: "number", default: 1.5 }
      ],
      subjectTpl: "Atípico detectado en {{parametro}}"
    },
    stuck_value: {
      label: "Valor congelado",
      fields: [
        { name: "ventana_muestras", label: "Ventana (muestras)", type: "number", default: 10 },
        { name: "max_unicos", label: "Máx. valores únicos", type: "number", default: 1 }
      ],
      subjectTpl: "{{parametro}} congelado"
    },
    categorical_allowed: {
      label: "Catálogo permitido",
      fields: [
        { name: "permitidos", label: "Valores permitidos", type: "tags", placeholder: "ON,OFF,MAINT", default: ["ON", "OFF", "MAINT"] },
        { name: "case_sensitive", label: "Case sensitive", type: "boolean", default: false }
      ],
      subjectTpl: "Valor no permitido en {{parametro}}: {{valor}}"
    },
    cross_parameter_rule: {
      label: "Regla entre parámetros",
      fields: [
        { name: "izq", label: "Parámetro izq.", type: "text", required: true, placeholder: "temp_min" },
        { name: "relacion", label: "Relación", type: "select", options: OPS.map(o => ({ value: o, label: o })), default: "<=" },
        { name: "der", label: "Parámetro der.", type: "text", required: true, placeholder: "temp_max" }
      ],
      subjectTpl: "Regla entre parámetros incumplida"
    }
  }
};

/** ---------- Utilidades ---------- */
function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

const fieldBase = "block w-full rounded-md border border-gray-300 px-3 py-2 text-sm";
const labelBase = "block text-sm font-medium text-gray-700 mb-1";
const sectionCard = "rounded-2xl border border-gray-200 p-4 shadow-sm bg-white";

const DURATION_HINT =
  "Usa ISO-8601 (ej.: PT15M=15min, PT2H=2h, P1D=1 día, PT1H30M=1h30m).";

function isDuration(s) {
  return typeof s === "string" && /^P(?!$)(\d+Y)?(\d+M)?(\d+D)?(T(\d+H)?(\d+M)?(\d+S)?)?$/.test(s);
}

/** ---------- Componente principal ---------- */
export default function Otro() {
  const [tipo, setTipo] = useState("fecha_de_medicion");
  const [validacion, setValidacion] = useState("stale_data");
  const [idRegla, setIdRegla] = useState("R1");
  const [severity, setSeverity] = useState("medium");
  const [parametro, setParametro] = useState(""); // solo para tipo=parametros
  const [config, setConfig] = useState({});
  const [emailTo, setEmailTo] = useState("");
  const [emailList, setEmailList] = useState(["ops@org.cl"]);
  const [subject, setSubject] = useState("");

  const schema = VALIDATIONS[tipo][validacion];

  // Reset de campos al cambiar tipo/validación
  React.useEffect(() => {
    const defaults = {};
    schema.fields?.forEach(f => {
      if (f.default !== undefined) defaults[f.name] = f.default;
    });
    setConfig(defaults);
    setSubject(schema?.subjectTpl || "");
  }, [tipo, validacion]);

  const validationsOptions = useMemo(
    () => Object.entries(VALIDATIONS[tipo]).map(([value, v]) => ({ value, label: v.label })),
    [tipo]
  );

  function updateConfig(name, value, field) {
    const next = { ...config, [name]: value };
    // Validación ligera para durations
    if (field?.type === "duration" && value && !isDuration(value)) {
      next.__errors = { ...(config.__errors || {}), [name]: "Duración ISO-8601 inválida" };
    } else if (config.__errors && config.__errors[name]) {
      const { [name]: _, ...rest } = config.__errors;
      next.__errors = Object.keys(rest).length ? rest : undefined;
    }
    setConfig(next);
  }

  function addEmail() {
    const parts = emailTo
      .split(/[,\s;]+/)
      .map(x => x.trim())
      .filter(Boolean);
    if (!parts.length) return;
    setEmailList(prev => Array.from(new Set([...prev, ...parts])));
    setEmailTo("");
  }

  function removeEmail(e) {
    setEmailList(prev => prev.filter(x => x !== e));
  }

  const resultJson = useMemo(() => {
    const base = {
      id_regla: idRegla,
      tipo,
      validacion,
      config: { ...config }
    };
    if (tipo === "parametros" && parametro) base.parametro = parametro;
    base.severity = severity;
    base.email = {
      to: emailList,
      subject: subject && subject.trim().length ? subject : `${GLOBAL_DEFAULTS.subjectPrefix} ${schema?.label || "Alerta"}`
    };
    return base;
  }, [idRegla, tipo, validacion, config, parametro, severity, emailList, subject, schema]);

  async function copyJSON() {
    await navigator.clipboard.writeText(JSON.stringify(resultJson, null, 2));
    alert("JSON copiado");
  }

  return (
    <div className="min-h-screen" style={{ background: "#f6f7fb", padding: 20, fontFamily: "ui-sans-serif, system-ui" }}>
      <div className="max-w-5xl mx-auto space-y-16">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Crear regla de alerta</h1>
          <div className="text-xs text-gray-500">
            TZ: {GLOBAL_DEFAULTS.timezone} · Cooldown: {GLOBAL_DEFAULTS.cooldown}
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {/* --------- Config básica --------- */}
          <section className={sectionCard}>
            <h2 className="text-lg font-medium mb-4">1) Básico</h2>

            <div className="mb-4">
              <label className={labelBase}>ID de regla</label>
              <input className={fieldBase} value={idRegla} onChange={e => setIdRegla(e.target.value)} placeholder="R1" />
            </div>

            <div className="mb-4">
              <label className={labelBase}>Tipo</label>
              <select
                className={fieldBase}
                value={tipo}
                onChange={e => {
                  setTipo(e.target.value);
                  setValidacion(Object.keys(VALIDATIONS[e.target.value])[0]);
                }}
              >
                {TIPO_OPCIONES.map(o => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {tipo === "parametros" && (
              <div className="mb-4">
                <label className={labelBase}>Parámetro (nombre del campo)</label>
                <input
                  className={fieldBase}
                  value={parametro}
                  onChange={e => setParametro(e.target.value)}
                  placeholder="ph / presion / estado_bomba ..."
                />
              </div>
            )}

            <div className="mb-4">
              <label className={labelBase}>Validación</label>
              <select className={fieldBase} value={validacion} onChange={e => setValidacion(e.target.value)}>
                {validationsOptions.map(o => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              {schema?.fields?.some(f => f.type === "duration") && (
                <p className="text-xs text-gray-500 mt-2">{DURATION_HINT}</p>
              )}
            </div>

            <div className="mb-4">
              <label className={labelBase}>Severidad</label>
              <select className={fieldBase} value={severity} onChange={e => setSeverity(e.target.value)}>
                {SEVERITIES.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* --------- Campos de la validación --------- */}
          <section className={sectionCard}>
            <h2 className="text-lg font-medium mb-4">2) Config de validación</h2>
            {schema?.fields?.length ? (
              <div className="space-y-4">
                {schema.fields.map(field => (
                  <FieldEditor
                    key={field.name}
                    field={field}
                    value={config[field.name]}
                    onChange={val => updateConfig(field.name, val, field)}
                    error={config.__errors?.[field.name]}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Esta validación no requiere parámetros.</p>
            )}
          </section>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* --------- Email --------- */}
          <section className={sectionCard}>
            <h2 className="text-lg font-medium mb-4">3) Notificación (email)</h2>

            <div className="mb-4">
              <label className={labelBase}>Destinatarios (To)</label>
              <div className="flex gap-2">
                <input
                  className={fieldBase}
                  value={emailTo}
                  onChange={e => setEmailTo(e.target.value)}
                  placeholder="persona@org.cl, equipo@org.cl"
                />
                <button
                  className="rounded-md px-4 text-sm bg-black text-white"
                  type="button"
                  onClick={addEmail}
                  title="Agregar"
                >
                  Añadir
                </button>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {emailList.map(x => (
                  <span
                    key={x}
                    className="inline-flex items-center gap-2 text-xs bg-gray-100 border border-gray-200 px-2 py-1 rounded-full"
                  >
                    {x}
                    <button className="text-gray-500 hover:text-black" onClick={() => removeEmail(x)} title="Quitar">
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Desde: {GLOBAL_DEFAULTS.emailFrom}</p>
            </div>

            <div className="mb-2">
              <label className={labelBase}>Asunto</label>
              <input
                className={fieldBase}
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder={`${GLOBAL_DEFAULTS.subjectPrefix} ${schema?.label || "Alerta"}`}
              />
              <p className="text-xs text-gray-500 mt-1">
                Puedes usar placeholders: {"{ {dispositivo_id} } { {parametro} } { {valor} } { {timestamp} }"}
              </p>
            </div>
          </section>

          {/* --------- Preview JSON --------- */}
          <section className={sectionCard}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-medium">4) Preview JSON</h2>
              <button
                onClick={copyJSON}
                className="rounded-md px-3 py-1.5 text-sm bg-black text-white"
                type="button"
              >
                Copiar
              </button>
            </div>
            <pre
              className="text-xs overflow-auto"
              style={{ maxHeight: 360, background: "#0b1020", color: "#d7e1ff", padding: 12, borderRadius: 12 }}
            >
{JSON.stringify(resultJson, null, 2)}
            </pre>
          </section>
        </div>

        <footer className="text-xs text-gray-500 text-center">
          Formato de duración ISO-8601 (ej.: <code>PT15M</code> = 15 minutos). El backend aplicará timezone {GLOBAL_DEFAULTS.timezone}.
        </footer>
      </div>
    </div>
  );
}

/** ---------- Editor de campos genérico ---------- */
function FieldEditor({ field, value, onChange, error }) {
  const common = { className: fieldBase, id: field.name };

  if (field.type === "number")
    return (
      <div>
        <label className={labelBase} htmlFor={field.name}>
          {field.label}
        </label>
        <input
          {...common}
          type="number"
          step="any"
          value={value ?? ""}
          onChange={e => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder={field.placeholder}
        />
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
    );

  if (field.type === "boolean")
    return (
      <div className="flex items-center gap-2">
        <input
          id={field.name}
          type="checkbox"
          checked={!!value}
          onChange={e => onChange(e.target.checked)}
          className="h-4 w-4"
        />
        <label className="text-sm text-gray-700" htmlFor={field.name}>
          {field.label}
        </label>
      </div>
    );

  if (field.type === "select")
    return (
      <div>
        <label className={labelBase} htmlFor={field.name}>
          {field.label}
        </label>
        <select {...common} value={value ?? field.default ?? ""} onChange={e => onChange(e.target.value)}>
          {(field.options || []).map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );

  if (field.type === "tags")
    return <TagsInput field={field} value={value} onChange={onChange} />;

  if (field.type === "duration")
    return (
      <div>
        <label className={labelBase} htmlFor={field.name}>
          {field.label}
        </label>
        <input
          {...common}
          value={value ?? ""}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder || "PT15M"}
        />
        <p className="text-xs text-gray-500 mt-1">
          Ej.: PT15M (15 min), PT2H (2 h), P1D (1 día). {/* ayuda breve */}
        </p>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
    );

  // text por defecto
  return (
    <div>
      <label className={labelBase} htmlFor={field.name}>
        {field.label}
      </label>
      <input
        {...common}
        value={value ?? ""}
        onChange={e => onChange(e.target.value)}
        placeholder={field.placeholder}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

/** ---------- Input tipo "tags" simple ---------- */
function TagsInput({ field, value, onChange }) {
  const [input, setInput] = useState("");
  const tags = Array.isArray(value) ? value : field.default || [];

  function add() {
    const parts = input
      .split(/[,\s;]+/)
      .map(s => s.trim())
      .filter(Boolean);
    if (!parts.length) return;
    const next = Array.from(new Set([...(tags || []), ...parts]));
    onChange(next);
    setInput("");
  }
  function remove(tag) {
    const next = (tags || []).filter(x => x !== tag);
    onChange(next);
  }

  return (
    <div>
      <label className={labelBase}>{field.label}</label>
      <div className="flex gap-2">
        <input
          className={fieldBase}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={field.placeholder || "valor1, valor2"}
        />
        <button type="button" onClick={add} className="rounded-md px-4 text-sm bg-black text-white">
          Añadir
        </button>
      </div>
      <div className="flex gap-2 mt-2 flex-wrap">
        {(tags || []).map(t => (
          <span key={t} className="inline-flex items-center gap-2 text-xs bg-gray-100 border border-gray-200 px-2 py-1 rounded-full">
            {t}
            <button className="text-gray-500 hover:text-black" onClick={() => remove(t)} title="Quitar">
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
