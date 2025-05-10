// frontend/src/view/EditarProyecto.js
import React, { useState, useEffect } from "react";
import {useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import '../../styles/stylesRegistroProyecto.css';
import '../../styles/styles.css';

const EditarProyecto = () => {
    const { orgcod, projcod } = useParams(); // Extraer los parámetros de la URL
    const navigate = useNavigate();

    // Estados del proyecto
    const [code, setCodigoProyecto] = useState("");
    const [version, setVersionProyecto] = useState("");
    const [name, setNombreProyecto] = useState("");
    const [creationDate, setFechaCreacionProyecto] = useState("");
    const [modificationDate, setFechaModificacionProyecto] = useState("");
    const [status, setEstadoProyecto] = useState("");
    const [comments, setComentariosProyecto] = useState("");

    const [error, setError] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

    const irAMenuOrganizaciones = () => navigate("/organizations");
    const irAListaProyectos = () => navigate(`/organizations/${orgcod}/projects`);
    const irALogin = () => navigate("/");

    // Cargar los datos del proyecto al montar el componente
    useEffect(() => {
        if (orgcod && projcod) {
            const fetchProjectData = async () => {
                try {
                    const response = await axios.get(
                        `${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}`
                    );
                    const project = response.data;
                    setCodigoProyecto(project.code);
                    setNombreProyecto(project.name);
                    setVersionProyecto(project.version);
                    setFechaCreacionProyecto(project.creationDate);
                    setFechaModificacionProyecto(
                        project.modificationDate
                            ? new Date(project.modificationDate).toLocaleDateString()
                            : "N/A"
                    );
                    setEstadoProyecto(project.status);
                    setComentariosProyecto(project.comments);
                } catch (err) {
                    setError(err.response?.data?.error || "Error al obtener los datos del proyecto");
                }
            };
            fetchProjectData();
        }
    }, [orgcod, projcod, API_BASE_URL]);
      
    // Manejar la actualización del proyecto
    const handleUpdate = async (e) => {
        try {
            await axios.put(
                `${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}`,
                {
                    name,
                    status,
                    comments,
                    modificationDate: new Date().toISOString(), // Actualizar automáticamente la fecha
                }
            );
            irAListaProyectos();
        } catch (err) {
            setError(err.response?.data?.error || "Error al actualizar el proyecto");
        }
    };
    
    return (
        <div className="rp-container">
            <header className="rp-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyectos}>Mocar Company /</span>
                    <span>Editar Proyecto</span>
                </div>
            </header>

            <div className="rpsub-container">
                <aside className="sidebar">
                    <div className="bar-rp">
                        <p1 onClick={irAMenuOrganizaciones}>MENU PRINCIPAL</p1>
                    </div>
                    <div className="profile-section">
                        <div className="profile-icon">👤</div>
                        <p2>Nombre Autor - Cod</p2>
                        <button onClick={irALogin} className="logout-button">Cerrar Sesión</button>
                    </div>
                </aside>

                <main className="rp-content">
                    <h2>EDITAR PROYECTO</h2>
                    <section className="rp-organization">
                        <h3>
                            <label className="rp-codigo">Código </label>
                            <label className="rp-version">Versión</label>
                        </h3>
                        <div className="rp-cod-vers">
                            <div className="fiel-cod">
                                <input
                                    disabled
                                    type="text"
                                    className="inputBloq-field"
                                    value={projcod}  
                                    readOnly
                                    size="50"
                                />
                            </div>
                            <div className="fiel-vers">
                                <input
                                    disabled
                                    type="text"
                                    className="inputBloq-field"
                                    value={version}
                                    readOnly
                                    size="50"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="rp-organization-section">
                        <h3>Información del Proyecto</h3>
                        <div className="rp-cod-vers">
                            <div className="fiel-cod">
                                <h4>Nombre</h4>
                                <span class="message">
                                    <input
                                        className="inputnombre-field"
                                        type="text"
                                        name="name"
                                        value={name}  
                                        onChange={(e) => setNombreProyecto(e.target.value)}
                                        placeholder=""
                                        size="125"
                                    />
                                    <span class="tooltip-text">Editar el nombre del proyecto</span>
                                </span>
                            </div>
                        </div>

                        <div className="rp-cod-vers">
                            <div className="fiel-cod">
                                <h4>Fecha de Creación</h4>
                                <input
                                    disabled
                                    type="text"
                                    className="inputBloq-field"
                                    value={creationDate}  
                                    readOnly
                                    size="50"
                                />
                            </div>
                            <div className="fiel-vers">
                                <h4>Fecha de Modificación</h4>
                                <input
                                    disabled
                                    type="text"
                                    className="inputBloq-field"
                                    value={modificationDate}  
                                    readOnly
                                    size="50"
                                />
                            </div>
                        </div>

                        <div className="rp-cod-vers">
                            <div className="fiel-cod">
                                <h4>Estado</h4>
                                <select
                                    value={status}
                                    onChange={(e) => setEstadoProyecto(e.target.value)}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="rp-organizations-section">
                        <h3>Comentario</h3>
                        <div className="input-text">
                            <textarea
                                className="input-fieldtext"
                                name="comments"
                                value={comments} 
                                onChange={(e) => setComentariosProyecto(e.target.value)}
                                rows="3"
                                placeholder=""
                            ></textarea>
                        </div>
                        <div className="rp-buttons">
                    <button onClick={irAListaProyectos} className="rp-button">Cancelar</button>
                    <button onClick={handleUpdate} className="rp-button">{projcod? "Guardar Cambios" : "Registrar Proyecto"}</button>
                </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default EditarProyecto;
