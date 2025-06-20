import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import '../../../styles/stylesNuevoRol.css';
import '../../../styles/styles.css';
import axios from "axios";

const NuevoRol = () => {

    const navigate = useNavigate();
    
    const location = useLocation();
    const { orgcod, projcod } = location.state || {};

    const [name, setName] = useState("");
    const [creationDate, setCreationDate] = useState(
            new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }));
    const [comments, setComments] = useState("");
    const [error, setError]=useState(null);
    const [errorRol, setErrorRol] = useState("");

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

    const registrarRol = async (e) => {
        e.preventDefault();
        try {
            // Realiza la solicitud POST con los datos correctos
            await axios.post(`${API_BASE_URL}/roles`, {
                name,
                comments,
            });
            
            // Redirigir a la página de expertos o realizar otra acción
            irARoles();
    
        } catch (err) {
            console.error("Error al registrar el experto:", err);
            setError("No se pudo registrar al experto. Inténtalo de nuevo.");
        }
    };


    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
    };

    const irARoles = () => {
        navigate("/roles", {
            state: {
                orgcod: orgcod,
                projcod: projcod
            }
        }
    )};
    
    const irALogin = () => {
        navigate("/");
    };
    const irAMenuProyecto = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/menuProyecto`);
    };
    const irAListaProyecto = () => {
        navigate(`/organizations/${orgcod}/projects`);
    };


    return (
        <div className="rr-container">
            <header className="rr-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>Mocar Company /</span>
                    <span onClick={irAMenuProyecto}>Sistema Inventario /</span>
                    <span onClick={irARoles}>Roles /</span>
                    <span>Nuevo rol</span>
                </div>
            </header>

            <div className="rrsub-container">

                <aside className="sidebar">
                    {/*<div className="nav-button">
                            <button className="atras-button">Atras</button>
                            <button className="adelante-button">Adelante</button>
                        </div>*/}
                    <div className="bar-rr">
                        <p1 onClick={irAMenuOrganizaciones}>MENU PRINCIPAL</p1>
                    </div>

                    <div className="profile-section" >
                        <div className="profile-icon">👤</div>
                        <p2>Nombre Autor - Cod</p2>
                        <button onClick={irALogin}className="logout-button" >Cerrar Sesión</button>
                    </div>
                </aside>

                <main className="rr-content">
                    <h2>NUEVO ROL</h2>
                  
                    <section className="rr-organization-section">
                        <h3>Informacion del Rol</h3>
                        <div className="rr-cod-vers">
                            <div className="fiel-cod">
                                <h4>Nombre del Rol</h4>
                                <span class="message">
                                    <input
                                        className="inputnombre-field"
                                        type="text"
                                        placeholder="Ej. Analista de Requisitos"
                                        value={name}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value.length <= 50) {
                                            setName(value);

                                            if (/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s\-()]*$/.test(value)) {
                                                setErrorRol("");
                                            } else {
                                                setErrorRol("Solo se permiten letras, guiones y paréntesis.");
                                            }
                                            } else {
                                            setErrorRol("Máximo 50 caracteres.");
                                            }
                                        }}
                                        onBlur={() => {
                                            if (!name.trim()) {
                                            setErrorRol("El nombre del rol es obligatorio.");
                                            }
                                        }}
                                        maxLength={50}
                                        size="30"
                                        />
                                        {errorRol && <p style={{ color: 'red', margin: 0 }}>{errorRol}</p>}
                                    <span class="tooltip-text">Nombre del rol que se creará para el proyecto</span>
                                </span>
                            </div>
                            <div className="fiel-vers">
                                <h4>Fecha de Creacion</h4>
                                <input disabled type="text" className="inputBloq-field"  value={creationDate} readOnly size="50" />
                            </div>
                        </div>

                    </section>

                    <section className="rr-organizations-section">
                        <h3>Comentario</h3>

                        <div className="input-text">
                            <textarea className="input-fieldtext" rows="3" value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Añadir comentarios sobre el rol"></textarea>
                        </div>

                        <div className="rr-buttons">
                            <button onClick={irARoles} className="rp-button" size="50">Cancelar</button>
                            <button onClick={registrarRol} className="rp-button" size="50">Crear</button>
                        </div>
                    </section>




                </main>
            </div>
        </div>
    );
};

export default NuevoRol;
