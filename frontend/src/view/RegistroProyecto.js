// frontend/src/view/RegistroProyecto.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import '../styles/stylesRegistroProyecto.css';
import '../styles/styles.css';

const RegistroProyecto = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const irAMenuOrganizaciones = () => navigate("/menuOrganizaciones");
    const irAListaProyecto = () => navigate(`/listaProyectos?orgcod=${orgcod}`);
    const irALogin = () => navigate("/");

    const queryParams = new URLSearchParams(location.search);
    const orgcod = queryParams.get('orgcod');

    // Estado para los datos del proyecto
    const [projectData, setProjectData] = useState({
        code: "",
        version: "0.01", // Versión inicial
        creationDate: "",
        modificationDate: "",
        name: "",
        comments: "",
    });

    // Obtener datos predefinidos del backend
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const initialResponse = await axios.get("http://localhost:5000/api/projects/initial");
                const { code, creationDate, modificationDate } = initialResponse.data;
    
                setProjectData((prevData) => ({
                    ...prevData,
                    code,
                    creationDate,
                    modificationDate,
                }));
            } catch (error) {
                console.error("Error obteniendo datos iniciales:", error);
            }
        };
    
        fetchInitialData();
    }, []);   

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        setProjectData({
            ...projectData,
            [e.target.name]: e.target.value,
        });
    };

    // Registrar proyecto
    const handleRegisterProject = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/projects", {
                ...projectData,
                status: "En proceso",
                organizationId: orgcod, // Cambia si la organización tiene otro ID
            });
            console.log("Proyecto registrado:", response.data);
            irAListaProyecto();
        } catch (error) {
            console.error("Error registrando proyecto:", error);
        }
    };
    
    return (
        <div className="rp-container">
            <header className="rp-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>Mocar Company /</span>
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
                    <h2>NUEVO PROYECTO</h2>
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
                                    value={projectData.code}  // Mostrar el código desde el estado
                                    readOnly
                                    size="50"
                                />
                            </div>
                            <div className="fiel-vers">
                                <input
                                    disabled
                                    type="text"
                                    className="inputBloq-field"
                                    value={projectData.version}  // Mostrar la versión desde el estado
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
                                        value={projectData.name}  // Mostrar el nombre desde el estado
                                        onChange={handleChange}
                                        size="125"
                                    />
                                    <span class="tooltip-text"> Ingresar el nombre del proyecto </span>
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
                                    value={projectData.creationDate}  // Mostrar la fecha de creación desde el estado
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
                                    value={projectData.modificationDate}  // Mostrar la fecha de modificación desde el estado
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
                                    value="En proceso"
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
                                value={projectData.comments}  // Mostrar los comentarios desde el estado
                                onChange={handleChange}
                                rows="3"
                                placeholder="Añadir comentarios sobre el proyecto"
                            ></textarea>
                        </div>

                        <div className="rp-buttons">
                            <button onClick={irAListaProyecto} className="rp-button" size="50">Cancelar</button>
                            <button onClick={handleRegisterProject} className="rp-button" size="50">Registrar Proyecto</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default RegistroProyecto;
