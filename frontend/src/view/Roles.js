import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FaFolder, FaPencilAlt, FaTrash } from "react-icons/fa";
import '../styles/stylesRoles.css'
import '../styles/styles.css';

const Roles = () => {
    const navigate = useNavigate();

    const irAMenuOrganizaciones = () => {
        navigate("/menuOrganizaciones");
    };
    const irAMenuProyecto = () => {
        navigate("/menuProyecto");
    };
    const irANuevoRol = () => {
        navigate("/nuevoRol");
    };
    const irAVerRol = () => {
        navigate("/verRol");
    };
    const irAEditarRol = () => {
        navigate("/editarRol");
    };
    const irALogin = () => {
        navigate("/");
    };
    const irAListaProyecto = () => {
        navigate("/listaProyectos");
    };

    const [mostrarPopup, setMostrarPopup] = useState(false);
  
    const abrirPopup = () => {
      setMostrarPopup(true);
    };
  
    const cerrarPopup = () => {
      setMostrarPopup(false);
    };
  
    const eliminarRol = () => {
      console.log("Rol eliminado");
      cerrarPopup();
    };

    return (
        <div className="rol-container">
            <header className="ro-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>Mocar Company /</span>
                    <span onClick={irAMenuProyecto}>Sistema Inventario /</span>
                    <span>Roles</span>
                </div>
            </header>

            <div className="rolsub-container">

                <aside className="rol-sidebar">
                    {/*<div className="nav-button">
                            <button className="atras-button">Atras</button>
                            <button className="adelante-button">Adelante</button>
                        </div>*/}
                    <div className="rol-lista">
                        <p1 onClick={irAMenuOrganizaciones}>MENU PRINCIPAL</p1>
                    </div>

                    <div className="rol-profile-section" >
                        <div className="rol-profile-icon">👤</div>
                        <p2>Nombre Autor - Cod</p2>
                        <button onClick={irALogin} className="rol-logout-button" >Cerrar Sesión</button>
                    </div>
                </aside>

                <main className="rol-content">
                    <h2>ROLES</h2>
                    <section className="rol-organizations-section">

                        <div className="rol-search-section-bar">
                            <button onClick={irANuevoRol} className="rol-register-button">Nuevo Rol</button>
                            <div className="rol-sectionTextBuscar ">
                                <input className="rol-textBuscar" type="text" placeholder="Buscar" />
                                <button className="rol-search-button">Buscar</button>
                            </div>
                        </div>
                       


                        <table className="rol-centertabla">
                            <thead>
                                <tr>
                                    <th>Nombre del Rol</th>
                                    <th>Fecha de Creacion</th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Diseñador de Software</td>
                                    <td>26/10/2023</td>
                                    <td>
                                        <button className="botton-crud" onClick={irAVerRol}><FaFolder style={{ color: "orange", cursor: "pointer" }} /></button>
                                        <button className="botton-crud" onClick={irAEditarRol}><FaPencilAlt style={{ color: "blue", cursor: "pointer" }} /></button>
                                        <button className="botton-crud" onClick={abrirPopup}><FaTrash style={{ color: "red", cursor: "pointer" }} /></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Arquitecto de software</td>
                                    <td>26/10/2023</td>
                                    <td>
                                        <button className="botton-crud" onClick={irAVerRol}><FaFolder style={{ color: "orange", cursor: "pointer" }} /></button>
                                        <button className="botton-crud" onClick={irAEditarRol}><FaPencilAlt style={{ color: "blue", cursor: "pointer" }} /></button>
                                        <button className="botton-crud" onClick={abrirPopup}><FaTrash style={{ color: "red", cursor: "pointer" }} /></button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Tester/ QA</td>
                                    <td>26/10/2023</td> 
                                    <td>
                                        <button className="botton-crud" onClick={irAVerRol}><FaFolder style={{ color: "orange", cursor: "pointer" }} /></button>
                                        <button className="botton-crud" onClick={irAEditarRol}><FaPencilAlt style={{ color: "blue", cursor: "pointer" }} /></button>
                                        <button className="botton-crud" onClick={abrirPopup}><FaTrash style={{ color: "red", cursor: "pointer" }} /></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {mostrarPopup && (
                                <div className="popup-overlay">
                                <div className="popup-content">
                                    <p>¿Está seguro de eliminar este rol?</p>
                                    <button onClick={eliminarRol} className="si-button">
                                    Sí
                                    </button>
                                    <button onClick={cerrarPopup} className="no-button">
                                    No
                                    </button>
                                </div>
                                </div>
                        )}
                                               
                        <h4 className="rol-h4">Total de registros 3</h4>
                        <div className="rol-export-buttons">
                            <button className="rol-export-button">Excel</button>
                            <button className="rol-export-button">PDF</button>
                        </div>

                        <div className="search-section-bar">
                            <button onClick={irAMenuProyecto} className="atras-button">Regresar</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Roles;