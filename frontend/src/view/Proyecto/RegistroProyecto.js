// frontend/src/view/RegistroProyecto.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import '../../styles/stylesRegistroProyecto.css';
import '../../styles/styles.css';

const RegistroProyecto = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Obtener el código de organización desde los parámetros de la URL
    const queryParams = new URLSearchParams(location.search);
    const organizacionCodigo = queryParams.get("orgcod");
    
    if (!organizacionCodigo) {
        alert("No se encontró un código de organización válido.");
        navigate("/menuOrganizaciones");
    }

    // Estados controlados por el usuario
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [estado, setEstado] = useState("Activo");
    const [comentarios, setComentarios] = useState("");

    // Estados automáticos
    const [codigo, setCodigo] = useState("");
    const [version, setVersion] = useState("00.01");
    const [fechaCreacion, setFechaCreacion] = useState(
        new Date().toLocaleDateString("es-ES")
    );
    const [fechaModificacion] = useState("No aplica"); // Valor predeterminado para nuevos proyectos
    
    const [error, setError] = useState(null);

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";
    
    // Obtener el siguiente código del proyecto automáticamente al cargar
    useEffect(() => {
        const fetchNextCodigo = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/proyectos/next-code/${organizacionCodigo}`);
                setCodigo(response.data.nextCode || "PROY-001");
            } catch (err) {
                console.error("Error al obtener el siguiente código:", err);
                setError("No se pudo cargar el siguiente código del proyecto.");
            }
        };
        fetchNextCodigo();
    }, [API_BASE_URL, organizacionCodigo]); 

    // Función para registrar el proyecto
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/proyectos`, {
                nombre,
                descripcion,
                estado,
                comentarios,
                organizacionCodigo,
            });
            alert("Proyecto registrado correctamente");
            navigate(`/listaProyectos?orgcod=${organizacionCodigo}`);
        } catch (err) {
            console.error("Error al registrar el proyecto:", err);
            setError(
                err.response?.data?.error || "No se pudo registrar el proyecto. Inténtalo nuevamente."
            );
        }
    };
        
    const irAMenuOrganizaciones = () => navigate("/menuOrganizaciones");
    const irAMenuProyectos = () => { navigate(`/listaProyectos?orgcod=${organizacionCodigo}`); };
    const irAListaProyecto = () => navigate(`/listaProyectos?orgcod=${organizacionCodigo}`);
    const irALogin = () => navigate("/");
    
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
                    <h2>Nuevo Proyecto</h2>
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
                            <button onClick={handleRegister} className="rp-button">Registrar Proyecto</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default RegistroProyecto;
