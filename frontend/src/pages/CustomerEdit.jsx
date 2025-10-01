import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Link, useParams, useNavigate } from 'react-router-dom';

function Label({ children }) {
  return <label style={{ display:'block', marginTop:12, fontWeight:600 }}>{children}</label>
}
function Input(props) {
  return <input {...props} style={{ width:'100%', padding:10, boxSizing:'border-box', marginTop:6, fontSize:14 }} />
}

export default function CustomerEdit(){
  const { id } = useParams();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [account,   setAccount]   = useState('');
  const [balance,   setBalance]   = useState('0');
  const [busy,      setBusy]      = useState(false);
  const [ok,        setOk]        = useState('');
  const [err,       setErr]       = useState('');

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const { data } = await api.get(`/customers/${id}`);
        if (cancel) return;
        setFirstName(data?.firstName ?? '');
        setLastName(data?.lastName ?? '');
        setAccount(data?.accountNumber ?? '');
        setBalance(String(data?.balance ?? '0'));
      } catch(e){
        setErr(e?.response?.data || e?.message || 'No se pudo cargar el cliente');
      }
    })();
    return () => { cancel = true; }
  }, [id]);

  const submit = async () => {
    setErr(''); setOk('');
    const bal = parseFloat(balance);
    if (!firstName.trim()) return setErr('El nombre es obligatorio.');
    if (!lastName.trim())  return setErr('El apellido es obligatorio.');
    if (!account.trim())   return setErr('El número de cuenta es obligatorio.');
    if (!Number.isFinite(bal) || bal < 0) return setErr('El balance no puede ser negativo.');

    try {
      setBusy(true);
      const payload = { firstName:firstName.trim(), lastName:lastName.trim(), accountNumber:account.trim(), balance: bal };
      const { status } = await api.put(`/customers/${id}`, payload);
      if (status >= 200 && status < 300) {
        setOk('Cliente actualizado correctamente.');
        // Redirige al listado tras 1s
        setTimeout(() => navigate('/customers'), 800);
      } else {
        setErr('No fue posible actualizar el cliente.');
      }
    } catch (e){
      setErr(e?.response?.data || e?.message || 'Error de red');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginTop:0 }}>Editar customer</h2>
      <p style={{ color:'#6b7280', fontSize:12 }}>Modifica la información del cliente #{id}.</p>

      {err && <div style={{ background:'#fee2e2', color:'#991b1b', border:'1px solid #fecaca', padding:10, borderRadius:6, marginBottom:8 }}>{err}</div>}
      {ok  && <div style={{ background:'#ecfdf5', color:'#065f46', border:'1px solid #a7f3d0', padding:10, borderRadius:6, marginBottom:8 }}>{ok}</div>}

      <div style={{ maxWidth:520 }}>
        <Label>Nombre</Label>
        <Input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Ej: Ana" />

        <Label>Apellido</Label>
        <Input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Ej: Pérez" />

        <Label>Número de cuenta</Label>
        <Input value={account} onChange={e => setAccount(e.target.value)} placeholder="Ej: 123-456" />

        <Label>Balance</Label>
        <Input type="number" value={balance} onChange={e => setBalance(e.target.value)} min="0" step="0.01" />

        <div style={{ display:'flex', gap:8, marginTop:12 }}>
          <button onClick={submit} disabled={busy}>{busy ? 'Guardando…' : 'Guardar cambios'}</button>
          <Link to="/customers"><button type="button">← Volver</button></Link>
        </div>
      </div>
    </div>
  );
}
