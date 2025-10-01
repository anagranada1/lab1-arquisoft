import { useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'
import { Link } from 'react-router-dom';

function ConfirmButton({ onConfirm, children }){
  return <button onClick={() => { if (confirm('¿Seguro que deseas borrar este cliente?')) onConfirm(); }}>{children}</button>;
}

function money(n){
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n || 0)
}

function Th({ children, style }) {
  return <th style={{ background:'#f3f4f6', textAlign:'left', border:'1px solid #e5e7eb', padding:8, ...style }}>{children}</th>
}
function Td({ children, colSpan, style }) {
  return <td colSpan={colSpan} style={{ border:'1px solid #e5e7eb', padding:8, ...style }}>{children}</td>
}

export default function CustomersList(){
  const [rows, setRows] = useState([])
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true); setErr('')
      try {
        const { data } = await api.get('/customers')
        if (!cancelled) setRows(Array.isArray(data) ? data : [])
      } catch (e) {
        if (!cancelled) setErr(e?.response?.data || e?.message || 'Error cargando customers')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return rows
    return rows.filter(r =>
      (r.firstName || '').toLowerCase().includes(term) ||
      (r.lastName || '').toLowerCase().includes(term) ||
      (r.accountNumber || '').toLowerCase().includes(term)
    )
  }, [rows, q])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const slice = filtered.slice((safePage - 1) * pageSize, (safePage - 1) * pageSize + pageSize)

  async function deleteCustomer(id){
      try {
        await api.delete(`/customers/${id}`);
        // quita el registro localmente
        setRows(prev => prev.filter(r => r.id !== id));
      } catch (e){
        alert(e?.response?.data || e?.message || 'Error eliminando el cliente');
      }
    }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Customers</h2>

      <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap', marginBottom:8 }}>
        <input
          placeholder="Filtrar por nombre, apellido o cuenta…"
          value={q}
          onChange={e => { setQ(e.target.value); setPage(1) }}
          style={{ padding:8, minWidth:260 }}
        />
        <label style={{ color:'#6b7280', fontSize:12 }}>Filas:</label>
        <select value={pageSize} onChange={e => { setPageSize(parseInt(e.target.value,10)); setPage(1) }}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      {err && <div style={{ background:'#fee2e2', color:'#991b1b', border:'1px solid #fecaca', padding:10, borderRadius:6 }}>{err}</div>}
      {loading ? <div style={{ color:'#6b7280' }}>Cargando…</div> : (
        <>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Nombre</Th>
                <Th>Apellido</Th>
                <Th>Número de cuenta</Th>
                <Th style={{ textAlign:'right' }}>Balance</Th>
                <Th style={{ textAlign:'center' }}>Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {slice.length ? slice.map(r => (
                <tr key={r.id ?? Math.random()}>
                  <Td>{r.id ?? ''}</Td>
                  <Td>{r.firstName ?? ''}</Td>
                  <Td>{r.lastName ?? ''}</Td>
                  <Td>{r.accountNumber ?? ''}</Td>
                  <Td style={{ textAlign:'right' }}>{money(r.balance)}</Td>
                  <Td style={{ textAlign:'center' }}>
                      <Link to={`/customers/${r.id}/edit`}><button>Editar</button></Link>{' '}
                      <ConfirmButton onConfirm={() => deleteCustomer(r.id)}>Eliminar</ConfirmButton>
                  </Td>
                </tr>
              )) : (
                <tr><Td colSpan={5} style={{ color:'#6b7280' }}>Sin resultados</Td></tr>
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
  )
}
