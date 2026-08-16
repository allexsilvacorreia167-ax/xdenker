import { useState, useEffect, useRef } from 'react';

/**
 * Autocomplete de candidatos legislativos via API TSE (proxy /api/tse/buscar)
 * Usado na Etapa 3 do questionário (Dep. Federal, Estadual, Senador)
 */
export default function TseAutocomplete({
  label,
  cargo = 'deputado_federal',
  uf = 'CE',
  year = 2022,
  value,
  onChange,
  placeholder = 'Digite nome, partido ou número...',
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState(null);
  const debounce = useRef(null);
  const wrap = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (wrap.current && !wrap.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }
    debounce.current = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ q: query, uf, cargo, year, limit: 15 });
        const res = await fetch(`/api/tse/buscar?${params}`);
        const data = await res.json();
        setResults(data.candidates || []);
        setSource(data.source);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(debounce.current);
  }, [query, uf, cargo, year]);

  const select = (c) => {
    onChange?.(c);
    setQuery(`${c.name} (${c.party}${c.number ? ` — ${c.number}` : ''})`);
    setOpen(false);
  };

  return (
    <div className="relative" ref={wrap}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      )}
      <input
        type="text"
        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (value) onChange?.(null);
        }}
        onFocus={() => results.length > 0 && setOpen(true)}
      />
      {loading && (
        <span className="absolute right-3 top-9 text-xs text-slate-400">Buscando TSE...</span>
      )}
      {value && !open && (
        <p className="text-xs text-green-600 mt-1">
          Selecionado: {value.name} — {value.party}
          {value.number ? ` nº ${value.number}` : ''}
          {value.source === 'fallback' ? ' (cache local)' : ' (TSE)'}
        </p>
      )}
      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full max-h-56 overflow-auto bg-white border border-slate-200 rounded-xl shadow-lg">
          {results.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 flex justify-between gap-2"
                onClick={() => select(c)}
              >
                <span>
                  <span className="font-medium text-slate-800">{c.name}</span>
                  <span className="text-slate-500"> · {c.party}</span>
                </span>
                {c.number && (
                  <span className="text-xs text-slate-400 font-mono">{c.number}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && !loading && query.length >= 2 && results.length === 0 && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-sm text-slate-500">
          Nenhum candidato encontrado
          {source === 'fallback' && ' (API TSE indisponível — usando fallback)'}
        </div>
      )}
    </div>
  );
}
