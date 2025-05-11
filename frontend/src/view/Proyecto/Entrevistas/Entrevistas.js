import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { FaFolder, FaPencilAlt, FaTrash} from "react-icons/fa";
import '../../../styles/stylesEntrevistas.css'
import '../../../styles/stylesEliminar.css'
import '../../../styles/styles.css';


const Entrevistas = () => {
    const navigate = useNavigate();
    const {orgcod, projcod } = useParams();
    const [entrevistas, setEntrevistas] = useState([]);
    const [mostrarPopup, setMostrarPopup] = useState(false);

    useEffect(() => {
        const fetchEntrevistas = async () => {
            try {
                const response = await axios.get(`/api/projects/${projcod}/entrevistas`);
                setEntrevistas(response.data);
            } catch (error) {
                console.error("Error al obtener las entrevistas:", error);
            }
        };

        fetchEntrevistas();
    }, [projcod]);

    const irALogin = () => {
        navigate("/");
    };
    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
    };
    const irAVerEntrevista = () => {
        navigate("/verEntrevista");
    };

    const irANuevaEntrevista = () => {
        navigate(`/projects/${projcod}/entrevistas/new`);
    };

    const irAEditarEntrevista = (entrecod) => {
        navigate(`/projects/${projcod}/entrevistas/${entrecod}`);
    };

    const irAVerEvidencia = () => {
        navigate("/verEvidencia");
    };
    
    const irASubirEvidencia = () => {
        navigate("/nuevaEvidencia");
    };
    const irAMenuProyecto = () => {
        navigate(`/projects/${projcod}/menuProyecto`);
    };
    const irAListaProyecto = () => {
        navigate(`/organizations/${orgcod}/projects`);
    };
 
    const abrirPopup = () => {
      setMostrarPopup(true);
    };
  
    const cerrarPopup = () => {
      setMostrarPopup(false);
    };
  
    const eliminarEntrevista = () => {
      console.log("Entrevista eliminada");
      cerrarPopup();
    };

    const eliminarEvidencia = () => {
        console.log("Evidencia eliminada");
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
                    <span>Entrevistas</span>
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
                    <h2>ENTREVISTAS</h2>
                    <section className="organization-section">
                        <h3>Entrevistas</h3>

                        <div className="search-section-bar">
                            <button onClick={irANuevaEntrevista} className="nueva-entrevista-button">Nueva Entrevista</button>
                            <div className="sectionTextBuscar">
                                <span class="message">
                                <input 
                                    className="textBuscar" 
                                    type="text" 
                                    placeholder="Buscar" 
                                    style={{ width: "500px" }} 
                                    />
                                    <span class="tooltip-text">Filtrar información por nombre de entrevista</span>
                                </span>
                                
                                <button className="search-button">Buscar</button>
                            </div>
                        </div>

                        <div className="menu-tabla-center">
                            <table className="menu-centertabla">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Versión</th>
                                        <th>Fecha</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {entrevistas.map((entrevista) => (
                                        <tr key={entrevista.id}>
                                            <td>{entrevista.nombreEntrevista}</td>
                                            <td>{entrevista.version}</td>
                                            <td>{new Date(entrevista.fechaEntrevista).toLocaleDateString()}</td>
                                            <td>
                                                <button className="botton-crud" onClick={() => navigate(`/projects/${projcod}/entrevistas/${entrevista.id}`)}><FaFolder style={{ color: "orange", cursor: "pointer" }} /></button>
                                                <button className="botton-crud" onClick={() => irAEditarEntrevista(entrevista.id)}><FaPencilAlt style={{ color: "blue", cursor: "pointer" }} /></button>
                                                <button className="botton-crud" onClick={abrirPopup}><FaTrash style={{ color: "red", cursor: "pointer" }} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td>Entrevista 1</td>
                                        <td>00.01</td>
                                        <td>23/10/2023</td>
                                        <td>
                                            <button className="botton-crud" onClick={irAVerEntrevista}><FaFolder style={{ color: "orange", cursor: "pointer" }} /></button>
                                            <button className="botton-crud" onClick={irAEditarEntrevista}><FaPencilAlt style={{ color: "blue", cursor: "pointer" }} /></button>
                                            <button className="botton-crud" onClick={abrirPopup}><FaTrash style={{ color: "red", cursor: "pointer" }} /></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {mostrarPopup && (
                                <div className="popup-overlay">
                                <div className="popup-content">
                                    <p>¿Está seguro de eliminar esta entrevista?</p>
                                    <button onClick={eliminarEntrevista} className="si-button">
                                    Sí
                                    </button>
                                    <button onClick={cerrarPopup} className="no-button">
                                    No
                                    </button>
                                </div>
                                </div>
                            )}
                            
                        </div>

                        <div className="search-section-bar">
                            <h4>Total de registros 2</h4>
                            <div className="export-buttons">
                                <span class="message">
                                    <button className="export-button">Excel</button>
                                    <span class="tooltip-text">Generar reporte de las entrevistas en Excel</span>
                                </span>
                                <span class="message">
                                <button className="export-button">PDF</button>
                                    <span class="tooltip-text">Generar reporte de las entrevistas en Pdf</span>
                                </span>
                            </div>
                        </div>

                    </section>
                    <section className="organizations-section">
                        <h3>Evidencias</h3>

                        <div className="search-section-bar">
                            <button onClick={irASubirEvidencia} className="evidencia-button">Subir Evidencia</button>
                            <div className="sectionTextBuscar">
                                <span class="message">
                                <input 
                                    className="textBuscar" 
                                    type="text" 
                                    placeholder="Buscar" 
                                    style={{ width: "500px" }} 
                                    />
                                    <span class="tooltip-text">Filtrar información por nombre de evidencia</span>
                                </span>
                                <button className="search-button">Buscar</button>
                            </div>
                        </div>

                        <div className="menu-tabla-center">
                            <table className="menu-centertabla">
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Nombre</th>
                                        <th>Entrevista</th>
                                        <th>Fecha</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>FOT-0001</td>
                                        <td>Foto01.jpg</td>
                                        <td>Entrevista 1</td>
                                        <td>23/10/2023</td>
                                        <td>
                                            <button className="botton-crud" onClick={irAVerEvidencia}><FaFolder style={{ color: "orange", cursor: "pointer" }} /></button>
                                            <button className="botton-crud" onClick={abrirPopup}><FaTrash style={{ color: "red", cursor: "pointer" }} /></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>AUD-0001</td>
                                        <td>Audio01.jpg</td>
                                        <td>Entrevista 1</td>
                                        <td>23/10/2023</td>
                                        <td>
                                            <button className="botton-crud" onClick={irAVerEvidencia}><FaFolder style={{ color: "orange", cursor: "pointer" }} /></button>
                                            <button className="botton-crud" onClick={abrirPopup}><FaTrash style={{ color: "red", cursor: "pointer" }} /></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>VID-0001</td>
                                        <td>Video01.jpg</td>
                                        <td>Entrevista 1</td>
                                        <td>23/10/2023</td>
                                        <td>
                                            <button className="botton-crud" onClick={irAVerEvidencia}><FaFolder style={{ color: "orange", cursor: "pointer" }} /></button>
                                            <button className="botton-crud" onClick={abrirPopup}><FaTrash style={{ color: "red", cursor: "pointer" }} /></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {mostrarPopup && (
                                <div className="popup-overlay">
                                <div className="popup-content">
                                    <p>¿Está seguro de eliminar esta evidencia?</p>
                                    <button onClick={eliminarEvidencia} className="si-button">
                                    Sí
                                    </button>
                                    <button onClick={cerrarPopup} className="no-button">
                                    No
                                    </button>
                                </div>
                                </div>
                            )}

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

export default Entrevistas;