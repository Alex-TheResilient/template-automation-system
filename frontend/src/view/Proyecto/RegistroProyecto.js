// frontend/src/view/RegistroProyecto.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import '../../styles/stylesRegistroProyecto.css';
import '../../styles/styles.css';

const RegistroProyecto = () => {
    const { orgcod } = useParams(); // Extraer el parámetro de la URL
    
    // Estados del proyecto
    const [code, setCodigoProyecto] = useState("");
    const [version, setVersionProyecto] = useState("00.01"); // Inicializar la versión del proyecto
    const [name, setNombreProyecto] = useState("");
    const [status, setEstadoProyecto] = useState("Active");
    const [comments, setComentariosProyecto] = useState("");
    const [creationDate, setFechaCreacion] = useState(new Date().toLocaleDateString()); // Fecha de creación automática

    const [error, setError] = useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";
    
    const navigate = useNavigate();
    
    const irAListaProyectos = () => navigate(`/organizations/${orgcod}/projects`);
    const irAMenuOrganizaciones = () => navigate("/organizations");
    const irALogin = () => navigate("/");

    // Obtener el siguiente código del proyecto automáticamente al cargar
    useEffect(() => {
        const fetchNextCodigo = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/next-code`);
            setCodigoProyecto(response.data.nextCode || "PROY-001");
        } catch (err) {
            console.error("Error al obtener el siguiente código:", err);
            setError("No se pudo cargar el siguiente código del proyecto.");
        }
        };
        fetchNextCodigo();
    }, [API_BASE_URL, orgcod]);

    // Función para registrar el proyecto
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/organizations/${orgcod}/projects`, {
                code,
                version,
                name,
                status,
                comments,
                creationDate: new Date().toISOString(), // Enviar la fecha de creación en formato ISO
            });
            irAListaProyectos();
        } catch (err) {
        setError(err.response?.data?.error || "Error al crear el proyecto");
        }
    };
    
    return (
        <div className="rp-container">
            <header className="rp-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyectos}>Mocar Company /</span>
                    <span>Nuevo Proyecto</span>
                </div>
            </header>

            <div className="rpsub-container">
                <aside className="sidebar">
                    <div className="bar-rp">
                        <p1 onClick={irAMenuOrganizaciones}>MENU PRINCIPAL</p1>
                    </div>
                    <div className="profile-section">
                        <div className="profile-icon">👤</div>
                        <p>Nombre Autor - Cod</p>
                        <button onClick={irALogin} className="logout-button">Cerrar Sesión</button>
                    </div>
                </aside>

                <main className="rp-content">
                    <h2>Nuevo Proyecto</h2>
                    <section className="rp-organization">
                        <h3>
                            <label className="rp-codigo">Código </label>
                            <label className="rp-version">Versión</label>
                        </h3>
                        <div className="rp-cod-vers">
                            <div className="fiel-cod">
                                <input type="text" className="inputBloq-field" value={code} readOnly />
                            </div>
                            <div className="fiel-vers">
                                <input type="text" className="inputBloq-field" value={version} readOnly size="50"/>
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
                                        type="text"
                                        className="inputnombre-field"
                                        value={name}
                                        onChange={(e) => setNombreProyecto(e.target.value)}
                                        size="200"
                                    />
                                    <span class="tooltip-text"> Ingresar el nombre del proyecto </span>
                                </span>
                                
                            </div>
                            <div className="fiel-cod">
                                <h4>Fecha de Creación</h4>
                                <input
                                    type="text"
                                    className="inputBloq-field"
                                    value={creationDate}
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
                                    value="Active"
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
                                value={comments}
                                onChange={(e) => setComentariosProyecto(e.target.value)}
                                rows="3"
                                placeholder="Añadir comentarios sobre el proyecto"
                            ></textarea>
                        </div>

                        <div className="rp-buttons">
                            <button onClick={irAListaProyectos} className="rp-button" size="50">Cancelar</button>
                            <button onClick={handleRegister} className="rp-button">Registrar Proyecto</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default RegistroProyecto;
