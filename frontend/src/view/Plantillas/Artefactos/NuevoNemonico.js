import React from "react";
import { useNavigate } from "react-router-dom";
import '../../../styles/stylesNuevoNemonico.css';
import '../../../styles/styles.css';

const NuevoNemonico = () => {

    const navigate = useNavigate();
    
        const irALogin = () => {
            navigate("/");
        };
        const irAMenuOrganizaciones = () => {
            navigate("/menuOrganizaciones");
        };
        const irAVerRiesgo = () => {
            navigate("/verRiesgo");
        };
        
        const irARegistrarRiesgo = () => {
            navigate("/registroRiesgo");
        };
        const irAEditarRiesgo = () => {
            navigate("/editarRiesgo");
        };
        const irAListaProyecto = () => {
            navigate("/listaProyectos");
        };
        const irAMenuProyecto = () => {
            navigate("/menuProyectos");
        };
        const irAPlantillas = () => {
            navigate("/plantillas");
        };
        const irAArtefactos = () => {
            navigate("/artefactos");
        };


    return (
        <div className="rr-container">
            <header className="rr-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>Mocar Company /</span>
                    <span onClick={irAMenuProyecto}>Sistema Inventario /</span>
                    <span onClick={irAPlantillas}>Plantillas /</span>
                    <span onClick={irAArtefactos}>Artefactos /</span>
                    <span>Nuevo nemónico</span>
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
                    <h2>NUEVO NEMÓNICO</h2>
                  
                    <section className="rr-organization-section">
                        <h3>Informacion del Nemónico</h3>
                        <div className="fiel-cod2">
                                <h4>Artefacto*</h4>
                                <span class="message">
                                    <input  className="inputnombre-field" type="text" placeholder=""  size="400" />
                                    <span class="tooltip-text">Nombre del artefacto en donde se creará el nemónico.</span>
                                </span>
                        </div>

                        <div className="fiel-cod2">
                                <h4>Nemónico*</h4>
                                <span class="message">
                                    <input  className="inputnombre-field" type="text" placeholder=""  size="400" />
                                    <span class="tooltip-text">Nemónico a crear, sea lo mas breve y corto posible.</span>
                                </span>

                                
                        </div>

                        <div className="rr-buttons">
                            <button onClick={irAArtefactos} className="rp-button" size="50">Cancelar</button>
                            <button onClick={irAArtefactos} className="rp-button" size="50">Guardar</button>
                        </div>

                    </section>
                </main>
            </div>
        </div>
    );
};

export default NuevoNemonico;
