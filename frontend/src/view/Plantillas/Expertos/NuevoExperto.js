// frontend/src/view/RegistroOrganizacion.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import '../../../styles/stylesNuevoExperto.css';
import '../../../styles/styles.css';
import axios from "axios";

const NuevoExperto = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Obtener datos del proyecto del URL
    const { projcod } = useParams();

    const [codigoExperto, setCodigoExperto] = useState("");
    const [version, setVersionExperto] = useState("00.01");
    const [fechaCreacion, setFechaCreacion] = useState(
        new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
    );
    const [fechaModificacion, setFechaModificacion] = useState(
        new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
    );
    
    // Datos controlados por el usuario
    const [apellidoPaterno, setApellidoPaterno] = useState("");
    const [apellidoMaterno, setApellidoMaterno] = useState("");
    const [nombres, setNombres] = useState("");
    const [experiencia, setExperiencia] = useState("");
    const [estado, setEstado] = useState("");
    const [comentario, setComentario] = useState("");
    //Estados para manejar errores
    const [error, setError]=useState(null);

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

    // Obtener el siguiente código de experto
    useEffect(() => {
        const fetchNextCodigoExperto = async () => {
            try {
                
                // Llamar al endpoint usando parámetros de consulta
                const response = await axios.get(`${API_BASE_URL}/proyectos/${projcod}/expertos/nextCodigo`);

                // Asignar el valor recibido al estado
                setCodigoExperto(response.data.nextCode || "EXP-001");
            } catch (err) {
                console.error("Error al obtener el siguiente código de experto:", err);
                setError("No se pudo cargar el siguiente código del experto.");
            }
        };

        fetchNextCodigoExperto();
    }, [API_BASE_URL, projcod]);

    const registrarExperto = async (e) => {
        e.preventDefault();
        try {
            // Realiza la solicitud POST con los datos correctos
            await axios.post(`${API_BASE_URL}/proyectos/${projcod}/expertos`, {
                apellidoMaterno: apellidoMaterno,
                apellidoPaterno: apellidoPaterno,
                nombres: nombres,
                experiencia: experiencia,
                comentario: comentario, // Asumiendo que 'comentario' es un campo adicional
                estado: estado, // Asumiendo que 'estado' es otro campo
            });
            
            // Redirigir a la página de expertos o realizar otra acción
            irAExpertos();
    
        } catch (err) {
            console.error("Error al registrar el experto:", err);
            setError("No se pudo registrar al experto. Inténtalo de nuevo.");
        }
    };
    

    const irAMenuOrganizaciones = () => {
        navigate("/menuOrganizaciones");
    };
    const irAListaProyecto = () => {
        navigate("/listaProyectos");
    };
    const irAFuentes = () => {
    navigate("/fuentes");
    };
    const irAExpertos = () => {
    navigate(`/projects/${projcod}/expertos`);
    };
    const irAPlantillas = () => {
        navigate(`/plantillas`);
      };
    const irAMenuProyecto = (code) => {
    navigate(`/menuProyecto?procod=${code}`);
    };

    // Función para registrar la organización
    

    return (
        <div className="ro-container">
            <header className="ro-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                <span onClick={irAListaProyecto}>Mocar Company /</span>
                <span onClick={irAMenuProyecto}>Sistema Inventario /</span>
                <span onClick={irAPlantillas}>Plantillas /</span>
                <span onClick={irAExpertos}>Expertos /</span>
                <span>Nuevo Experto</span>
                </div>
            </header>

            <div className="rosub-container">
                <aside className="sidebar">
                    <div className="bar-ro">
                        <p1 onClick={irAMenuOrganizaciones}>MENU PRINCIPAL</p1>
                    </div>
                    <div className="profile-section">
                        <div className="profile-icon">👤</div>
                        <p2>Nombre Autor - Cod</p2>
                        <button onClick={() => navigate("/")} className="logout-button">Cerrar Sesión</button>
                    </div>
                </aside>

                <main className="ro-content">
                    <h2>NUEVO EXPERTO</h2>
                    <section className="ro-organization">
                        <h3>
                            <label className="ro-codigo">Código </label>
                            <label className="ro-version">Versión</label>
                            <label className="ro-Fecha">Fecha</label>
                        </h3>
                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <input type="text" className="inputBloq-field" value={codigoExperto}  readOnly size="30" />
                            </div>
                            <div className="ro-fiel-vers">
                                <input type="text" className="inputBloq-field"  value={version} readOnly size="30" />
                            </div>
                            <div className="ro-fiel-fecha">
                                <input type="text" className="inputBloq-field" value={fechaCreacion} readOnly size="30" />
                            </div>
                        </div>

                        <section className="ro-organizations-section">
                        {/* Formulario editable */}
                        <h3>Información Personal</h3>
                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Apellido Parterno*</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={apellidoPaterno} onChange={(e) => setApellidoPaterno(e.target.value)} size="30" />
                                    <span class="tooltip-text">Ingresar el apellido parterno del experto</span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>Apellido Materno*</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={apellidoMaterno} onChange={(e) => setApellidoMaterno(e.target.value)} size="30" />
                                    <span class="tooltip-text">Ingresar el apellido materno del experto </span>
                                </span>
                            </div>
                            <div className="ro-fiel-fecha">
                                <h4>Nombres*</h4>
                                <span class="message">
                                <input className="inputnombre-field" type="text" value={nombres} onChange={(e) => setNombres(e.target.value)} size="30" />
                                    <span class="tooltip-text">Ingresar el nombre del experto </span>
                                </span>
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Experiencia* </h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={experiencia} onChange={(e) => setExperiencia(e.target.value)} size="30" />
                                    <span class="tooltip-text"> Ingresar la experiencia que tiene el experto </span>
                                </span>
                                
                            </div>
                           
                        </div>

                        
                    </section>
                       
                    </section>
                    <section className="ro-organization">
                        <h3>
                            <label className="ro-codigo">Organizacion </label>
                            <label className="ro-version">Autor de plantilla </label>
                            <label className="ro-Fecha">Estado* </label>
                        </h3>
                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <span class="message">
                                    <input type="text" className="inputBloq-field" readOnly size="30" />
                                    <span class="tooltip-text"> Codigo de la Organizacion </span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-vers">
                                <span class="message">
                                    <input type="text" className="inputBloq-field" value="AUT-000"  readOnly size="30" />
                                    <span class="tooltip-text"> Codigo del autor de la plantilla </span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-fecha">
                                <select id="estado" name="estado" required>
                                    <option value="">Seleccione un estado</option>
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                    <option value="pendiente">Pendiente</option>
                                </select>
                            </div>
                        </div>
                    </section>
                    <section className="ro-organizations-section">
                        <h3>Comentario*</h3>
                        <div className="input-text">
                            <textarea className="input-fieldtext" rows="3" value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Añadir comentarios sobre la fuente"></textarea>
                        </div>

                        <div className="ro-buttons">
                            <button onClick={irAExpertos} className="ro-button">Cancelar</button>
                            <button onClick={registrarExperto} className="ro-button">Crear Experto</button>
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default NuevoExperto;
