import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import '../../../styles/stylesNuevoRol.css';
import '../../../styles/styles.css';
import axios from "axios";

const EditarRol = () => {

    const navigate = useNavigate();
    

    const location = useLocation();
    const { orgcod, projcod, idRol } = location.state || {};

    const [comments, setComments] = useState("");
    const [name, setName] = useState("");
    const [creationDate, setFecha] = useState("");
    const [error, setError] = useState(null);

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

    const fetchRolData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/roles/${idRol}`);
            const data = response.data;
            const rawDate = new Date(data.creationDate);
            const formattedDate = `${rawDate.getDate()}/${rawDate.getMonth() + 1}/${rawDate.getFullYear()}`;
            setFecha(formattedDate);
            setComments(data.comments);
            setName(data.name);
        } catch (err) {
            setError("Error al obtener los datos del experto: " + err.message);
        }
    };

    useEffect(() => {
            fetchRolData();
    }, [idRol]);

    const handleEdit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.put(`${API_BASE_URL}/roles/${idRol}`, {
                name,
                comments, 
            });
    
            if (response.status === 200) {
                alert("Experto actualizado correctamente");
                irARoles();
            }
        } catch (err) {
            setError("Error al actualizar el experto: " + err.message);
        }
    };

    const irAMenuOrganizaciones = () => {
        navigate("/organizations");;
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
        navigate(`/projects/${projcod}/menuProyecto`);
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
                    <span>Editar rol</span>
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
                    <h2>EDITAR ROL</h2>
                  
                    <section className="rr-organization-section">
                        <h3>Informacion del Rol</h3>
                        <div className="rr-cod-vers">
                            <div className="fiel-cod">
                                <h4>Nombre del Rol</h4>
                                <span class="message">
                                    <input
                                    className="inputBloq-field"
                                    type="text"
                                    placeholder=""
                                    size="50"
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    />
                                    <span class="tooltip-text">Modificar nombre del rol</span>
                                </span>
                            </div>
                            <div className="fiel-vers">
                                <h4>Fecha de Creacion</h4>
                                <input
                                    className="inputBloq-field"
                                    type="text"
                                    placeholder=""
                                    readOnly
                                    size="50"
                                    value={creationDate}  
                                    />
                            </div>
                        </div>

                    </section>

                    <section className="rr-organizations-section">
                        <h3>Comentario</h3>

                        <div className="input-text">
                            <textarea 
                            className="input-fieldtext" 
                            rows="3" 
                            value={comments} 
                            onChange={(e) => setComments(e.target.value)} 
                            ></textarea>
                        </div>

                        <div className="rr-buttons">
                            <button onClick={irARoles} className="rp-button" size="50">Cancelar</button>
                            <button onClick={handleEdit} className="rp-button" size="50">Guardar</button>
                        </div>
                    </section>




                </main>
            </div>
        </div>
    );
};

export default EditarRol;
