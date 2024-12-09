// frontend/src/view/RegistroProyecto.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import '../../styles/stylesRegistroProyecto.css';
import '../../styles/styles.css';

const RegistroProyecto = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const projectToEdit = location.state?.project || null; // Obtener datos del proyecto si existen
    
    // Campos controlados por el usuario
    const [nombre, setNombre] = useState(projectToEdit?.nombre || "");
    const [descripcion, setDescripcion] = useState(projectToEdit?.descripcion || "");
    const [estado, setEstado] = useState(projectToEdit?.estado || "Activo");
    const [comentarios, setComentarios] = useState(projectToEdit?.comentarios || "");

    // Campos automáticos
    const [codigo, setCodigo] = useState(projectToEdit?.codigo || "");
    const [version, setVersion] = useState(projectToEdit?.version || "0.01");

    
    const [error, setError] = useState(null);
    
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";
    
    // Fechas del proyecto
    const [fechaCreacion, setFechaCreacion] = useState(
        projectToEdit?.fechaCreacion
        ? new Date(projectToEdit.fechaCreacion).toLocaleDateString("es-ES")
        : new Date().toLocaleDateString("es-ES") // Fecha actual para un nuevo proyecto
    );
    const [fechaModificacion, setFechaModificacion] = useState(
        projectToEdit?.fechaModificacion
        ? new Date(projectToEdit.fechaModificacion).toLocaleDateString("es-ES")
        : "N/A"
    );
    
    const [fecha, setFecha] = useState(() =>
        new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
    );

    const irAMenuOrganizaciones = () => navigate("/menuOrganizaciones");
    const irAListaProyecto = () => navigate(`/listaProyectos?orgcod=${orgcod}`);
    const irALogin = () => navigate("/");
    const irAMenuProyectos = () => { navigate(`/listaProyectos?orgcod=${organizacionCodigo}`); };

    const queryParams = new URLSearchParams(location.search);
    const orgcod = queryParams.get("orgcod");
    const organizacionCodigo = location.state?.organizacionId || projectToEdit?.organizacionId || orgcod || "";

    // Obtener datos predefinidos del backend
    useEffect(() => {
        console.log("Valor de orgcod:", orgcod);
        if (!projectToEdit) {
          // Si no estamos editando, cargar un nuevo código automáticamente
          const fetchAutomaticData = async () => {
            try {
              const response = await axios.get(`${API_BASE_URL}/proyectos/next-code`);
              const nextCode = response.data.nextCode || "PROJ-001";
              setCodigo(nextCode);
            } catch (err) {
              console.error("Error al obtener el siguiente código:", err);
            }
          };
          fetchAutomaticData();
        }
    }, [API_BASE_URL, projectToEdit]);


    // Función para registrar o actualizar el proyecto
    const handleRegisterOrUpdate = async (e) => {
        e.preventDefault();
        try {
            if (!organizacionCodigo) {
                alert("Es necesario un ID de organización para registrar el proyecto.");
                return;
            }
            if (projectToEdit) {
                // Actualizar proyecto existente
                await axios.put(`${API_BASE_URL}/proyectos/${projectToEdit.id}`, {
                    nombre,
                    descripcion,
                    estado,
                    comentarios,
                    organizacionCodigo,
                });
                alert("Proyecto actualizado correctamente");
            } else {
                // Crear un nuevo proyecto
                await axios.post(`${API_BASE_URL}/proyectos`, {
                    nombre,
                    descripcion,
                    estado,
                    comentarios,
                    organizacionCodigo,
                });
                alert("Proyecto registrado correctamente");
            }
            navigate(`/listaProyectos?orgcod=${organizacionCodigo}`);
        } catch (err) {
            console.error("Error al registrar/actualizar el proyecto:", err);
            if (err.response) {
                console.log("Respuesta del backend:", err.response.data);
            }
            alert("Error al registrar/actualizar el proyecto.");
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
                    <h2>{projectToEdit ? "EDITAR PROYECTO" : "NUEVO PROYECTO"}</h2>
                    <section className="rp-organization">
                        <h3>
                            <label className="rp-codigo">Código </label>
                            <label className="rp-version">Versión</label>
                        </h3>
                        <div className="rp-cod-vers">
                            <div className="fiel-cod">
                                <input type="text" className="inputBloq-field" value={codigo} readOnly />
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
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
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
                                    type="text"
                                    className="inputBloq-field"
                                    value={fechaCreacion}
                                    readOnly
                                    size="50"
                                />
                            </div>
                            <div className="fiel-vers">
                                <h4>Fecha de Modificación</h4>
                                <input
                                    type="text"
                                    className="inputBloq-field"
                                    value={fechaModificacion}
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
                                value={comentarios}
                                onChange={(e) => setComentarios(e.target.value)}
                                rows="3"
                                placeholder="Añadir comentarios sobre el proyecto"
                            ></textarea>
                        </div>

                        <div className="rp-buttons">
                            <button onClick={irAListaProyecto} className="rp-button" size="50">Cancelar</button>
                            <button onClick={handleRegisterOrUpdate} className="rp-button" size="50">Registrar Proyecto</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default RegistroProyecto;
