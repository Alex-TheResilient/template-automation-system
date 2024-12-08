// frontend/src/view/EditarProyecto.js
import React, { useState, useEffect } from "react";
import {useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/stylesRegistroProyecto.css';
import '../styles/styles.css';

const EditarProyecto = () => {
    
    const navigate = useNavigate();
    const irAMenuOrganizaciones = () => navigate("/menuOrganizaciones");
    const irAListaProyecto = () => navigate("/listaProyectos");
    const irALogin = () => navigate("/");

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');
      // Obtiene el ID de la organización desde la URL

    //const { id } = useParams(); // Obtener el ID del proyecto desde la URL
    console.log("ID del proyecto:", code);
    // Valores iniciales
    const [codigoProyecto, setCodigoProyecto] = useState("");
    const [versionProyecto, setVersionProyecto] = useState("0.01");
    const [nombreProyecto, setNombreProyecto] = useState(""); 
    const [fechaCreacionProyecto, setFechaCreacionProyecto] = useState("");
    const [fechaModificacionProyecto, setFechaModificacionProyecto] = useState("");
    const [estadoProyecto, setEstadoProyecto] = useState("");
    const [comentariosProyecto, setComentariosProyecto] = useState("");

    // Cargar los datos del proyecto al montar el componente
    useEffect(() => {
        if (code) {
            // Fetch data de la organización a editar
            const fetchOrganizationData = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/projects/buscar/${code}`);
                    const proyData = response.data;
                    setCodigoProyecto(proyData.code);
                    setNombreProyecto(proyData.name);
                    setFechaCreacionProyecto(proyData.creationDate);
                    setFechaModificacionProyecto(proyData.modificationDate);
                    setEstadoProyecto(proyData.status);
                    setComentariosProyecto(proyData.comments);
                    console.log("Proyecto extraido:", response.data);
                    
                } catch (error) {
                    console.error("Error al cargar el proyecto:", error);
                    alert("Error al cargar el proyecto");
                }

            };
            fetchOrganizationData();
           
        } else {
            // Si no existe orgcod, es un nuevo registro, precargar datos automáticos
            const fetchAutomaticData = async () => {
                try {
                    const response = await axios.get("http://localhost:5000/api/projects/last");
                    const nextCode = response.data.nextCode || "PROJ-001";
                    setCodigoProyecto(nextCode);
                    setFechaModificacionProyecto(new Date().toLocaleDateString());
                } catch (error) {
                    console.error("Error al obtener datos automáticos:", error);
                    alert("No se pudieron cargar los datos automáticos.");
                }
            };
            fetchAutomaticData();
        }
    }, [code]);

    // Manejar la actualización del proyecto
    const handleUpdate = async (e) => {
        //console.log("ID del proyecto para modificar:", code);
        //console.log("Endpoint:", `http://localhost:5000/api/projects/${code}`);
        //console.log("Datos enviados:", proyData);
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/api/projects/proyectos/${code}`, {
                code: codigoProyecto,
                name: nombreProyecto,
                creationDate: fechaCreacionProyecto,
                modificationDate: fechaModificacionProyecto,
                status: estadoProyecto,
                comments: comentariosProyecto,
                
            });
            console.log("Proyecto modificados:", response.data);
            if (response.status === 200) {
                alert("Proyecto editada correctamente");
                irAListaProyecto();
            }
        } catch (error) {
            console.error("Error al editar el proyecto: " + error);
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
                                    value={codigoProyecto}  
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
                    <button onClick={() => navigate("/listaProyectos")} className="rp-button">Cancelar</button>
                    <button onClick={handleUpdate} className="rp-button">{code? "Guardar Cambios" : "Registrar Proyecto"}</button>
                </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default EditarProyecto;
