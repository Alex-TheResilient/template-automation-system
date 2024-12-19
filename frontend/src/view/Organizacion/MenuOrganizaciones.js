// frontend/src/view/Organizacion/MenuOrganizaciones.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { FaFolder, FaPencilAlt, FaTrash } from "react-icons/fa";
import '../../styles/stylesMenuOrganizaciones.css';
import '../../styles/styles.css';

const MenuOrganizaciones = () => {

    // Variables de enrutamiento
    const navigate = useNavigate();
    
    const irALogin = () => navigate("/");
    const irAListaProyecto = (orgcod) => navigate(`/organizations/${orgcod}/projects`);
    const irARegistroOrganizacion = () => navigate("/organizations/new");
    const irAEditarOrganizacion = (orgcod) => navigate(`/organizations/${orgcod}`);
   

    // Organizacion 
    const [mainOrganization, setMainOrganization] = useState(null);
    const [organizations, setOrganizations] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Estado para manejar la carga

    //Estado para los parámetros de búsqueda
    const [searchNombre, setSearchNombre] = useState();
    const [searchYear, setSearchYear] = useState();
    const [searchMonth, setSearchMonth] = useState();

    // URL Base del API
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";
    //console.log("direccion API:", API_BASE_URL);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener la organización principal
                const mainOrgResponse = await axios.get(`${API_BASE_URL}/organizations/principal`);
                setMainOrganization(mainOrgResponse.data);

                // Obtener todas las organizaciones excluyendo la principal
                const orgsResponse = await axios.get(`${API_BASE_URL}/organizations`);
                setOrganizations(orgsResponse.data.filter(org => org.codigo !== "ORG-MAIN"));
            } catch (err) {
                setError(err.response?.data?.error || "Error al cargar datos");
            } finally {
                setLoading(false); // Finaliza la carga
            }
        };

        fetchData();
    }, [API_BASE_URL]);

     // Función para eliminar una organización
     const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta organización?")) {
            try {
                await axios.delete(`${API_BASE_URL}/organizations/${id}`);
                setOrganizations((prev) => prev.filter((org) => org.id !== id)); // Actualizar la lista localmente
                alert("Organización eliminada correctamente.");
            } catch (err) {
                setError("Error al eliminar la organización.");
                console.error(err);
            }
        }
    };

    // Función para buscar organizaciones
    const handleSearch = async () => {
        if (!searchNombre && !searchYear && !searchMonth) {
            setError("Ingrese al menos un criterio de búsqueda");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/search`, {
                params: {
                    nombre: searchNombre,
                    year: searchYear,
                    month: searchMonth,
                },
            });
            setOrganizations(response.data);
            setError(null); // Limpiar errores previos
        } catch (err) {
            setError(err.response?.data?.error || "Error al buscar organizaciones");
        } finally {
            setLoading(false);
        }
    };


    //BusquedaPorNombre
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearchNombre = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/search?nombre=${searchTerm}`);
            setOrganizations(response.data);
        } catch (error) {
            console.error('Error al buscar organizaciones:', error);
        }
    };


    // Exportar a Excel
    const exportToExcel = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/export/excel`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'organizaciones.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            setError(err.response?.data?.error || "Error al exportar a Excel");
        }
    };

    // Exportar a PDF
    const exportToPDF = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/export/pdf`, {
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
    
    return (
        <div className="menu-container">
            <header className="menu-header">
                <h1>ReqWizards App</h1>
                <span>Menú Principal /</span>
            </header>

            <div className="menusub-container">

                <aside className="sidebar">
                    <div className="bar-menu">
                        <p1>MENU PRINCIPAL</p1>
                    </div>
                    <div className="profile-section" >
                        <div className="profile-icon">👤</div>
                        <p2>Nombre Autor - Cod</p2>
                        <button onClick={irALogin} className="logout-button" >Cerrar Sesión</button>
                    </div>
                </aside>

                <main className="main-content">
                    <h2>MENÚ PRINCIPAL - EMPRESAS</h2>
                    <section className="organization-section">
                        <h3>Organización Principal</h3>
                        {error ? (
                            <p>{error}</p>
                        ) : mainOrganization ? (
                            <div className="menu-tabla-center">
                                <table className="menu-centertabla">
                                    <thead>
                                        <tr>
                                            <th>Código</th>
                                            <th>Nombre</th>
                                            <th>Fecha creación</th>
                                            <th>Versión</th>
                                            <th>Opciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{mainOrganization.codigo}</td>
                                            <td>{mainOrganization.nombre}</td>
                                            <td>
                                            {new Date(mainOrganization.fechaCreacion).toLocaleDateString()}
                                            </td>
                                            <td>{mainOrganization.version}</td>
                                            <td>
                                                {/*<button className="botton-crud"><FaFolder style={{ color: "orange", cursor: "pointer" }} /></button>
                                                <button className="botton-crud"><FaPencilAlt style={{ color: "blue", cursor: "pointer" }} /></button>
                                            */}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p>Cargando...</p>
                        )}
                    </section>
                    <section className="organizations-section">
                        <h3>Organizaciones</h3>

                        <div className="sectionTextBuscar">
                            <span class="message">
                                <input
                                    className="textBuscar"
                                    type="text"
                                    size="125"
                                    placeholder="Buscar por nombre"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    /*value={searchNombre}
                                    onChange={(e) => setSearchNombre(e.target.value)}*/
                                />
                                <span className="tooltip-text"> Buscar por nombre </span>
                            </span>
                           
                            {/*<button className="search-button" onClick={handleSearch}>Buscar</button>*/}
                            <button className="search-button" onClick={handleSearchNombre}>Buscar</button>
                        </div>

                        {/* Busqueda  */}
                        <div className="search-section-bar">
                            <button onClick={irARegistroOrganizacion}
                                className="register-button">Registrar Organización</button>
                            <div className="searchbar">
                                <select
                                    className="year-input"
                                    value={searchYear}
                                    onChange={(e) => setSearchYear(e.target.value)}
                                >
                                    <option value="">AÑO</option>
                                    <option value="2021">2021</option>
                                    <option value="2022">2022</option>
                                    <option value="2023">2023</option>
                                    <option value="2024">2024</option>
                                    {/* <option>2025</option>  mas años*/}
                                </select>
                                <select
                                    className="month-input"
                                    value={searchMonth}
                                    onChange={(e) => setSearchMonth(e.target.value)}
                                >
                                    <option value="">MES</option>
                                    <option value="01">Enero</option>
                                    <option value="02">Febrero</option>
                                    <option value="03">Marzo</option>
                                </select>
                            </div>
                        </div>
                        {/* Listar Organizaciones  */}
                        {error ? (
                            <p>{error}</p>
                        ) : (
                            <div className="menu-tabla-center">
                                <table className="menu-centertabla">
                                    <thead>
                                        <tr>
                                            <th>Código</th>
                                            <th>Nombre</th>
                                            <th>Fecha creación</th>
                                            <th>Versión</th>
                                            <th>Opciones</th>
                                        </tr>

                                    </thead>
                                    <tbody>
                                        {organizations.map((org) => (
                                            <tr key={org.codigo} onClick={() => irAListaProyecto(org.codigo)}>
                                            <td>{org.codigo}</td>
                                                <td>{org.nombre}</td>
                                                <td>
                                                {new Date(org.fechaCreacion).toLocaleDateString()}
                                                </td>
                                                <td>{org.version}</td>
                                                <td>
                                                    {/* <button className="botton-crud">
                                                        <FaFolder style={{ color: "orange", cursor: "pointer" }} />
                                                     </button> */}
                                                     <button
                                                        className="botton-crud"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Detener la propagación del clic al <tr>
                                                            irAEditarOrganizacion(org.codigo); // Cambiar al uso de la función existente
                                                        }}
                                                    >
                                                        <FaPencilAlt style={{ color: "blue", cursor: "pointer" }} />
                                                    </button>

                                                    <button
                                                        className="botton-crud"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Detener la propagación del clic al <tr>
                                                            handleDelete(org.id);
                                                        }}
                                                    >
                                                        <FaTrash style={{ color: "red", cursor: "pointer" }} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div>
                        )}
                        <h4>Total de registros {organizations.length}</h4>
                        <div className="export-buttons">
                            <button className="export-button" onClick={exportToExcel}>Excel</button>
                            <button className="export-button" onClick={exportToPDF}>PDF</button>
                        </div>
                    </section>

                </main>
            </div>
        </div>
    );
};

export default MenuOrganizaciones;
