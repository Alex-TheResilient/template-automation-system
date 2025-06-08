import React, { useState, useCallback, useEffect} from 'react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaFolder, FaPencilAlt, FaTrash } from "react-icons/fa";
import '../../../styles/stylesRoles.css'
import '../../../styles/styles.css';
import axios from 'axios';

const Roles = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const { orgcod, projcod } = location.state || {};
    
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchNombre, setSearchNombre] = useState("");

    const [error, setError] = useState(null);


    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const fetchRoles = useCallback(async () => {
    //Obtener o listar expertos de un proyecto
        try {
            const response = await axios.get(`${API_BASE_URL}/roles`);
            setRoles(response.data.data||[]);
        } catch (err) {
            setError(
                err.response
                ? err.response.data.error
                : "Error al obtener los proyectos"
            );
        }
    }, [API_BASE_URL]);
    
    useEffect(() => {
        
        fetchRoles();
        
    }, [fetchRoles]);


    const irAMenuOrganizaciones = () => {
         navigate("/organizations");
    };
    const irAMenuProyecto = () => {
        navigate(`/projects/${projcod}/menuProyecto`);
    };
    const irANuevoRol = () => {
        navigate("/nuevoRol",{
        state: {
            orgcod: orgcod,
            projcod: projcod
        }
    });
    };

    const deleteRol = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/roles/${id}`);
            fetchRoles(); // Refrescar la lista de proyectos después de eliminar uno
        } catch (err) {
            console.error("Error al eliminar el proyecto:", err);
            setError(err.response?.data?.error || "Error al eliminar el proyecto");
        }
    };

    const irAVerRol = () => {
        navigate("/verRol");
    };
    const irAEditarRol = (idRol,codeRol) => {
        navigate(`/editarRol/${codeRol}`,{
        state: {
            orgcod: orgcod,
            projcod: projcod,
            idRol,
        }
    });
    };
    const irALogin = () => {
        navigate("/");
    };
    const irAListaProyecto = () => {
        navigate(`/organizations/${orgcod}/projects`);
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
                                <span class="message">
                                    <input className="rol-textBuscar" type="text" placeholder="Buscar" size="50"/>
                                    <span class="tooltip-text">Filtrar información por nombre de rol</span>
                                </span>
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
                                {roles.map((rol) => (
                                    <tr key={rol.code}>
                                    <td>{rol.name}</td>
                                    <td>{new Date(rol.creationDate).toLocaleDateString()}</td>
                                    <td>
                                        <button className="botton-crud">
                                            <FaFolder
                                            style={{ color: "orange", cursor: "pointer" }}
                                        /></button>
                                        <button className="botton-crud" onClick={() => irAEditarRol(rol.id,rol.code)}>
                                            <FaPencilAlt 
                                            style={{ color: "blue", cursor: "pointer" }}
                                            />
                                        </button>
                                        <button
                                            className="botton-crud"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Evita que el clic se propague al <tr>
                                                deleteRol(rol.id) // Llama a la función de eliminación
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
                            <span class="message">
                                <button className="rol-export-button">Excel</button>
                                <span class="tooltip-text">Generar reporte de la lista de roles en Excel</span>
                            </span>
                            <span class="message">
                                <button className="rol-export-button">PDF</button>
                                <span class="tooltip-text">Generar reporte de la lista de roles en Pdf</span>
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

export default Roles;