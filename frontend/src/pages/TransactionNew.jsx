import { useState } from "react";
import { api } from "../api/client";
import { Link, useNavigate } from "react-router-dom";

function Label({ children }) {
  return <label style={{ display:'block', marginTop:12, fontWeight:600 }}>{children}</label>;
}
function Input(props) {
  return <input {...props} style={{ width:'100%', padding:10, boxSizing:'border-box', marginTop:6, fontSize:14 }} />;
}
function Alert({ type='error', children }){
  const styles = type === 'error'
    ? { background:'#fee2e2', color:'#991b1b', border:'1px solid #fecaca' }
    : { background:'#ecfdf5', color:'#065f46', border:'1px solid #a7f3d0' };
  return <div style={{ ...styles, padding:10, borderRadius:6, marginTop:12 }}>{children}</div>;
}

export default function TransactionNew(){
  const [sender, setSender]     = useState("");
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount]     = useState("0");
  const [busy, setBusy]         = useState(false);
  const [ok, setOk]             = useState("");
  const [err, setErr]           = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    setErr(""); setOk("");
    const val = parseFloat(amount);

    if (!sender.trim())  return setErr("La cuenta remitente es obligatoria.");
    if (!receiver.trim())return setErr("La cuenta receptora es obligatoria.");
    if (sender.trim() === receiver.trim()) return setErr("Remitente y receptor no pueden ser iguales.");
    if (!Number.isFinite(val) || val <= 0) return setErr("El monto debe ser mayor que 0.");

    try {
      setBusy(true);
      const payload = {
        senderAccountNumber: sender.trim(),
        receiverAccountNumber: receiver.trim(),
        amount: val
      };
      const { status, data } = await api.post("/transactions", payload);
      if (status >= 200 && status < 300) {
        setOk(`Transacción creada: ID ${data?.id ?? "—"} (${payload.senderAccountNumber} → ${payload.receiverAccountNumber})`);
        // Enlace rápido para ver movimientos de cada cuenta
        // (también puedes navegar automáticamente)
      } else {
        setErr("No fue posible crear la transacción.");
      }
    } catch (e) {
      setErr(e?.response?.data || e?.message || "Error de red");
    } finally {
      setBusy(false);
    }
  };

  const goToList = (acc) => {
    if (!acc) return;
    navigate(`/transactions?account=${encodeURIComponent(acc)}`);
  };

  return (
    <div>
      <h2 style={{ marginTop:0 }}>Nueva transacción</h2>
      <p style={{ color:'#6b7280', fontSize:12 }}>Transfiere dinero entre cuentas existentes.</p>

      {err && <Alert type="error">{err}</Alert>}
      {ok  && <Alert type="success">{ok}</Alert>}

      <div style={{ maxWidth:520 }}>
        <Label>Cuenta remitente</Label>
        <Input value={sender} onChange={e => setSender(e.target.value)} placeholder="Ej: 123-456" />

        <Label>Cuenta receptora</Label>
        <Input value={receiver} onChange={e => setReceiver(e.target.value)} placeholder="Ej: 987-654" />

        <Label>Monto</Label>
        <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} min="0.01" step="0.01" />

        <div style={{ display:'flex', gap:8, marginTop:12, flexWrap:'wrap' }}>
          <button onClick={submit} disabled={busy}>{busy ? "Procesando…" : "Transferir"}</button>
          <Link to="/transactions"><button type="button">← Volver al listado</button></Link>
          {/* Accesos rápidos tras crear */}
          {ok && (
            <>
              <button type="button" onClick={() => goToList(sender)}>Ver transacciones del remitente</button>
              <button type="button" onClick={() => goToList(receiver)}>Ver transacciones del receptor</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
