import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaFolder, FaPencilAlt, FaTrash } from "react-icons/fa";
import '../../../styles/stylesAutores.css'
import '../../../styles/stylesEliminar.css'
import '../../../styles/styles.css';

const Autores = () => {
    const navigate = useNavigate();
    const { orgcod, projcod, autcod } = useParams();
    // Estado de proyectos y errores
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Estado para los parámetros de búsqueda
    const [searchNombre, setSearchNombre] = useState("");
    const [searchYear, setSearchYear] = useState("");
    const [searchMonth, setSearchMonth] = useState("");

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const fetchAuthors = useCallback(async () => {
        //Obtener o listar expertos de un proyecto
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/authors`);
            //const response = await axios.get(`${API_BASE_URL}/authors`);
            setAuthors(response.data || []);
        } catch (err) {
            setError(
                err.response
                    ? err.response.data.error
                    : "Error al obtener los autores"
            );
        }
    }, [projcod, orgcod, API_BASE_URL]);

    useEffect(() => {

        fetchAuthors();

    }, [fetchAuthors]);
    // Función para buscar autores
    const handleSearch = async () => {
        try {
            setLoading(true);
            let endpoint;
            let params = {};

            // Determinar qué tipo de búsqueda realizar
            if (searchNombre) {
                // Búsqueda por nombre
                endpoint = `${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/sources/search`;
                params.name = searchNombre;
            } else if (searchYear || searchMonth) {
                // Búsqueda por fecha
                endpoint = `${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/sources/search/date`;
                if (searchYear) params.year = searchYear;
                if (searchMonth) params.month = searchMonth;
            } else {
                // Si no hay criterios de búsqueda, cargar todos los proyectos
                await fetchAuthors();
                return;
            }

            const response = await axios.get(endpoint, { params });
            setAuthors(response.data);
            setError(null);
        } catch (err) {
            console.error("Error en la búsqueda:", err);
            setError(err.response?.data?.error || "Error al buscar fuentes");
            setAuthors([]);
        } finally {
            setLoading(false);
        }
    };

    // Eliminar una fuente 
    const deleteAuthor = async (codigo) => {
        try {
            // /organizations/:orgcod/projects/:projcod/sources/:srccod'
            await axios.delete(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/sources/${codigo}`);
            fetchAuthors(); // Refrescar la lista de fuentes después de eliminar uno
        } catch (err) {
            console.error("Error al eliminar la fuente:", err);
            setError(err.response?.data?.error || "Error al eliminar la fuente");
        }
    };

    const [autorAEliminar, setAutorAEliminar] = useState(null); // Estado para el autor a eliminar
    const [mostrarPopup, setMostrarPopup] = useState(false); // Estado para mostrar el popup

    const abrirPopup = () => {
        setMostrarPopup(true);
    };

    const cerrarPopup = () => {
        setMostrarPopup(false);
    };

    const eliminarAutor = async () => {
        if (autorAEliminar) {
            try {
                await axios.delete(`http://localhost:5000/api/authors/${autorAEliminar}`);
                setAuthors(authors.filter((aut) => aut.autCod !== autorAEliminar)); // Filtrar el autor eliminado
                alert("Autor eliminado correctamente");
            } catch (err) {
                setError(err.response ? err.response.data.error : "Error al eliminar el autor");
            }
        }
        cerrarPopup(); // Cerrar el popup después de eliminar
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

    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
    };
    const irAMenuProyecto = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/menuProyecto`);
    };
    const irANuevoAutor = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/authors/new`);
    };
    const irAEditarAutor = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/authors/${autcod}`);
    };
    const irALogin = () => {
        navigate("/");
    };
    const irAListaProyecto = () => {
        navigate(`/organizations/${orgcod}/projects`);
    };

    return (
        <div className="autor-container">
            <header className="ro-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>Mocar Company /</span>
                    <span onClick={irAMenuProyecto}>Sistema Inventario /</span>
                    <span>Autores</span>
                </div>
            </header>

            <div className="autorsub-container">
                <aside className="autor-sidebar">
                    <div className="bar-lista">
                        <p1 onClick={irAMenuOrganizaciones}>MENU PRINCIPAL</p1>
                    </div>

                    <div className="autor-profile-section">
                        <div className="autor-profile-icon">👤</div>
                        <p2>Nombre Autor - Cod</p2>
                        <button onClick={irALogin} className="autor-logout-button">Cerrar Sesión</button>
                    </div>
                </aside>

                <main className="autor-content">
                    <h2>AUTORES</h2>
                    <section className="autor-organizations-section">
                        {/* Busqueda */}
                        <div className="autor-search-section-bar">
                            <button onClick={irANuevoAutor} className="autor-register-button">Nuevo Autor</button>
                            <div className="autor-sectionTextBuscar">
                                <span class="message">
                                    <input
                                        className="autor-textBuscar"
                                        type="text"
                                        placeholder="Buscar"
                                        value={searchNombre}
                                        onChange={(e) => setSearchNombre(e.target.value)}
                                    />
                                    <span class="tooltip-text">Filtrar información por código y/o nombre de autor</span>
                                </span>
                                <button className="autor-search-button" onClick={handleSearch}>Buscar</button>
                            </div>
                        </div>

                        {/* Listar Autores */}
                        {error ? (
                            <p>{error}</p>
                        ) : (
                            <table className="autor-centertabla">
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Nombre</th>
                                        <th>Fecha</th>
                                        <th>Versión</th>
                                        <th>Rol</th>
                                        <th>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {authors.map((author) => (
                                        <tr key={author.code} onClick={() => irAEditarAutor(author.code)}>
                                            <td>{author.code}</td>
                                            <td>{author.firstName}</td>
                                            <td>{new Date(author.creationDate).toLocaleDateString()}</td>
                                            <td>
                                                {new Date(author.modificationDate).toLocaleDateString()}
                                            </td>
                                            <td>{author.status}</td>
                                            <td>{author.version}</td>
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
                                                        irAEditarAutor(author.code); // Llama a la función para editar
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
                                                        deleteAuthor(author.code);//deleteProject(source.code); // Llama a la función de eliminación
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
                        )}

                        {/* Popup de confirmación */}
                        {mostrarPopup && (
                            <div className="popup-overlay">
                                <div className="popup-content">
                                    <p>¿Está seguro de eliminar este autor?</p>
                                    <button onClick={eliminarAutor} className="si-button">Sí</button>
                                    <button onClick={cerrarPopup} className="no-button">No</button>
                                </div>
                            </div>
                        )}

                        <h4 className="autor-h4">Total de registros {authors.length}</h4>
                        <div className="autor-export-buttons">
                            <span class="message">
                                <button className="autor-export-button" onClick={exportToExcel}>Excel</button>
                                <span class="tooltip-text">Generar reporte de la lista de los proyecto en Excel</span>
                            </span>
                            <span class="message">
                                <button className="autor-export-button" onClick={exportToPDF}>PDF</button>
                                <span class="tooltip-text">Generar reporte de la lista de los proyecto en Pdf</span>
                            </span>
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

export default Autores;
