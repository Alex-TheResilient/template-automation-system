import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaFolder, FaTrash } from "react-icons/fa";
import '../styles/stylesAutores.css'
import '../styles/stylesEliminar.css'
import '../styles/styles.css';

const Autores = () => {
    const navigate = useNavigate();

    // Organizacion 
    const [authors, setAuthors] = useState([]);
    const [error, setError] = useState(null);

    // Estado para los parámetros de búsqueda
    const [searchNombre, setSearchNombre] = useState();

    // Obtención de la lista de Autores
    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/authors');
                setAuthors(response.data); // Establecer los datos de los autores en el estado
            } catch (err) {
                setError(err.response ? err.response.data.error : 'Error al obtener los autores');
            }
        };
        fetchOrganizations();
    }, []);

    // Función para buscar autores
    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/authors/search', {
                params: { nombre: searchNombre },
            });
            setAuthors(response.data); // actualizar los datos de búsqueda 
        } catch (err) {
            setError(err.response ? err.response.data.error : 'Error al buscar autores');
        }
    };

    // Función de Eliminar Autor
    const handleDelete = async (autCod) => {
        setAutorAEliminar(autCod);  // Establecer el autor a eliminar
        abrirPopup(); // Abrir el popup
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

    // Función para exportar a Excel
    const exportToExcel = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/authors/export/excel', {
                responseType: 'blob', // Importante para manejar archivos
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'authors.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            setError(err.response ? err.response.data.error : 'Error al exportar a Excel');
        }
    };

    // Función para exportar a PDF
    const exportToPDF = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/authors/export/pdf', {
                responseType: 'blob', // Importante para manejar archivos
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'authors.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            setError(err.response ? err.response.data.error : 'Error al exportar a PDF');
        }
    };

    const irAMenuOrganizaciones = () => {
        navigate("/menuOrganizaciones");
    };
    const irAMenuProyecto = () => {
        navigate("/menuProyecto");
    };
    const irANuevoAutor = () => {
        navigate("/nuevoAutor");
    };
    const irALogin = () => {
        navigate("/");
    };
    const irAListaProyecto = () => {
        navigate("/listaProyectos");
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
                                <input
                                    className="autor-textBuscar"
                                    type="text"
                                    placeholder="Buscar"
                                    value={searchNombre}
                                    onChange={(e) => setSearchNombre(e.target.value)}
                                />
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
                                    {authors.map((aut) => (
                                        <tr key={aut.autCod}>
                                            <td>{aut.autCod}</td>
                                            <td>{aut.autNom}</td>
                                            <td>{aut.autFecMod}</td>
                                            <td>{aut.autVer}</td>
                                            <td>{aut.autRol}</td>
                                            <td>
                                                <button className="botton-crud">
                                                    <FaFolder style={{ color: "orange", cursor: "pointer" }} />
                                                </button>
                                                <button
                                                    className="botton-crud"
                                                    onClick={() => handleDelete(aut.autCod)}
                                                >
                                                    <FaTrash style={{ color: "red", cursor: "pointer" }} />
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
                            <button className="autor-export-button" onClick={exportToExcel}>Excel</button>
                            <button className="autor-export-button" onClick={exportToPDF}>PDF</button>
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
