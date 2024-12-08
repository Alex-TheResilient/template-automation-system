// frontend/src/view/RegistroOrganizacion.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/stylesRegistroOrganizacion.css';
import '../styles/styles.css';
import axios from "axios";

const RegistroOrganizacion = () => {
    const navigate = useNavigate();

    // Datos controlados por el usuario
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

    // Datos automáticos
    const [codigo, setCodigo] = useState("");
    const [version, setVersion] = useState("0.01");
    const [fecha, setFecha] = useState("");
    const [error, setError] = useState(null);

    // Datos fijos
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

    useEffect(() => {
        // Simular la obtención de datos automáticos desde el servidor
        const fetchAutomaticData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/organizations/next-code`);
                const nextCode = response.data.nextCode || "ORG-001";
                const localDate = new Date();
                setFecha(localDate.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }));
                setCodigo(nextCode);
            } catch (err) {
                console.error("Error al obtener el siguiente código:", err);
                setError("No se pudieron cargar los datos automáticos.");
            }
        };
        fetchAutomaticData();
    }, []);

    const irAMenuOrganizaciones = () => { navigate("/menuOrganizaciones"); };

    // Función para registrar la organización
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/organizations`, {
                codigo,               // Generado automáticamente
                version,              // Versión inicial
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

            if (response.status === 201) {
                alert("Organización registrada correctamente");
                irAMenuOrganizaciones();
            }

        } catch (err) {
            console.error("Error al registrar la organización:", err);
            setError(err.response?.data?.error || "Error al registrar la organización.");
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
                                <input type="text" className="inputBloq-field" value={new Date(fecha).toLocaleDateString()} readOnly size="30" />
                            </div>
                        </div>
                    </section>

                    <section className="ro-organization-section">
                        {/* Formulario editable */}
                        <h3>Información del Proyecto</h3>
                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Nombre</h4>
                                <input className="inputnombre-field" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} size="30" />
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>Dirección</h4>
                                <input className="inputnombre-field" type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} size="30" />
                            </div>
                            <div className="ro-fiel-fecha">
                                <h4>Teléfono Organización</h4>
                                <input className="inputnombre-field" type="text" value={telefonoOrganizacion} onChange={(e) => setTelefonoOrganizacion(e.target.value)} size="30" />
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Representante Legal</h4>
                                <input className="inputnombre-field" type="text" value={representanteLegal} onChange={(e) => setRepresentanteLegal(e.target.value)} size="30" />
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>Teléfono Representante</h4>
                                <input className="inputnombre-field" type="text" value={telefonoRepresentante} onChange={(e) => setTelefonoRepresentante(e.target.value)} size="30" />
                            </div>
                            <div className="ro-fiel-fecha">
                                <h4>RUC Organización</h4>
                                <input className="inputnombre-field" type="text" value={ruc} onChange={(e) => setRuc(e.target.value)} size="30" />
                            </div>
                        </div>

                        <div className="ro-cod-vers">
                            <div className="ro-fiel-cod">
                                <h4>Contacto (Nombre y Apellido)</h4>
                                <input className="inputnombre-field" type="text" value={contacto} onChange={(e) => setContacto(e.target.value)} size="30" />
                            </div>
                            <div className="ro-fiel-vers">
                                <h4>Teléfono del Contacto</h4>
                                <input className="inputnombre-field" type="text" value={telefonoContacto} onChange={(e) => setTelefonoContacto(e.target.value)} size="30" />
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
                            <button onClick={handleRegister} className="ro-button">Registrar</button>
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default RegistroOrganizacion;
