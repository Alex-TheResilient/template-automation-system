import React, { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import '../../styles/stylesPlantillas.css';
import '../../styles/styles.css';

const Plantillas = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { projcod,orgcod } = useParams();
    const { projectId } = location.state || {}; // ✅ Recibe projectId

    const queryParams = new URLSearchParams(location.search);
    const codigo = queryParams.get('projcod');

    const irALogin = () => {
        navigate("/");
    };
    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
    };
    const irAListaProyecto = () => {
        navigate(`/organizations/${orgcod}/projects`);
    };
    const irAMenuProyecto = () => {
        navigate("/menuProyecto", { state: { projectId } });
    };
    const irAEduccion = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/educcion`);
    };
    const irAIlacion = () => {
        navigate("/ilacion");
    };
    const irAEspecificacion = () => {
        navigate("/especificacion");
    };
    const irAArtefactos = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/artifacts`);
    };
    const irAActores = () => {
        navigate("/actores");
    };

    const irARequerimientosNoFuncionales = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/rnf`);
    };

    const irAExpertos = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/experts`); 
    };

    const irAFuentes = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/sources`); // ✅ Con ID
    };

    const irAMetricas = () => {
        navigate("/metricas");
    };

    const irAPruebasDeSoftware = () => {
        navigate("/pruebasSoftware");
    };


    return (
        <div className="menu-container">
            <header className="menu-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>Mocar Company /</span>
                    <span onClick={irAMenuProyecto}>Sistema Inventario /</span>
                    <span>Plantillas</span>
                </div>
            </header>

            <div className="menusub-container">

                <aside className="sidebar">
                    {/*<div className="nav-button">
                            <button className="atras-button">Atras</button>
                            <button className="adelante-button">Adelante</button>
                        </div>*/}
                    <div className="bar-menu">
                    <p1 onClick={irAMenuOrganizaciones}>MENU PRINCIPAL</p1>
                    </div>

                    <div className="profile-section" >
                        <div className="profile-icon">👤</div>
                        <p2>Nombre Autor - Cod</p2>
                        <button classNme="button-sesion" onClick={irALogin} className="logout-button" >Cerrar Sesión</button>
                    </div>
                </aside>

                <main className="main-content">
                    <h2>PLANTILLAS</h2>
                    <section className="plantillas-section">
                        <h3>Plantillas Principales</h3>
                        <div className="button-container-plantillas">
                            <div>
                                <button onClick={irAEduccion} className="educcion-button">EDUCCIÓN</button>
                                <p className="boton-text">    Gestión de riesgos    </p>
                            </div>
                            <div>
                                <button onClick={irAIlacion} className="ilacion-button">ILACIÓN</button>
                                <p className="boton-text">    Gestión de riesgos    </p>
                            </div>
                            <div>
                                <button onClick={irAEspecificacion} className="especificacion-button">ESPECIFICACIÓN</button>
                                <p className="boton-text">    Gestión de riesgos    </p>
                            </div>
                            <div>
                                <button onClick={irAArtefactos} className="artefactos-button">ARTEFACTOS</button>
                            </div>
                        </div>

                    </section>
                    <section className="trazabilidad-section">
                        <h3>Trazabilidad</h3>
                        <div style={{ height: '80px' }}></div>
                    </section>
                    <section className="plantillas-section">
                        <h3>Plantillas Secuandarias</h3>

                        <div class="button-container-plantillas">
                            <div>
                                <button onClick={irAActores} className="actores-button">ACTORES</button>
                            </div>
                            <div>
                                <button onClick={irARequerimientosNoFuncionales} className="req-button">REQUERIMIENTOS NO FUNCIONALES</button>
                                <p className="boton-text">Gestión de riesgos</p>
                            </div>
                            <div>
                                <button onClick={irAExpertos} className="expertos-button">EXPERTOS</button>
                            </div>
                            <div>
                                <button onClick={irAFuentes} className="fuentes-button">FUENTES</button>
                            </div>
                            <div>
                                <button onClick={irAMetricas} className="metricas-button">MÉTRICAS</button>
                                <p className="boton-text">Educción, Ilación, Especificación</p>
                            </div>
                            <div>
                                <button onClick={irAPruebasDeSoftware} className="pruebas-button">PRUEBAS DE SOFTWARE</button>
                                <p className="boton-text">Especificación</p>
                            </div>
                        </div>
                    </section>

                </main>
            </div>
        </div>
    );
};

export default Plantillas;