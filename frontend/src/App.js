// frontend/src/app.js
import Login from './view/Login.js';
import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import MenuOrganizaciones from './view/Organizacion/MenuOrganizaciones.js';
import RegistroOrganizacion from './view/Organizacion/RegistroOrganizacion.js';
import EditarOrganizacion from './view/Organizacion/EditarOrganizacion.js';
import ListaProyectos from './view/Proyecto/ListaProyectos.js';
import RegistroProyecto from './view/Proyecto/RegistroProyecto.js';
import EditarProyecto from './view/Proyecto/EditarProyecto.js';
import MenuProyecto from './view/Proyecto/MenuProyecto.js';
import ActaAceptacion from './view/Proyecto/ActaAceptacion/ActaAceptacion.js';
import EditarActaAceptacion from './view/Proyecto/ActaAceptacion/EditarActaAceptacion.js';
import Autores from './view/Proyecto/Autores/Autores.js';
import NuevoAutor from './view/Proyecto/Autores/NuevoAutor.js';
import EditarAutor from './view/Proyecto/Autores/EditarAutor.js';
import Roles from './view/Proyecto/Roles/Roles.js';
import NuevoRol from './view//Proyecto/Roles/NuevoRol.js';
import EditarRol from './view/Proyecto/Roles/EditarRol.js';
import Entrevistas from './view/Proyecto/Entrevistas/Entrevistas.js';
import NuevaEntrevista from './view/Proyecto/Entrevistas/NuevaEntrevista.js';
import EditarEntrevista from './view/Proyecto/Entrevistas/EditarEntrevista.js';
import NuevaEvidencia from './view/Proyecto/Entrevistas/NuevaEvidencia.js';
import Plantillas from './view/Plantillas/Plantillas.js';
import Educcion from './view/Plantillas/Educcion/Educcion.js';
import NuevaEduccion from './view/Plantillas/Educcion/NuevaEduccion.js';
import RegistroRiesgo from './view/Plantillas/Riesgos/RegistroRiesgo.js';
import Actores from './view/Plantillas/Actores/Actores.js';
import NuevoActor from './view/Plantillas/Actores/NuevoActor.js';
import Expertos from './view/Plantillas/Expertos/Expertos.js';
import NuevoExperto from './view/Plantillas/Expertos/NuevoExperto.js';
import EditarExperto from './view/Plantillas/Expertos/EditarExperto.js';
import Fuentes from './view/Plantillas/Fuentes/Fuentes.js';
import NuevaFuente from './view/Plantillas/Fuentes/NuevaFuente.js';
import EditarFuente from './view/Plantillas/Fuentes/EditarFuente.js';


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
          <Route path="/editarAutor" element={<EditarAutor />} />
          <Route path="/Roles" element={< Roles/>} />
          <Route path="/nuevoRol" element={<NuevoRol />} />
          <Route path="/editarRol" element={<EditarRol />} />
          <Route path="/entrevistas" element={<Entrevistas />} />
          <Route path="/nuevaEntrevista" element={<NuevaEntrevista />} />
          <Route path="/editarEntrevista" element={<EditarEntrevista />} />
          <Route path="/editarOrganizacion" element={<EditarOrganizacion />} />
          <Route path="/editarProyecto/:id" element={<EditarProyecto />} />
          <Route path="/editarActaAceptacion" element={<EditarActaAceptacion />} />
          <Route path="/nuevaEvidencia" element={<NuevaEvidencia />} />
          <Route path="/plantillas" element={<Plantillas />} />
          <Route path="/educcion" element={<Educcion />} />
          <Route path="/nuevaEduccion" element={<NuevaEduccion />} />
          <Route path="/registroRiesgo" element={<RegistroRiesgo />} />
          <Route path="/actores" element={<Actores />} />
          <Route path="/nuevoActor" element={<NuevoActor />} />
          <Route path="/expertos" element={<Expertos />} />   
          <Route path="/fuentes" element={<Fuentes />} />   
          <Route path="/nuevaFuente" element={<NuevaFuente />} /> 
          <Route path="/editarFuente" element={<EditarFuente />} /> 
          <Route path="/nuevoExperto" element={<NuevoExperto />} /> 
          <Route path="/editarExperto" element={<EditarExperto />} /> 
        </Routes>
      </div>
    </Router>
    
  );
}

export default App;
