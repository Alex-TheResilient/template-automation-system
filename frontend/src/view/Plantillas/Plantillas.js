import React, {useState} from "react"
import { useNavigate, useLocation } from "react-router-dom";
import '../../styles/stylesPlantillas.css'
import '../../styles/styles.css';

const Plantillas = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const irALogin = () => {
        navigate("/");
    };
    const irAMenuOrganizaciones = () => {
        navigate("/menuOrganizaciones");
    };
    const irAListaProyecto = () => {
        navigate("/listaProyecto");
    };
    const irAMenuProyecto = () => {
        navigate("/menuProyecto");
    };
    const irAEduccion = () => {
        navigate("/educcion");
    };
    const irAIlacion = () => {
        navigate("/ilacion");
    };
    const irAEspecificacion = () => {
        navigate("/especificacion");
    };
    const irAArtefactos = () => {
        navigate("/artefactos");
    };
    const irAActores = () => {
        navigate("/actores");
    };
    const irARequerimientosNoFuncionales = () => {
        navigate("/requerimientosNoFuncionales");
    };
    const irAExpertos = () => {
        navigate("/expertos");
    };
    const irAFuentes = () => {
        navigate("/fuentes");
    };
    const irAMetricas = () => {
        navigate("/metricas");
    };
    const irAPruebasDeSoftware = () => {
        navigate("/pruebasDeSoftware");
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