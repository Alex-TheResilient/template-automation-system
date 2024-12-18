// frontend/src/view/EditarProyecto.js
import React, { useState, useEffect } from "react";
import {useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import '../../styles/stylesRegistroProyecto.css';
import '../../styles/styles.css';

const EditarProyecto = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const queryParams = new URLSearchParams(location.search);
    const orgcod = queryParams.get('orgcod'); // Código de la organización
    const procod = queryParams.get('procod'); // Código del proyecto

    // Estados del proyecto
    const [codigoProyecto, setCodigoProyecto] = useState("");
    const [versionProyecto, setVersionProyecto] = useState("");
    const [nombreProyecto, setNombreProyecto] = useState("");
    const [fechaCreacionProyecto, setFechaCreacionProyecto] = useState("");
    const [fechaModificacionProyecto, setFechaModificacionProyecto] = useState("");
    const [estadoProyecto, setEstadoProyecto] = useState("");
    const [comentariosProyecto, setComentariosProyecto] = useState("");

    const [error, setError] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

    const irAMenuOrganizaciones = () => navigate("/menuOrganizaciones");
    const irAListaProyecto = () => navigate("/listaProyectos");
    const irALogin = () => navigate("/");

    // Cargar los datos del proyecto al montar el componente
    useEffect(() => {
        if (orgcod && procod) {
            const fetchProjectData = async () => {
                try {
                    const response = await axios.get(
                        `${API_BASE_URL}/organizations/${orgcod}/proyectos/${procod}`
                    );
                    const project = response.data;
                    setCodigoProyecto(project.codigo);
                    setNombreProyecto(project.nombre);
                    setVersionProyecto(project.version);
                    setFechaCreacionProyecto(
                        new Date(project.fechaCreacion).toLocaleDateString()
                    );
                    setFechaModificacionProyecto(
                        project.fechaModificacion
                            ? new Date(project.fechaModificacion).toLocaleDateString()
                            : "N/A"
                    );
                    setEstadoProyecto(project.estado || "Activo");
                    setComentariosProyecto(project.comentarios || "");
                } catch (err) {
                    console.error("Error al cargar los datos del proyecto:", err);
                    setError("Error al cargar los datos del proyecto.");
                }
            };

            fetchProjectData();
        } else {
            alert("Código de organización o proyecto no encontrado.");
            navigate("/menuOrganizaciones");
        }
    }, [orgcod, procod, API_BASE_URL, navigate]);

    // Manejar la actualización del proyecto
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `${API_BASE_URL}/organizations/${orgcod}/proyectos/${procod}`,
                {
                    nombre: nombreProyecto,
                    estado: estadoProyecto,
                    comentarios: comentariosProyecto,
                    fechaModificacion: new Date().toISOString(), // Actualizar automáticamente la fecha
                }
            );
            alert("Proyecto actualizado correctamente");
            navigate(`/listaProyectos?orgcod=${orgcod}`);
        } catch (err) {
            console.error("Error al actualizar el proyecto:", err);
            setError("Error al actualizar el proyecto.");
        }
    };
    
    return (
        <div className="rp-container">
            <header className="rp-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>Mocar Company /</span>
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
                                    value={procod}  
                                    readOnly
                                    size="50"
                                />
                            </div>
                            <div className="fiel-vers">
                                <input
                                    disabled
                                    type="text"
                                    className="inputBloq-field"
                                    value={versionProyecto}
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
                                        value={nombreProyecto}  
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
                                    value={fechaCreacionProyecto}  
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
                                    value={fechaModificacionProyecto}  
                                    readOnly
                                    size="50"
                                />
                            </div>
                        </div>

                        <div className="rp-cod-vers">
                            <div className="fiel-cod">
                                <h4>Estado</h4>
                                <input
                                    disabled
                                    type="text"
                                    className="inputBloq-field"
                                    value={estadoProyecto}
                                    readOnly
                                    size="50"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="rp-organizations-section">
                        <h3>Comentario</h3>
                        <div className="input-text">
                            <textarea
                                className="input-fieldtext"
                                name="comments"
                                value={comentariosProyecto} 
                                onChange={(e) => setComentariosProyecto(e.target.value)}
                                rows="3"
                                placeholder=""
                            ></textarea>
                        </div>
                        <div className="rp-buttons">
                    <button onClick={() => navigate(`/listaProyectos?orgcod=${orgcod}`)} className="rp-button">Cancelar</button>
                    <button onClick={handleUpdate} className="rp-button">{procod? "Guardar Cambios" : "Registrar Proyecto"}</button>
                </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default EditarProyecto;
