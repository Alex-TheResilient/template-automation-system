import React, { useState } from 'react';
import { useNavigate ,useParams } from "react-router-dom";
import { FaFolder, FaPencilAlt, FaTrash} from "react-icons/fa";
import '../../../styles/stylesPlantillasPrincipales.css'
import '../../../styles/stylesEliminar.css'
import '../../../styles/styles.css';


const Ilacion = () => {
    const navigate = useNavigate();
    const { orgcod, projcod } = useParams();
    const irALogin = () => {
        navigate("/");
    };
    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
    };
    const irAVerEduccion = () => {
        navigate("/verEduccion");
    };
    const irANuevaIlacion = () => {
        navigate("/nuevaIlacion");
    };
    const irAEditarEduccion = () => {
        navigate("/editarEduccion");
    };
    const irAVerRiesgo = () => {
        navigate("/verRiesgo");
    };
    
    const irARegistrarRiesgo = () => {
        navigate("/registroRiesgo");
    };
    const irAEditarRiesgo = () => {
        navigate("/editarRiesgo");
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

    const [mostrarPopup, setMostrarPopup] = useState(false);
  
    const abrirPopup = () => {
      setMostrarPopup(true);
    };
  
    const cerrarPopup = () => {
      setMostrarPopup(false);
    };
  
    const eliminarEduccion = () => {
      console.log("Educcion eliminada");
      cerrarPopup();
    };

    const eliminarRiesgo = () => {
        console.log("Riesgo eliminado");
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
                    <span>Ilación</span>
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

                <main className="main-content">
                    <h2>ILACIÓN</h2>
                    <section className="pp-section">
                        <h3>Gestion de Ilacion</h3>

                        <div className="search-section-bar">
                            <button onClick={irANuevaIlacion} className="nuevo-pp-button">Nueva Ilación</button>
                            <div className="sectionTextBuscar">
                                <span class="message">
                                <input 
                                    className="textBuscar" 
                                    type="text" 
                                    placeholder="Buscar" 
                                    style={{ width: "500px" }} 
                                    />
                                    <span class="tooltip-text">Filtrar información por nombre o código de ilación</span>
                                </span>
                                
                                <button className="search-button">Buscar</button>
                            </div>
                        </div>

                        <div className="pp-search-section-text">
                            <div className="pp-searchbar">
                                <select className="pp-year-input">
                                    <option value="">AÑO</option>
                                    {[2024, 2023, 2022, 2021, 2020].map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                                <select className="pp-month-input">
                                    <option value="">MES</option>
                                    {[
                                        "Enero", 
                                        "Febrero", 
                                        "Marzo", 
                                        "Abril", 
                                        "Mayo", 
                                        "Junio", 
                                        "Julio", 
                                        "Agosto", 
                                        "Septiembre", 
                                        "Octubre", 
                                        "Noviembre", 
                                        "Diciembre"
                                    ].map((month, index) => (
                                        <option key={index} value={index + 1}>
                                            {month}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="menu-tabla-center">
                            <table className="menu-centertabla">
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Nombre</th>
                                        <th>Fecha creación</th>
                                        <th>Fecha modificación</th>
                                        <th>Estado</th>
                                        <th>Versión</th>
                                        <th>Especificaciones</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>ILA-0001</td>
                                        <td>Gestión de plantillas</td>
                                        <td>23/10/2023</td>
                                        <td>26/10/2023</td>
                                        <td>Concluido</td>
                                        <td>00.01</td>
                                        <td>
                                            <button className="option-button">Ver Especificación</button>
                                        </td>
                                        <td>
                                            <button className="botton-crud" /*onClick={irAVerEduccion}*/><FaFolder style={{ color: "orange", cursor: "pointer" }} /></button>
                                            <button className="botton-crud" /*onClick={irAEditarEduccion}*/><FaPencilAlt style={{ color: "blue", cursor: "pointer" }} /></button>
                                            <button className="botton-crud" /*onClick={abrirPopup}*/><FaTrash style={{ color: "red", cursor: "pointer" }} /></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>ILA-0002</td>
                                        <td>Gestión de proyectos</td>
                                        <td>23/10/2023</td>
                                        <td>26/10/2023</td>
                                        <td>Concluido</td>
                                        <td>00.02</td>
                                        <td>
                                            <button className="option-button">Ver Especificación</button>
                                        </td>
                                        <td>
                                            <button className="botton-crud" onClick={irAVerEduccion}><FaFolder style={{ color: "orange", cursor: "pointer" }} /></button>
                                            <button className="botton-crud" onClick={irAEditarEduccion}><FaPencilAlt style={{ color: "blue", cursor: "pointer" }} /></button>
                                            <button className="botton-crud" onClick={abrirPopup}><FaTrash style={{ color: "red", cursor: "pointer" }} /></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {mostrarPopup && (
                                <div className="popup-overlay">
                                <div className="popup-content">
                                    <p>¿Está seguro de eliminar esta ilación?</p>
                                    <button onClick={eliminarEduccion} className="si-button">
                                    Sí
                                    </button>
                                    <button onClick={cerrarPopup} className="no-button">
                                    No
                                    </button>
                                </div>
                                </div>
                            )}
                            
                        </div>

                        <h4>Total de registros 2</h4>
                            <div className="export-buttons">
                                <span class="message">
                                    <button className="export-button">Excel</button>
                                    <span class="tooltip-text">Generar un reporte en Excel</span>
                                </span>
                                <span class="message">
                                <button className="export-button">PDF</button>
                                    <span class="tooltip-text">Generar un reporte en Pdf</span>
                                </span>
                            </div>

                    </section>
                    <section className="pp-section">
                        <h3>Gestión de Riesgos de Ilacion</h3>
                        <div className="search-section-bar">
                            <button onClick={irARegistrarRiesgo} className="nuevo-pp-button">Registrar Riesgo</button>
                            <div className="sectionTextBuscar">
                                <span class="message">
                                <input 
                                    className="textBuscar" 
                                    type="text" 
                                    placeholder="Buscar" 
                                    style={{ width: "500px" }} 
                                    />
                                    <span class="tooltip-text">Filtrar información por nombre o código de ilación</span>
                                </span>
                                <button className="search-button">Buscar</button>
                            </div>
                        </div>

                        <div className="pp-search-section-text">
                            <div className="pp-searchbar">
                                <select className="pp-year-input">
                                    <option value="">AÑO</option>
                                    {[2024, 2023, 2022, 2021, 2020].map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                                <select className="pp-month-input">
                                    <option value="">MES</option>
                                    {[
                                        "Enero", 
                                        "Febrero", 
                                        "Marzo", 
                                        "Abril", 
                                        "Mayo", 
                                        "Junio", 
                                        "Julio", 
                                        "Agosto", 
                                        "Septiembre", 
                                        "Octubre", 
                                        "Noviembre", 
                                        "Diciembre"
                                    ].map((month, index) => (
                                        <option key={index} value={index + 1}>
                                            {month}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="menu-tabla-center">
                            <table className="menu-centertabla">
                                <thead>
                                    <tr>
                                        <th>Código del Requisito</th>
                                        <th>Versión</th>
                                        <th>Responsable</th>
                                        <th>Riesgo Identificado</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody onClick={irAVerRiesgo}>
                                    <tr>
                                        <td>ILA-0001</td>
                                        <td>00.01</td>
                                        <td>AUT-0002</td>
                                        <td>DDDDDDDDDDDDDD</td>
                                        <td>
                                            {/* Evitar que el evento se propague al contenedor */}
                                            <button
                                                className="botton-crud"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    irAEditarRiesgo();
                                                }}
                                            >
                                                <FaPencilAlt style={{ color: "blue", cursor: "pointer" }} />
                                            </button>
                                            <button
                                                className="botton-crud"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    abrirPopup();
                                                }}
                                            >
                                                <FaTrash style={{ color: "red", cursor: "pointer" }} />
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>ILA-0002</td>
                                        <td>00.01</td>
                                        <td>AUT-0003</td>
                                        <td>DDDDDDDDDDDDDD</td>
                                        <td>
                                            {/* Evitar que el evento se propague al contenedor */}
                                            <button
                                                className="botton-crud"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    irAEditarRiesgo();
                                                }}
                                            >
                                                <FaPencilAlt style={{ color: "blue", cursor: "pointer" }} />
                                            </button>
                                            <button
                                                className="botton-crud"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    abrirPopup();
                                                }}
                                            >
                                                <FaTrash style={{ color: "red", cursor: "pointer" }} />
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>

                            </table>

                            {mostrarPopup && (
                                <div className="popup-overlay">
                                <div className="popup-content">
                                    <p>¿Está seguro de eliminar este riesgo?</p>
                                    <button onClick={eliminarRiesgo} className="si-button">
                                    Sí
                                    </button>
                                    <button onClick={cerrarPopup} className="no-button">
                                    No
                                    </button>
                                </div>
                                </div>
                            )}

                        </div>
                        <h4>Total de registros 2</h4>
                            <div className="export-buttons">
                                <span class="message">
                                    <button className="export-button">Excel</button>
                                    <span class="tooltip-text">Generar reporte en Excel</span>
                                </span>
                                <span class="message">
                                <button className="export-button">PDF</button>
                                    <span class="tooltip-text">Generar reporte en Pdf</span>
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

export default Ilacion;