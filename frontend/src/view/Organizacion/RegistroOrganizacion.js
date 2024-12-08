// frontend/src/view/RegistroOrganizacion.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../../styles/stylesRegistroOrganizacion.css';
import '../../styles/styles.css';
import axios from "axios";

const RegistroOrganizacion = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Detectar datos de navegación
    const organizationToEdit = location.state?.organization || null; // Obtener datos de la organización si existen

    const [fecha, setFecha] = useState(() =>
        new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
    );

    
    // Datos controlados por el usuario
    const [nombre, setNombre] = useState(organizationToEdit?.nombre || "");
    const [direccion, setDireccion] = useState(organizationToEdit?.direccion || "");
    const [telefonoOrganizacion, setTelefonoOrganizacion] = useState(organizationToEdit?.telefono || "");
    const [representanteLegal, setRepresentanteLegal] = useState(organizationToEdit?.representanteLegal || "");
    const [telefonoRepresentante, setTelefonoRepresentante] = useState(organizationToEdit?.telefonoRepresentante || "");
    const [ruc, setRuc] = useState(organizationToEdit?.ruc || "");
    const [contacto, setContacto] = useState(organizationToEdit?.contacto || "");
    const [telefonoContacto, setTelefonoContacto] = useState(organizationToEdit?.telefonoContacto || "");
    const [estado, setEstado] = useState(organizationToEdit?.estado || "");
    const [comentario, setComentario] = useState(organizationToEdit?.comentarios || "");

    // Datos automáticos
    const [codigo, setCodigo] = useState(organizationToEdit?.codigo || "");
    const [version, setVersion] = useState(organizationToEdit?.version || "0.01");
    const [error, setError] = useState(null);

    // Datos fijos
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

    useEffect(() => {
        if (!organizationToEdit) {
            // Si no estamos editando, cargar un nuevo código automáticamente
            const fetchAutomaticData = async () => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/organizations/next-code`);
                    const nextCode = response.data.nextCode || "ORG-001";
                    setCodigo(nextCode);
                } catch (err) {
                    console.error("Error al obtener el siguiente código:", err);
                    setError("No se pudieron cargar los datos automáticos.");
                }
            };
            fetchAutomaticData();
        }
    }, [API_BASE_URL, organizationToEdit]);


    const irAMenuOrganizaciones = () => { navigate("/menuOrganizaciones"); };

    // Función para registrar la organización
    const handleRegisterOrUpdate = async (e) => {
        e.preventDefault();
        try {
            if (organizationToEdit) {
                // Actualizar organización existente
                await axios.put(`${API_BASE_URL}/organizations/${organizationToEdit.id}`, {
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
                alert("Organización actualizada correctamente");
            } else {
                // Crear una nueva organización
                await axios.post(`${API_BASE_URL}/organizations`, {
                    codigo,
                    version,
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
                alert("Organización registrada correctamente");
            }
            irAMenuOrganizaciones();
        } catch (err) {
            console.error("Error al registrar/actualizar la organización:", err);
            setError(err.response?.data?.error || "Error al registrar/actualizar la organización.");
        }
    };

    return (
        <div className="ro-container">
            <header className="ro-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span>Registro de organización</span>
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
                    <h2>NUEVA ORGANIZACIÓN</h2>
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
                                <input type="text" className="inputBloq-field" value={organizationToEdit ? organizationToEdit.fechaCreacion : fecha} readOnly size="30" />
                            </div>
                        </div>
                    </section>

                    <section className="ro-organization-section">
                        {/* Formulario editable */}
                        <h3>Información del Proyecto</h3>
                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Nombre</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} size="30" />
                                    <span class="tooltip-text">Ingresar el nombre del proyecto</span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>Dirección</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} size="30" />
                                    <span class="tooltip-text">Ingresar la direccion del proyecto </span>
                                </span>
                            </div>
                            <div className="ro-fiel-fecha">
                                <h4>Teléfono Organización</h4>
                                <span class="message">
                                <input className="inputnombre-field" type="text" value={telefonoOrganizacion} onChange={(e) => setTelefonoOrganizacion(e.target.value)} size="30" />
                                    <span class="tooltip-text">Ingresar el numero telefonico o celular de la organización </span>
                                </span>
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Representante Legal</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={representanteLegal} onChange={(e) => setRepresentanteLegal(e.target.value)} size="30" />
                                    <span class="tooltip-text"> Ingresar apellidos y nombres del representante legal de la organización </span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>Teléfono Representante</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={telefonoRepresentante} onChange={(e) => setTelefonoRepresentante(e.target.value)} size="30" />  
                                    <span class="tooltip-text"> Ingresar el numero telefonico o celular del representante legal </span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-fecha">
                                <h4>RUC Organización</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={ruc} onChange={(e) => setRuc(e.target.value)} size="30" />  
                                    <span class="tooltip-text"> Ingresar el numero de Ruc de la organizacion </span>
                                </span>
                                
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Contacto (Nombre y Apellido)</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={contacto} onChange={(e) => setContacto(e.target.value)} size="30" />
                                    <span class="tooltip-text"> Ingresar los apellidos y nombres del contacto en la organización </span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>Teléfono del Contacto</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={telefonoContacto} onChange={(e) => setTelefonoContacto(e.target.value)} size="30" />
                                    <span class="tooltip-text"> Ingresar el nuemero teléfonico o celular del contacto </span>
                                </span>
                                
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Tipo</h4>
                                <input type="text" className="inputBloq-field" value="Contratante" readOnly size="30" />
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>Autor</h4>
                                <input type="text" className="inputBloq-field" value="AUT-000" readOnly size="30" />
                            </div>
                            <div className="ro-fiel-fecha">
                                <h4>Estado</h4>
                                <select
                                    className="inputnombre-field"
                                    value={estado}
                                    onChange={(e) => setEstado(e.target.value)}
                                >
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                </select>

                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={estado} onChange={(e) => setEstado(e.target.value)} size="30" />
                                    <span class="tooltip-text"> Ingresar el nuemero teléfonico o celular del contacto </span>
                                </span>

                            </div>
                        </div>
                    </section>

                    <section className="ro-organizations-section">
                        <h3>Comentario</h3>
                        <div className="input-text">
                            <textarea className="input-fieldtext" rows="3" value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Añadir comentarios sobre el proyecto"></textarea>
                        </div>

                        <div className="ro-buttons">
                            <button onClick={irAMenuOrganizaciones} className="ro-button">Cancelar</button>
                            <button onClick={handleRegisterOrUpdate} className="ro-button">
                                {organizationToEdit ? "Actualizar" : "Registrar"}
                            </button>
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default RegistroOrganizacion;
