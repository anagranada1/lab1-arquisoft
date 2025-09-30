import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

function money(n) {
  return new Intl.NumberFormat('es-CO', { style:'currency', currency:'COP', maximumFractionDigits:0 }).format(n ?? 0);
}
function fmtDate(val){
  if (!val) return '';
  const d = new Date(val);
  // si viene como "2025-09-29T12:34:56.123" sin zona, Date lo asume local; igual lo mostramos legible
  if (isNaN(d)) return String(val);
  return d.toLocaleString('es-CO');
}

export default function TransactionsList(){
  const [account, setAccount] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");           // filtro rápido por sender/receiver
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Autocargar si viene ?account= en la URL (ej: desde el success de crear)
  useEffect(() => {
    const url = new URL(window.location.href);
    const a = url.searchParams.get('account');
    if (a) {
      setAccount(a);
      fetchTx(a);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchTx(acc){
    const accNum = (acc ?? account).trim();
    if (!accNum) {
      setRows([]); setErr(""); return;
    }
    setLoading(true); setErr("");
    try {
      const { data } = await api.get(`/transactions/${encodeURIComponent(accNum)}`);
      setRows(Array.isArray(data) ? data : []);
      setPage(1);
    } catch (e) {
      setRows([]);
      setErr(e?.response?.data || e?.message || "Error consultando transacciones");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter(r =>
      (r.senderAccountNumber || '').toLowerCase().includes(term) ||
      (r.receiverAccountNumber || '').toLowerCase().includes(term)
    );
  }, [rows, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const slice = filtered.slice((safePage - 1) * pageSize, (safePage - 1) * pageSize + pageSize);

  return (
    <div>
      <h2 style={{ marginTop:0 }}>Transacciones</h2>
      <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap', marginBottom:8 }}>
        <input
          placeholder="Número de cuenta (remitente o receptor)"
          value={account}
          onChange={e => setAccount(e.target.value)}
          style={{ padding:8, minWidth:280 }}
        />
        <button onClick={() => fetchTx()}>Buscar</button>
        <input
          placeholder="Filtrar por sender/receiver…"
          value={q}
          onChange={e => { setQ(e.target.value); setPage(1); }}
          style={{ padding:8, minWidth:220 }}
        />
        <label style={{ color:'#6b7280', fontSize:12 }}>Filas:</label>
        <select value={pageSize} onChange={e => { setPageSize(parseInt(e.target.value,10)); setPage(1); }}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {err && <Alert type="error">{err}</Alert>}
      {loading ? <p style={{ color:'#6b7280' }}>Cargando…</p> : (
        <>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Remitente</Th>
                <Th>Receptor</Th>
                <Th style={{ textAlign:'right' }}>Monto</Th>
                <Th>Fecha</Th>
              </tr>
            </thead>
            <tbody>
              {slice.length ? slice.map(r => (
                <tr key={r.id ?? Math.random()}>
                  <Td>{r.id ?? ''}</Td>
                  <Td>{r.senderAccountNumber ?? ''}</Td>
                  <Td>{r.receiverAccountNumber ?? ''}</Td>
                  <Td style={{ textAlign:'right' }}>{money(r.amount)}</Td>
                  <Td>{fmtDate(r.transactionDate)}</Td>
                </tr>
              )) : (
                <tr><Td colSpan={5} style={{ color:'#6b7280' }}>Solo se mostrarán resultados cuando consulte por un número de cuenta que tenga transacciones asociadas</Td></tr>
              )}
            </tbody>
          </table>

          <div style={{ display:'flex', justifyContent:'space-between', marginTop:10, alignItems:'center' }}>
            <span style={{ color:'#6b7280', fontSize:12 }}>{filtered.length} registro(s)</span>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))}>&larr; Anterior</button>
              <span style={{ color:'#6b7280', width:80, textAlign:'center' }}>{safePage} / {totalPages}</span>
              <button onClick={() => setPage(p => p + 1)}>Siguiente &rarr;</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Th({ children, style }) {
  return <th style={{ background:'#f3f4f6', textAlign:'left', border:'1px solid #e5e7eb', padding:8, ...style }}>{children}</th>;
}
function Td({ children, colSpan, style }) {
  return <td colSpan={colSpan} style={{ border:'1px solid #e5e7eb', padding:8, ...style }}>{children}</td>;
}
function Alert({ type='error', children }){
  const styles = type === 'error'
    ? { background:'#fee2e2', color:'#991b1b', border:'1px solid #fecaca' }
    : { background:'#ecfdf5', color:'#065f46', border:'1px solid #a7f3d0' };
  return <div style={{ ...styles, padding:10, borderRadius:6, marginBottom:8 }}>{children}</div>;
}
