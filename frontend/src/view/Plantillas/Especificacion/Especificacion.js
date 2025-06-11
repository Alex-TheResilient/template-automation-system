import React, { useState,useEffect,useCallback } from 'react';
import { useLocation,useNavigate,useParams } from "react-router-dom"
import axios from "axios";
import { FaFolder, FaPencilAlt, FaTrash} from "react-icons/fa";
import '../../../styles/stylesPlantillasPrincipales.css'
import '../../../styles/stylesEliminar.css'
import '../../../styles/styles.css';


const Especificacion = () => {
    const navigate = useNavigate();
    const { orgcod, projcod,educod,ilacod,specod } = useParams();
// Estado de proyectos y errores
    const [espec, setSpecification] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
      
    // Estado para los parámetros de búsqueda
    const [searchNombre, setSearchNombre] = useState("");
    const [searchYear, setSearchYear] = useState("");
    const [searchMonth, setSearchMonth] = useState("");
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const fetchSpecification = useCallback(async () => {
    //Obtener o listar expertos de 
    try {
      const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/${ilacod}/specifications`);
      setSpecification(response.data||[]);
    } catch (err) {
      setError(
        err.response
          ? err.response.data.error
          : "Error al obtener las especificaciones"
      );
    }
  }, [projcod,orgcod,API_BASE_URL]);
    useEffect(() => {
        
        fetchSpecification();
         
      }, [fetchSpecification]);

    const irALogin = () => {
        navigate("/");
    };
    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
    };
    const irAVerEspecificacion = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/${ilacod}/specifications`);
    };
    const irANuevaEspecificacion = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/${ilacod}/specifications/new`);
    };
    const irAEditarEspecificacion = (specod) => {
       navigate(`/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/${ilacod}/specifications/${specod}`);
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
    const irAEducciones = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/educcion`);
    };
    const irAIlaciones = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/educcion/${educod}/ilaciones`);
    };

    const [mostrarPopup, setMostrarPopup] = useState(false);
  
    const abrirPopup = () => {
      setMostrarPopup(true);
    };
  
    const cerrarPopup = () => {
      setMostrarPopup(false);
    };
    // Eliminar una especificacion
    const deleteEspecification = async (specod) => {
        try {
        // /organizations/:orgcod/projects/:projcod/sources/:srccod'
        await axios.delete(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/${ilacod}/specifications/${specod}`);
        fetchSpecification(); // Refrescar la lista de fuentes después de eliminar uno
        } catch (err) {
        console.error("Error al eliminar la especificacion:", err);
        setError(err.response?.data?.error || "Error al eliminar la especificcacion");
        }
    };
    
    // Exportar a Excel
    const exportToExcel = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/sources/exports/excel`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'fuentes.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError(err.response?.data?.error || "Error al exportar a Excel");
        }
    };

    // Exportar a PDF
    const exportToPDF = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/sources/exports/pdf`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'organizaciones.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError(err.response?.data?.error || "Error al exportar a PDF");
        }
    };
    const eliminarRiesgo = () => {
        console.log("Riesgo eliminado");
        cerrarPopup();
      };
    const handleSearch = async () => {
    try {
      setLoading(true);
      let endpoint;
      let params = {};

      // Determinar qué tipo de búsqueda realizar
      if (searchNombre) {
          // Búsqueda por nombre 
          // '/organizations/:orgcod/projects/:projcod/educciones/:educod/ilaciones/:ilacod/specifications/search'
          endpoint = `${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/${ilacod}/specifications/search`;
          params.name = searchNombre;
      } else if (searchYear || searchMonth) {
          // Búsqueda por fecha
          endpoint = `${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/${educod}/ilaciones/${ilacod}/specifications/search/date`;
          if (searchYear) params.year = searchYear;
          if (searchMonth) params.month = searchMonth;
      } else {
          // Si no hay criterios de búsqueda, cargar todos los proyectos
          await fetchSpecification();
          return;
      }

      const response = await axios.get(endpoint, { params });
      setSpecification(response.data);
      setError(null);
  } catch (err) {
      console.error("Error en la búsqueda:", err);
      setError(err.response?.data?.error || "Error al buscar fuentes");
      setSpecification([]);
  } finally {
      setLoading(false);
  }
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
                    <span onClick={irAEducciones}>Educciones /</span>
                    <span onClick={irAIlaciones}>Ilaciones /</span>
                    <span>Especificación</span>
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
                    <h2>ESPECIFICACIÓN</h2>
                    <section className="pp-section">
                        <h3>Gestión de Especificación</h3>

                        <div className="search-section-bar">
                            <button onClick={irANuevaEspecificacion} className="nuevo-pp-button">Nueva Especificación</button>
                            <div className="sectionTextBuscar">
                                <span class="message">
                                <input 
                                    className="textBuscar" 
                                    type="text" 
                                    placeholder="Buscar" 
                                    onChange={(e) => setSearchNombre(e.target.value)}
                                    style={{ width: "500px" }} 
                                    />
                                    <span class="tooltip-text">Filtrar información por código, nombre y estado de gestión de especificación</span>
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
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {espec.map((specification) => (
                                        <tr key={specification.code} onClick={() => irAEditarEspecificacion(specification.code)}>
                                        <td>{specification.code}</td>
                                        <td>{specification.name}</td>
                                        <td>{new Date(specification.creationDate).toLocaleDateString()}</td>
                                        <td>
                                            {new Date(specification.modificationDate).toLocaleDateString()}
                                        </td>
                                        <td>{specification.status}</td>
                                        <td>{specification.version}</td>
                                        <td>
                                            <button className="botton-crud">
                                            <FaFolder
                                                style={{ color: "orange", cursor: "pointer" }}
                                            />
                                            </button>
                                            <button
                                            className="botton-crud"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Evita que el clic se propague al <tr>
                                                irAEditarEspecificacion(specification.code); // Llama a la función para editar
                                            }}
                                            >
                                            <FaPencilAlt
                                                style={{ color: "blue", cursor: "pointer" }}
                                            />
                                            </button>
                                            <button
                                            className="botton-crud"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Evita que el clic se propague al <tr>
                                                deleteEspecification(specification.code);//deleteProject(source.code); // Llama a la función de eliminación
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
                                                        
                        </div>

                        
                            <div className="export-buttons">
                                <span class="message">
                                    <button className="export-button">Excel</button>
                                    <span class="tooltip-text">Generar reporte de las especificaciones en Excel</span>
                                </span>
                                <span class="message">
                                <button className="export-button">PDF</button>
                                    <span class="tooltip-text">Generar reporte de las especificaciones en Pdf</span>
                                </span>
                            </div>

                    </section>
                    <section className="pp-section">
                        <h3>Gestión de Riesgos de Especificación</h3>
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
                                    <span class="tooltip-text">Filtrar información por código del requisito, responsbale o versión dle riesgo</span>
                                </span>
                                <button className="search-button">Buscar</button>
                            </div>
                        </div>

                        <div className="pp-search-section-text">
                            <div className="pp-searchbar">
                                <select className="pp-month-input">
                                <option value="">ESTADO</option>
                                    {[
                                        "Alta", 
                                        "Media", 
                                        "Baja"
                                    ].map((PROBABILITY, index) => (
                                        <option key={index} value={index + 1}>
                                            {PROBABILITY}
                                        </option>
                                    ))}
                                </select>
                                <select className="pp-month-input">
                                    <option value="">ESTADO</option>
                                    {[
                                        "Activo", 
                                        "Cerrado", 
                                        "Mitigado"
                                    ].map((STATE, index) => (
                                        <option key={index} value={index + 1}>
                                            {STATE}
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
                                        <td>ESP-0001</td>
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
                                        <td>ESP-0002</td>
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
                                    <button className="export-button" onclick = {exportToExcel}>Excel</button>
                                    <span class="tooltip-text">Generar reporte de los riesgos de especificación en Excel</span>
                                </span>
                                <span class="message">
                                <button className="export-button">PDF</button>
                                    <span class="tooltip-text">Generar reporte de los riesgos de especificación en Pdf</span>
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

export default Especificacion;