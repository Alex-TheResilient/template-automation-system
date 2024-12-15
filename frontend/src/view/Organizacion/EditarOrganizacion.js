import React, { useState, useEffect } from "react";
import { useNavigate,  useLocation } from "react-router-dom";
import '../../styles/stylesRegistroOrganizacion.css';
import '../../styles/styles.css';
import axios from "axios";

const EditarOrganizacion = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const orgcod = queryParams.get("orgcod"); // Código de la organización desde la URL

    // Estados para los datos de la organización
    const [id, setId] = useState(""); // Estado para almacenar el ID único
    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [telefonoOrganizacion, setTelefonoOrganizacion] = useState("");
    const [representanteLegal, setRepresentanteLegal] = useState("");
    const [telefonoRepresentante, setTelefonoRepresentante] = useState("");
    const [ruc, setRuc] = useState("");
    const [contacto, setContacto] = useState("");
    const [telefonoContacto, setTelefonoContacto] = useState("");
    const [estado, setEstado] = useState("");
    const [comentario, setComentario] = useState("");

    // Datos automáticos (no editables)
    const [codigo, setCodigo] = useState("");
    const [version, setVersion] = useState("");
    const [fecha, setFecha] = useState("");
    const [tipo, setTipo] = useState("Contratante");
    const [autor, setAutor] = useState("AUT-00.00");

    const [error, setError] = useState(null);

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";
    
    useEffect(() => {
        // Obtener los datos de la organización para editar
        const fetchOrganizationData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/organizations/buscar-por-codigo/${orgcod}`);
                const orgData = response.data;

                // Actualizar estados con los datos obtenidos
                setId(orgData.id); // Almacenar el ID único
                setCodigo(orgData.codigo);
                setVersion(orgData.version);
                setFecha(new Date(orgData.fechaCreacion).toLocaleDateString());
                setNombre(orgData.nombre);
                setDireccion(orgData.direccion);
                setTelefonoOrganizacion(orgData.telefono);
                setRepresentanteLegal(orgData.representanteLegal);
                setTelefonoRepresentante(orgData.telefonoRepresentante);
                setRuc(orgData.ruc);
                setContacto(orgData.contacto);
                setTelefonoContacto(orgData.telefonoContacto);
                setEstado(orgData.estado);
                setComentario(orgData.comentarios);
            } catch (err) {
                console.error("Error al obtener los datos de la organización:", err);
                setError("No se pudieron cargar los datos de la organización.");
            }
        };
        fetchOrganizationData();
    }, [API_BASE_URL, orgcod]);

    const irAMenuOrganizaciones = () => {
        navigate("/menuOrganizaciones");
    };

    // Función para editar la organización
    // Función para actualizar la organización
    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_BASE_URL}/organizations/${id}`, {
                nombre,
                direccion,
                telefono: telefonoOrganizacion,
                representanteLegal,
                telefonoRepresentante,
                ruc,
                contacto,
                telefonoContacto,
                estado,
                comentarios: comentario,
            });
            alert("Organización editada correctamente");
            navigate("/menuOrganizaciones");
        } catch (err) {
            console.error("Error al editar la organización:", err);
            setError("Error al editar la organización.");
        }
    };   

    return (
        <div className="ro-container">
            <header className="ro-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span>{orgcod ? "Modificar Organización" : "Registrar Organización"}</span>
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
                    <h2>{orgcod ? "MODIFICAR ORGANIZACIÓN" : "EDITAR ORGANIZACIÓN"}</h2>
                    <section className="ro-organization">
                        <h3>
                            <label className="ro-codigo">Código </label>
                            <label className="ro-version">Versión</label>
                            <label className="ro-Fecha">Fecha</label>
                        </h3>
                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <input type="text" className="inputBloq-field" value={codigo} readOnly size="30" />
                            </div>
                            <div className="ro-fiel-vers">
                                <input type="text" className="inputBloq-field" value={version} readOnly size="30" />
                            </div>
                            <div className="ro-fiel-fecha">
                                <input type="text" className="inputBloq-field" value={fecha} readOnly size="30" />
                            </div>
                        </div>
                    </section>

                    <section className="ro-organization-section">
                        {/* Formulario editable */}
                        <h3>Información de la Organización</h3>
                         <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Nombre</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} size="30" />
                                    <span class="tooltip-text">Editar el nombre del proyecto</span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>Dirección</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} size="30" />
                                    <span class="tooltip-text">Editar la direccion del proyecto </span>
                                </span>
                            </div>
                            <div className="ro-fiel-fecha">
                                <h4>Teléfono Organización</h4>
                                <span class="message">
                                <input className="inputnombre-field" type="text" value={telefonoOrganizacion} onChange={(e) => setTelefonoOrganizacion(e.target.value)} size="30" />
                                    <span class="tooltip-text">Editar el numero telefonico o celular de la organización </span>
                                </span>
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Representante Legal</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={representanteLegal} onChange={(e) => setRepresentanteLegal(e.target.value)} size="30" />
                                    <span class="tooltip-text"> Editar apellidos y nombres del representante legal de la organización </span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>Teléfono Representante</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={telefonoRepresentante} onChange={(e) => setTelefonoRepresentante(e.target.value)} size="30" />  
                                    <span class="tooltip-text"> Editar el numero telefonico o celular del representante legal </span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-fecha">
                                <h4>RUC Organización</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={ruc} onChange={(e) => setRuc(e.target.value)} size="30" />  
                                    <span class="tooltip-text"> Editar el numero de Ruc de la organizacion </span>
                                </span>
                            
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Contacto (Nombre y Apellido)</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={contacto} onChange={(e) => setContacto(e.target.value)} size="30" />
                                    <span class="tooltip-text"> Editar los apellidos y nombres del contacto en la organización </span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>Teléfono del Contacto</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={telefonoContacto} onChange={(e) => setTelefonoContacto(e.target.value)} size="30" />
                                    <span class="tooltip-text"> Editar el nuemero teléfonico o celular del contacto </span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-fecha">
                                <h4>Estado</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={estado} onChange={(e) => setEstado(e.target.value)} size="30" />
                                    <span class="tooltip-text"> Editar el nuemero teléfonico o celular del contacto </span>
                                </span>
                                
                            </div>   
                        </div>
                    
                    </section>
                    <section className="ro-organizations-section">
                        <h3>Comentario</h3>
                        <div className="input-text">
                            <textarea className="input-fieldtext" rows="3" value={comentario} onChange={(e) => setComentario(e.target.value)} ></textarea>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <div className="ro-cod-vers">
                            <button className="ro-button" onClick={handleEdit}>
                                {orgcod ? "Guardar Cambios" : "Registrar Organización"}
                            </button>
                            <button onClick={irAMenuOrganizaciones} className="ro-button">Cancelar</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default EditarOrganizacion;
