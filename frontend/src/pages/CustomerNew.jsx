// src/pages/CustomerNew.jsx
import { useState } from 'react'
import { api } from '../api/client'
import { Link } from 'react-router-dom'

function Label({ children }) {
  return <label style={{ display:'block', marginTop:12, fontWeight:600 }}>{children}</label>
}
function Input(props) {
  return <input {...props} style={{ width:'100%', padding:10, boxSizing:'border-box', marginTop:6, fontSize:14 }} />
}

export default function CustomerNew(){
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [account, setAccount]     = useState('')
  const [balance, setBalance]     = useState('0')
  const [busy, setBusy]           = useState(false)
  const [ok, setOk]               = useState('')
  const [err, setErr]             = useState('')

  const submit = async () => {
    setErr(''); setOk('')

    const bal = parseFloat(balance)
    if (!firstName.trim()) return setErr('El nombre es obligatorio.')
    if (!lastName.trim())  return setErr('El apellido es obligatorio.')
    if (!account.trim())   return setErr('El número de cuenta es obligatorio.')
    if (!Number.isFinite(bal) || bal < 0) return setErr('El balance inicial no puede ser negativo.')

    try {
      setBusy(true)
      const payload = { firstName: firstName.trim(), lastName: lastName.trim(), accountNumber: account.trim(), balance: bal }
      const { status, data } = await api.post('/customers', payload)
      if (status >= 200 && status < 300) {
        setOk(`Cliente creado: ID ${data?.id ?? '—'} (${data?.firstName ?? firstName} ${data?.lastName ?? lastName})`)
        setFirstName(''); setLastName(''); setAccount(''); setBalance('0')
      } else {
        setErr('No fue posible crear el cliente.')
      }
    } catch (e) {
      setErr(e?.response?.data || e?.message || 'Error de red')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Nuevo customer</h2>
      <p style={{ color:'#6b7280', fontSize:12 }}>Registra un cliente. El número de cuenta debe ser único.</p>

      {err && (
        <div
          style={{
            background:'#fee2e2',
            color:'#991b1b',
            border:'1px solid #fecaca',
            padding:10,
            borderRadius:6,
            marginBottom:8
          }}
        >
          {err}
        </div>
      )}

      {ok && (
        <div
          style={{
            background:'#ecfdf5',
            color:'#065f46',
            border:'1px solid #a7f3d0',  // ← aquí estaba el error de comillas
            padding:10,
            borderRadius:6,
            marginBottom:8
          }}
        >
          {ok}
        </div>
      )}

      <div style={{ maxWidth:520 }}>
        <Label>Nombre</Label>
        <Input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Ej: Ana" />

        <Label>Apellido</Label>
        <Input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Ej: Pérez" />

        <Label>Número de cuenta</Label>
        <Input value={account} onChange={e => setAccount(e.target.value)} placeholder="Ej: 123-456" />

        <Label>Balance inicial</Label>
        <Input type="number" value={balance} onChange={e => setBalance(e.target.value)} min="0" step="0.01" />

        <div style={{ display:'flex', gap:8, marginTop:12 }}>
          <button onClick={submit} disabled={busy}>{busy ? 'Guardando…' : 'Guardar'}</button>
          <Link to="/customers"><button type="button">← Volver al listado</button></Link>
        </div>
      </div>
    </div>
  )
}
