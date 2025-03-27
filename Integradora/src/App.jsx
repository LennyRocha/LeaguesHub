import Perfil from "./components/perfil";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AdminDashboard from "./components/headerAdmin";
import ContextoAcceso from "./components/contextoAcceso";
import Access from "./components/Access";
import ErrorPage from "./components/componentesExternos/ErrorPage";
import User from "./User";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import TestComponent from "./components/TestComponent";
import "bootstrap";
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<User />} />
          <Route path='/admin' element={<AdminDashboard />} />
          <Route path='/acceder' element={<ContextoAcceso />} />
          <Route path='/perfil' element={<Perfil />} />
          <Route path='/test' element={<TestComponent />} />
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;