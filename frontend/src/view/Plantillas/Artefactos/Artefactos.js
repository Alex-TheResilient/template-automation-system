import React, { useState,useCallback, useEffect } from 'react';
import { useNavigate,useParams } from "react-router-dom"
import { FaFolder, FaPencilAlt, FaTrash} from "react-icons/fa";
import '../../../styles/stylesPlantillasPrincipales.css'
import '../../../styles/stylesEliminar.css'
import '../../../styles/styles.css';
import axios from 'axios';

const Artefactos = () => {
    const navigate = useNavigate();
    const { orgcod, projcod } = useParams();
    // Estado de proyectos y errores
    const [mnemonic, setMnemonic] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [noResult, setNoResult] = useState(false);

    // Estados para búsqueda
    const [searchTerm, setSearchTerm] = useState('');

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const fetchMnemonic = useCallback(async () => {
    //Obtener o listar expertos de un proyecto
        try {
            const response = await axios.get(`${API_BASE_URL}/artifacts`);
            setMnemonic(response.data.data); 
        } catch (err) {
            setError(
                err.response
                ? err.response.data.error
                : "Error al obtener los proyectos"
            );
        }
    }, [API_BASE_URL]);

    useEffect(() => {
    
        fetchMnemonic();
    
    }, [fetchMnemonic]);

    const handleSearch = async (searchType) => { 
    setLoading(true);
    try {
        let response;
        if (searchTerm) { 
            if (searchType === 'name') {
                response = await axios.get(`${API_BASE_URL}/artifacts/search/name`, {
                    params: { query: searchTerm } 
                });
            } else if (searchType === 'mnemonic') {
                response = await axios.get(`${API_BASE_URL}/artifacts/search/mnemonic`, {
                    params: { query: searchTerm } 
                });
            }
        } else {
            response = await axios.get(`${API_BASE_URL}/artifacts`);
        }
        const data = response.data.data || []; 
        setMnemonic(data);
        setNoResult(data.length === 0);
        setError(null);
        } catch (err) {
            setError(err.response?.data?.error || "Error al buscar artefactos");
        } finally {
            setLoading(false);
        }
    };


    const irALogin = () => {
        navigate("/");
    };
    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
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
        navigate(`/organizations/${orgcod}/projects/${projcod}/menuProyecto`);
    };
    const irAPlantillas = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/plantillas`);
    };

    const irANuevoNemonico = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/artifacts/new`);
    };
    const irASubirInterfaz = () => {
        navigate("/subirInterfaz");
    };

    const [mostrarPopup, setMostrarPopup] = useState(false);
  
    const abrirPopup = () => {
      setMostrarPopup(true);
    };
  
    const cerrarPopup = () => {
      setMostrarPopup(false);
    };
  
    const eliminarNemonico = () => {
      console.log("Nemonico eliminado");
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
                    <span>Artefactos</span>
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
                    <h2>ARTEFACTOS</h2>
                    <section className="pp-section">
                        <h3>Neumonicos de los Artefactos</h3>

                        <div className="search-section-bar">
                            <button onClick={irANuevoNemonico} className="nuevo-pp-button">Nuevo Nemónico</button>
                            <div className="sectionTextBuscar">
                                <span class="message">
                                <input
                                    className="textBuscar"
                                    type="text"
                                    placeholder="Buscar por Artefacto o Nemónico" 
                                    style={{ width: "500px" }}
                                    value={searchTerm} 
                                    onChange={(e) => setSearchTerm(e.target.value)} 
                                />
                                    <span class="tooltip-text">Filtrar información por artefacto o por neumonico</span>
                                </span>
                                
                                <button className="search-button" onClick={() => handleSearch('name')}>Búsqueda por Artefacto</button>
                                <button className="search-button" onClick={() => handleSearch('mnemonic')}>Búsqueda por Nemónico</button>
                            </div>
                        </div>

                       

                        <div className="menu-tabla-center">
                            <table className="menu-centertabla">
                                <thead>
                                    <tr>
                                        <th>ARTEFACTO</th>
                                        <th>NEMÓNICO</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mnemonic.map((mn) => (
                                    <tr key={mn.id}>
                                        <td>{mn.name}</td>
                                        <td>{mn.mnemonic}</td>
                                    </tr>  
                                    ))}
                                </tbody>
                            </table>                                          
                        </div>                          
                    </section>
                    
                    <section className="pp-section">
                        <h3>Interfaces Graficas de Usuarios</h3>
                        <div className="search-section-bar">
                            <button onClick={irASubirInterfaz} className="nuevo-pp-button">Subir Interfaz</button>
                            <div className="sectionTextBuscar">
                                <span class="message">
                                <input 
                                    className="textBuscar" 
                                    type="text" 
                                    placeholder="Buscar" 
                                    style={{ width: "500px" }} 
                                    />
                                    <span class="tooltip-text">Filtrar información por nombre o código de interfaz</span>
                                </span>
                                <button className="search-button">Busqueda por Nombre</button>
                                <button className="search-button">Busqueda por Codigo</button>
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
                                        <th>Código </th>
                                        <th>Nombre </th>
                                        <th>Versión</th>
                                        <th>Fecha</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody onClick={irAVerRiesgo}>
                                    <tr>
                                        <td>INT-001</td>
                                        <td>Iniciar Sesion</td>
                                        <td>00.01</td>
                                        <td>26/10/2023</td>
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
                                        <td>INT-002</td>
                                        <td>Menu principal-Emepresas</td>
                                        <td>00.01</td>
                                        <td>26/10/2023</td>
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
                                    <p>¿Está seguro de eliminar esta interfaz?</p>
                                    <button onClick={eliminarNemonico} className="si-button">
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
                                <button className="export-button">PDF</button>
                                    <span class="tooltip-text">Generar reporte de las entrevistas en Pdf</span>
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

export default Artefactos;