import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import CustomersList from './pages/CustomersList'
import CustomerNew from './pages/CustomerNew'
import CustomerEdit from './pages/CustomerEdit'
import TransactionsList from './pages/TransactionsList'
import TransactionNew from './pages/TransactionNew'

export default function App(){
  return (
    <BrowserRouter>
      <div style={{ fontFamily: 'system-ui, Arial', padding: 16, maxWidth: 1000, margin: '0 auto' }}>
        <header style={{ display:'flex', gap:12, alignItems:'center', marginBottom:16 }}>
          <h1 style={{ margin:0, fontSize:22 }}>Demo Bank</h1>
          <nav style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <Link to="/customers">Customers</Link>
            <Link to="/customers/new">Nuevo customer</Link>
            <span style={{ opacity:.5 }}>|</span>
            <Link to="/transactions">Transacciones</Link>
            <Link to="/transactions/new">Nueva transacción</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Navigate to="/customers" replace />}/>
          <Route path="/customers" element={<CustomersList />}/>
          <Route path="/customers/new" element={<CustomerNew />}/>
          <Route path="/customers/:id/edit" element={<CustomerEdit />}/>
          <Route path="/transactions" element={<TransactionsList />}/>
          <Route path="/transactions/new" element={<TransactionNew />}/>
          <Route path="*" element={<div>404</div>}/>
        </Routes>
      </div>
    </BrowserRouter>
  )
}
