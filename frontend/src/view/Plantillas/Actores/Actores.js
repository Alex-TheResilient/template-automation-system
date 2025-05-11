import React, { useState } from 'react';
import { useNavigate,useParams } from "react-router-dom";
import { FaFolder, FaPencilAlt, FaTrash} from "react-icons/fa";
import '../../../styles/stylesAutores.css'
import '../../../styles/stylesEliminar.css'
import '../../../styles/styles.css';


const Actores = () => {
    const { orgcod ,projcod} = useParams();
    const navigate = useNavigate();

    const irALogin = () => {
        navigate("/");
    };
    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
        
    };
    const irAListaProyecto = () => {
        navigate(`/organizations/${orgcod}/projects`);
    };
    const irAMenuProyecto = () => {
        navigate(`/projects/${projcod}/menuProyecto`);
    };  

    const irAPlantillas = () => {
        navigate(`/projects/${projcod}/plantillas`);
    };

    const irANuevoActor = () => {
        navigate("/nuevoActor");
    };
    const irAVerActor = () => {
        navigate("/verActor");
    };
    const irAEditarActor = () => {
        navigate("/editarActor");
    };

    const [mostrarPopup, setMostrarPopup] = useState(false);
  
    const abrirPopup = () => {
      setMostrarPopup(true);
    };
  
    const cerrarPopup = () => {
      setMostrarPopup(false);
    };
  
    const eliminarActor = () => {
      console.log("Actor eliminado");
      cerrarPopup();
    };

    return (
        <div className="menu-container">
            <header className="menu-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>Mocar Company /</span>
                    <span onClick={irAMenuProyecto}>Sistema Inventario /</span>
                    <span onClick={irAPlantillas}>Plantillas /</span>
                    <span>Actor</span>
                </div>
            </header>

            <div className="menusub-container">

                <aside className="sidebar">
                    {/*<div className="nav-button">
                            <button className="atras-button">Atras</button>
                            <button className="adelante-button">Adelante</button>
                        </div>*/}
                    <div className="bar-menu">
                        <p1 onClick={irAMenuOrganizaciones}>MENU PRINCIPAL</p1>
                    </div>

                    <div className="profile-section" >
                        <div className="profile-icon">👤</div>
                        <p2>Nombre Autor - Cod</p2>
                        <button onClick={irALogin} className="logout-button" >Cerrar Sesión</button>
                    </div>
                </aside>

                <main className="autor-content">
                    <h2>ACTORES</h2>
                    <section className="autor-organizations-section">
                        <div className="autor-search-section-bar">
                            <button onClick={irANuevoActor} className="autor-register-button">Nuevo Actor</button>
                            <div className="autor-sectionTextBuscar">
                                <span class="message">
                                <input 
                                    className="textBuscar" 
                                    type="text" 
                                    placeholder="Buscar" 
                                    style={{ width: "500px" }} 
                                    />
                                    <span class="tooltip-text">Filtrar información por rol y/o código de actor.</span>
                                </span>
                                
                                <button className="autor-search-button">Buscar</button>
                            </div>
                        </div>

                        <table className="autor-centertabla">
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Rol</th>
                                        <th>Fecha</th>
                                        <th>Versión</th>
                                        <th>Tipo</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>ACT-0001</td>
                                        <td>Documentador</td>
                                        <td>23/10/2023</td>
                                        <td>00.01</td>
                                        <td>Principal</td>
                                        <td>
                                            <button className="botton-crud" onClick={irAVerActor}><FaFolder style={{ color: "orange", cursor: "pointer" }} /></button>
                                            <button className="botton-crud" onClick={irAEditarActor}><FaPencilAlt style={{ color: "blue", cursor: "pointer" }} /></button>
                                            <button className="botton-crud" onClick={abrirPopup}><FaTrash style={{ color: "red", cursor: "pointer" }} /></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>ACT-0003</td>
                                        <td>Administrador</td>
                                        <td>23/10/2023</td>
                                        <td>00.01</td>
                                        <td>Principal</td>
                                        <td>
                                            <button className="botton-crud" onClick={irAVerActor}><FaFolder style={{ color: "orange", cursor: "pointer" }} /></button>
                                            <button className="botton-crud" onClick={irAEditarActor}><FaPencilAlt style={{ color: "blue", cursor: "pointer" }} /></button>
                                            <button className="botton-crud" onClick={abrirPopup}><FaTrash style={{ color: "red", cursor: "pointer" }} /></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {mostrarPopup && (
                                <div className="popup-overlay">
                                <div className="popup-content">
                                    <p>¿Está seguro de eliminar este autor?</p>
                                    <button onClick={eliminarActor} className="si-button">
                                    Sí
                                    </button>
                                    <button onClick={cerrarPopup} className="no-button">
                                    No
                                    </button>
                                </div>
                                </div>
                            )}

                        <h4>Total de registros 2</h4>
                            <div className="autor-export-buttons">
                                <span class="message">
                                    <button className="autor-export-button">Excel</button>
                                    <span class="tooltip-text">Generar reporte de los actores en Excel</span>
                                </span>
                                <span class="message">
                                <button className="autor-export-button">PDF</button>
                                    <span class="tooltip-text">Generar reporte de los actores en Pdf</span>
                                </span>
                            </div>

                        <div className="search-section-bar">
                            <button onClick={irAPlantillas} className="atras-button">Regresar</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Actores;