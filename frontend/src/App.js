// frontend/src/app.js
import Login from './view/Login.js';
import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import MenuOrganizaciones from './view/MenuOrganizaciones.js';
import ListaProyectos from './view/ListaProyectos.js';
import RegistroOrganizacion from './view/RegistroOrganizacion.js';
import RegistroProyecto from './view/RegistroProyecto.js';
import MenuProyecto from './view/MenuProyecto.js';
import ActaAceptacion from './view/ActaAceptacion.js';
import Autores from './view/Autores.js';
import NuevoAutor from './view/NuevoAutor.js';
import Roles from './view/Roles.js';
import NuevoRol from './view/NuevoRol.js';
import EditarRol from './view/EditarRol.js';
import Entrevistas from './view/Entrevistas.js';
import NuevaEntrevista from './view/NuevaEntrevista.js';
import EditarEntrevista from './view/EditarEntrevista.js';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
                path="/menuOrganizaciones"
                element={
                    <PrivateRoute>
                        <MenuOrganizaciones />
                    </PrivateRoute>
                }
          />
          <Route path="/registroOrganizaciones" element={<RegistroOrganizacion />} />
          <Route path="/listaProyectos" element={<ListaProyectos />} />
          <Route path="/registroProyecto" element={<RegistroProyecto />} />
          <Route path="/menuProyecto" element={<MenuProyecto />} />
          <Route path="/actaAceptacion" element={<ActaAceptacion />} />
          <Route path="/autores" element={<Autores />} />
          <Route path="/nuevoAutor" element={<NuevoAutor />} />
          <Route path="/Roles" element={< Roles/>} />
          <Route path="/nuevoRol" element={<NuevoRol />} />
          <Route path="/editarRol" element={<EditarRol />} />
          <Route path="/entrevistas" element={<Entrevistas />} />
          <Route path="/nuevaEntrevista" element={<NuevaEntrevista />} />
          <Route path="/editarEntrevista" element={<EditarEntrevista />} />
        </Routes>
      </div>
    </Router>
    
  );
}

export default App;
