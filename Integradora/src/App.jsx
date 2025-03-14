import Perfil from "./components/perfil";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AdminDashboard from "./components/headerAdmin";
import ContextoAcceso from "./components/contextoAcceso";
import ErrorPage from "./components/componentesExternos/ErrorPage";
import User from "./User";
import "bootstrap";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<User />}></Route>
          <Route path='/admin' element={<AdminDashboard />}></Route>
          <Route path='/acceso' element={<ContextoAcceso />}></Route>
          <Route path='/perfil' element={<Perfil />}></Route>
          <Route path='*' element={<ErrorPage />}></Route> 
        </Routes>
      </Router>
    </>
  );
}

export default App;
