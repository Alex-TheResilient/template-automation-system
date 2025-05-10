// frontend/src/view/Organizacion/EditarOrganizacion.js
import React, { useState, useEffect } from "react";
import { useNavigate,  useLocation, useParams } from "react-router-dom";
import '../../styles/stylesRegistroOrganizacion.css';
import '../../styles/styles.css';
import axios from "axios";

const EditarOrganizacion = () => {
    const navigate = useNavigate();
    const { orgcod } = useParams(); // Extraer orgcod desde la URL dinamica

    // Estados para los datos de la organización
    const [id, setId] = useState(""); // Estado para almacenar el ID único
    const [name, setNombre] = useState("");
    const [address, setDireccion] = useState("");
    const [phone, setTelefonoOrganizacion] = useState("");
    const [legalRepresentative, setRepresentanteLegal] = useState("");
    const [representativePhone, setTelefonoRepresentante] = useState("");
    const [taxId, setRuc] = useState("");
    const [contact, setContacto] = useState("");
    const [contactPhone, setTelefonoContacto] = useState("");
    const [status, setEstado] = useState("");
    const [comments, setComentario] = useState("");

    // Datos automáticos (no editables)
    const [code, setCodigo] = useState("");
    const [version, setVersion] = useState("");
    const [creationDate, setFecha] = useState("");
    const [tipo, setTipo] = useState("Contratante");
    const [autor, setAutor] = useState("AUT-00.00");

    const [error, setError] = useState(null);

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";
    
    useEffect(() => {
        // Obtener los datos de la organización para editar
        const fetchOrganizationData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}`);
                const orgData = response.data;

                // Actualizar estados con los datos obtenidos
                setId(orgData.id); // Almacenar el ID único
                setCodigo(orgData.code);
                setVersion(orgData.version);
                setFecha(new Date(orgData.creationDate).toLocaleDateString());
                setNombre(orgData.name);
                setDireccion(orgData.address);
                setTelefonoOrganizacion(orgData.phone);
                setRepresentanteLegal(orgData.legalRepresentative);
                setTelefonoRepresentante(orgData.representativePhone);
                setRuc(orgData.taxId);
                setContacto(orgData.contact);
                setTelefonoContacto(orgData.contactPhone);
                setEstado(orgData.status);
                setComentario(orgData.comments);
            } catch (err) {
                console.error("Error al obtener los datos de la organización:", err);
                setError("No se pudieron cargar los datos de la organización.");
            }
        };
        fetchOrganizationData();
    }, [API_BASE_URL, orgcod]);

    // Redirigir al menú de organizaciones
    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
    };

    // Función para actualizar la organización
    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_BASE_URL}/organizations/${orgcod}`, {
                name,
                address,
                phone,
                legalRepresentative,
                representativePhone,
                taxId,
                contact,
                contactPhone,
                status,
                comments,
            });
            alert("Organización editada correctamente");
            navigate("/organizations");
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
                                <input type="text" className="inputBloq-field" value={code} readOnly size="30" />
                            </div>
                            <div className="ro-fiel-vers">
                                <input type="text" className="inputBloq-field" value={version} readOnly size="30" />
                            </div>
                            <div className="ro-fiel-fecha">
                                <input type="text" className="inputBloq-field" value={creationDate} readOnly size="30" />
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
                                    <input className="inputnombre-field" type="text" value={name} onChange={(e) => setNombre(e.target.value)} size="30" />
                                    <span class="tooltip-text">Editar el nombre del proyecto</span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>Dirección</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={address} onChange={(e) => setDireccion(e.target.value)} size="30" />
                                    <span class="tooltip-text">Editar la direccion del proyecto </span>
                                </span>
                            </div>
                            <div className="ro-fiel-fecha">
                                <h4>Teléfono Organización</h4>
                                <span class="message">
                                <input className="inputnombre-field" type="text" value={phone} onChange={(e) => setTelefonoOrganizacion(e.target.value)} size="30" />
                                    <span class="tooltip-text">Editar el numero telefonico o celular de la organización </span>
                                </span>
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Representante Legal</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={legalRepresentative} onChange={(e) => setRepresentanteLegal(e.target.value)} size="30" />
                                    <span class="tooltip-text"> Editar apellidos y nombres del representante legal de la organización </span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>Teléfono Representante</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={representativePhone} onChange={(e) => setTelefonoRepresentante(e.target.value)} size="30" />  
                                    <span class="tooltip-text"> Editar el numero telefonico o celular del representante legal </span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-fecha">
                                <h4>RUC Organización</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={taxId} onChange={(e) => setRuc(e.target.value)} size="30" />  
                                    <span class="tooltip-text"> Editar el numero de Ruc de la organizacion </span>
                                </span>
                            
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Contacto (Nombre y Apellido)</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={contact} onChange={(e) => setContacto(e.target.value)} size="30" />
                                    <span class="tooltip-text"> Editar los apellidos y nombres del contacto en la organización </span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>Teléfono del Contacto</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={contactPhone} onChange={(e) => setTelefonoContacto(e.target.value)} size="30" />
                                    <span class="tooltip-text"> Editar el nuemero teléfonico o celular del contacto </span>
                                </span>
                                
                            </div>
                            <div className="ro-fiel-fecha">
                                <h4>Estado</h4>
                                <span class="message">
                                    <input className="inputnombre-field" type="text" value={status} onChange={(e) => setEstado(e.target.value)} size="30" />
                                    <span class="tooltip-text"> Editar el nuemero teléfonico o celular del contacto </span>
                                </span>
                                
                            </div>   
                        </div>
                    
                    </section>
                    <section className="ro-organizations-section">
                        <h3>Comentario</h3>
                        <div className="input-text">
                            <textarea className="input-fieldtext" rows="3" value={comments} onChange={(e) => setComentario(e.target.value)} ></textarea>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <div className="ro-cod-vers">
                            <button className="ro-button" onClick={handleEdit}>Guardar Cambios</button>
                            <button onClick={irAMenuOrganizaciones} className="ro-button">Cancelar</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default EditarOrganizacion;
