import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/stylesNuevoRol.css';
import '../styles/styles.css';

const EditarRol = () => {

    const navigate = useNavigate();

    const irAMenuOrganizaciones = () => {
        navigate("/menuOrganizaciones");
    };
    const irARoles = () => {
        navigate("/Roles");
    };
    const irALogin = () => {
        navigate("/");
    };
    const irAMenuProyecto = () => {
        navigate("/menuProyecto");
    };
    const irAListaProyecto = () => {
        navigate("/listaProyectos");
    };


    //valores iniciales o cargados
    const [nombreRol, setNombreRol] = useState("Diseñador de software"); 
    const [fechaCreacionRol, setFechaCreacionRol] = useState("23/10/2023"); 
    const [comentarioRol, setComentarioRol] = useState("Encargado de realizar interfaces"); 

    // Función para manejar cambios en el input
    const handleChange = (event) => {
        setNombreRol(event.target.value);
        setFechaCreacionRol(event.target.value);
        setComentarioRol(event.target.value);
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
                                    value={nombreRol} 
                                    onChange={handleChange} 
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
                                    value={fechaCreacionRol} 
                                    onChange={handleChange} 
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
                            value={comentarioRol} 
                            onChange={handleChange} 
                            ></textarea>
                        </div>

                        <div className="rr-buttons">
                            <button onClick={irARoles} className="rp-button" size="50">Cancelar</button>
                            <button onClick={irARoles} className="rp-button" size="50">Guardar</button>
                        </div>
                    </section>




                </main>
            </div>
        </div>
    );
};

export default EditarRol;
