import React, { useState, useCallback, useEffect} from 'react';
import { useLocation, useNavigate ,useParams } from "react-router-dom";
import { FaFolder, FaPencilAlt, FaTrash} from "react-icons/fa";
import '../../../styles/stylesPlantillasPrincipales.css'
import '../../../styles/stylesEliminar.css'
import '../../../styles/styles.css';
import axios from 'axios';


const Ilacion = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { orgcod, projcod,educod } = useParams();

    const [ilaciones, setIlaciones] = useState([]);
    const [riesgos, setRiesgos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchNombre, setSearchNombre] = useState("");

    const [error, setError] = useState(null);
    const { proid } = location.state || {};


    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    
    const fetchIlaciones = useCallback(async () => {
    //Obtener o listar expertos de un proyecto
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones`);
            setIlaciones(response.data.ilaciones||[]);
        } catch (err) {
            setError(
                err.response
                ? err.response.data.error
                : "Error al obtener los proyectos"
            );
        }
    }, [projcod,orgcod,educod,API_BASE_URL]);
    
    useEffect(() => {
        
        fetchIlaciones();
        
    }, [fetchIlaciones]);

     const deleteIlation = async (codigo) => {
        try {
            await axios.delete(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/${codigo}`);
            fetchIlaciones(); // Refrescar la lista de proyectos después de eliminar uno
        } catch (err) {
            console.error("Error al eliminar el proyecto:", err);
            setError(err.response?.data?.error || "Error al eliminar el proyecto");
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            let response;
            if (searchNombre) {
                // Búsqueda por nombre
                response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/search`, {
                    params: { name: searchNombre }
                });
            } else {
                // Sin criterios de búsqueda
                response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones`);
            }
            
            const filteredData = response.data.filter(ilacion => ilacion.code !== "ORG-MAIN");
            setIlaciones(filteredData);
            //setNoResult(filteredData.length === 0);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.error || "Error al buscar organizaciones");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
    }

    const exportToExcel = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/exports/excel`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Ilaciones.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError(err.response?.data?.error || "Error al exportar a Excel");
        }
    };

    const exportToPDF = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/exports/pdf`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Ilaciones.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError(err.response?.data?.error || "Error al exportar a PDF");
        }
    };


    const fetchRiesgos = useCallback(async () => {
    //Obtener o listar educciones de un proyecto
        try {
            const response = await axios.get(`${API_BASE_URL}/projects/${proid}/risks`);
            setRiesgos(response.data||[]);
        } catch (err) {
            setError(
                err.response
                ? err.response.data.error
                : "Error al obtener los proyectos"
            );
        }
    }, [proid,API_BASE_URL]);

    useEffect(() => {
    
        fetchRiesgos();
    
    }, [fetchRiesgos]);



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
        navigate(`/organizations/${orgcod}/projects/${projcod}/educcion/${educod}/ilaciones/new`,{
        state: {
            proid:proid
        }
    });
    };
    const irAEditarIlacion = (ilacod) => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/educcion/${educod}/ilaciones/${ilacod}`,{
        state: {
            proid:proid
        }
    });
    };
    const irAVerRiesgo = () => {
        navigate("/verRiesgo");
    };
    
    const irARegistrarRiesgo = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/riesgoNew`,{
        state: {
            proid:proid
        }
    });
    };
    const irAEditarRiesgo = () => {
        navigate("/editarRiesgo");
    };
    const irAListaProyecto = () => {
        navigate(`/organizations/${orgcod}/projects`);
    };
    const irAMenuProyecto = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/menuproyecto`,{
        state: {
            proid:proid
        }
    });
    };
    const irAPlantillas = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/plantillas`,{
        state: {
            proid:proid
        }
    });
    };

    const irAEduccion = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/educcion`,{
        state: {
            proid:proid
        }
    });
    };
    const irAEspecificaciones = (ilacod) => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/${ilacod}/specifications`,{
        state: {
            proid:proid
        }
    });
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
                    <span onClick={irAEduccion}>Educción /</span>
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
                                <span className="message">
                                <input 
                                    className="textBuscar" 
                                    type="text" 
                                    placeholder="Buscar" 
                                    value={searchNombre}
                                    onChange={(e) => setSearchNombre(e.target.value)}
                                    style={{ width: "500px" }} 
                                    />
                                    <span class="tooltip-text">Filtrar información por nombre o código de ilación</span>
                                </span>
                                
                                <button className="search-button" onClick={handleSearch}>Buscar</button>
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
                                    {ilaciones.map((ilacion) => (
                                        <tr key={ilacion.code}>
                                        <td>{ilacion.code}</td>
                                        <td>{ilacion.name}</td>
                                        <td>{new Date(ilacion.creationDate).toLocaleDateString()}</td>
                                        <td>
                                            {ilacion.modificationDate
                                            ? new Date(ilacion.modificationDate).toLocaleDateString()
                                            : "N/A"}
                                        </td>
                                        <td>{ilacion.status}</td>
                                        <td>{ilacion.version}</td>
                                        <td>{ilacion.ilacion}
                                            <button onClick={() => irAEspecificaciones(ilacion.code)} className="option-button">Ver Especificacion</button>
                                        </td>
                                        <td>
                                            <button className="botton-crud">
                                                <FaFolder
                                                style={{ color: "orange", cursor: "pointer" }}
                                            /></button>
                                            <button className="botton-crud" onClick={() => irAEditarIlacion(ilacion.code)}>
                                                <FaPencilAlt 
                                                style={{ color: "blue", cursor: "pointer" }}
                                                />
                                            </button>
                                            <button
                                                className="botton-crud"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Evita que el clic se propague al <tr>
                                                    deleteIlation(ilacion.code) // Llama a la función de eliminación
                                                    }}
                                                >
                                                <FaTrash
                                                style={{ color: "red", cursor: "pointer" }}
                                                />
                                            </button>
                                        </td>
                                        </tr>
                                    ))}
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

                        <h4>Total de registros {ilaciones.length}</h4>
                            <div className="export-buttons">
                                <span class="message">
                                    <button className="export-button"onClick={exportToExcel}>Excel</button>
                                    <span class="tooltip-text">Generar un reporte en Excel</span>
                                </span>
                                <span class="message">
                                <button className="export-button"onClick={exportToPDF}>PDF</button>
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
                                <button className="search-button"onClick={handleSearch}>Buscar</button>
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
                                <tbody>
                                    {riesgos
                                        .filter((riesgo) => riesgo.entityType === "Ilación")
                                        .map((riesgo, index) => (
                                        <tr key={index}>
                                            <td>{riesgo.registryCode}</td>
                                            <td>{riesgo.code}</td>
                                            <td>AUT-001</td>
                                            <td>{riesgo.description}</td>
                                            <td>
                                            <button
                                                className="botton-crud"
                                                onClick={(e) => {
                                                e.stopPropagation();
                                                irAEditarRiesgo(riesgo.id); // puedes pasar el id
                                                }}
                                            >
                                                <FaPencilAlt style={{ color: "blue", cursor: "pointer" }} />
                                            </button>
                                            <button
                                                className="botton-crud"
                                                onClick={(e) => {
                                                e.stopPropagation();
                                                abrirPopup(riesgo.id); // opcionalmente pasar el id
                                                }}
                                            >
                                                <FaTrash style={{ color: "red", cursor: "pointer" }} />
                                            </button>
                                            </td>
                                        </tr>
                                        ))}
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
                                <button className="export-button" >PDF</button>
                                    <span class="tooltip-text">Generar reporte en Pdf</span>
                                </span>
                            </div>

                        <div className="search-section-bar">
                            <button  className="atras-button"onClick={irAEduccion}>Regresar</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Ilacion;