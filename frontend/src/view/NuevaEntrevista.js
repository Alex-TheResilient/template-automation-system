import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/stylesNuevaEntrevista.css';
import '../styles/styles.css';

const NuevaEntrevista = () => {

    const navigate = useNavigate();

    const irAMenuOrganizaciones = () => {
        navigate("/menuOrganizaciones");
    };
    const irAEntrevistas = () => {
        navigate("/entrevistas");
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


    return (
        <div className="rp-container">
            <header className="rp-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>Mocar Company /</span>
                    <span onClick={irAMenuProyecto}>Sistema Inventario /</span>
                    <span onClick={irAEntrevistas}>Entrevistas /</span>
                    <span>Nueva entrevista</span>
                </div>
            </header>

            <div className="rpsub-container">

                <aside className="sidebar">
                    {/*<div className="nav-button">
                            <button className="atras-button">Atras</button>
                            <button className="adelante-button">Adelante</button>
                        </div>*/}
                    <div className="bar-rp">
                        <p1 onClick={irAMenuOrganizaciones}>MENU PRINCIPAL</p1>
                    </div>

                    <div className="profile-section" >
                        <div className="profile-icon">👤</div>
                        <p2>Nombre Autor - Cod</p2>
                        <button onClick={irALogin}className="logout-button" >Cerrar Sesión</button>
                    </div>
                </aside>

                <main className="rp-content">
                    <h2>NUEVA ENTREVISTA</h2>
                    <section className="rp-organization-section">
                        <h3>Formato de Entrevista</h3>
                        <div className="rp-cod-vers">
                            <div className="fiel-cod">
                                <h4>Versión</h4>
                            </div>
                            <div className="fiel-vers">
                                <input disabled type="text" className="inputBloq-field" value="00.01" readOnly size="100" />
                            </div>
                        </div>

                        <div className="rp-cod-vers">
                            <div className="fiel-cod">
                                <h4>Fecha de entrevista *</h4>
                            </div>
                            <div className="fiel-vers">
                                <input className="input-text" type="text"placeholder=""  size="100" />
                            </div>
                        </div>

                        <div className="rp-cod-vers">
                            <div className="fiel-cod">
                                <h4>Código del autor</h4>
                            </div>
                            <div className="fiel-vers">
                                <input disabled type="text" className="inputBloq-field" value="AUT-0000" readOnly size="100" />
                            </div>
                        </div>

                        <div className="rp-cod-vers">
                            <div className="fiel-cod">
                                <h4>Nombre del autor</h4>
                            </div>
                            <div className="fiel-vers">
                                <input disabled type="text" className="inputBloq-field" value="Administrador" readOnly size="100" />
                            </div>
                        </div>
                    </section>

                    <section className="rp-organization-section">
                        <h3>Información básica</h3>

                        <div className="rp-cod-vers">
                            <div className="fiel-cod">
                                <h4>Nombre del entrevistado *</h4>
                            </div>
                            <div className="fiel-vers">
                                <input className="input-text" type="text"placeholder=""  size="100" />
                            </div>
                        </div>

                        <div className="rp-cod-vers">
                            <div className="fiel-cod">
                                <h4>Cargo que ostenta *</h4>
                            </div>
                            <div className="fiel-vers">
                                <input className="input-text" type="text"placeholder=""  size="100" />  
                            </div>
                        </div>
                    </section>

                    <section className="rp-organization-section">
                        <h3>Información del tiempo</h3>
                        <div className="rp-cod-vers">
                            <div className="fiel-cod-e">
                                <h4>Fecha *</h4>
                                <input className="input-text" type="text"placeholder=""  size="50" />
                            </div>
                            <div className="rp-cod-vers">
                                <div className="fiel-cod-e">
                                    <h4>Hora de inicio *</h4>
                                    <input className="input-text" type="text"placeholder=""  size="50" />
                                </div>
                            </div>
                            <div className="rp-cod-vers">
                                <div className="fiel-cod-e">
                                    <h4>Hora de fin *</h4>
                                    <input className="input-text" type="text"placeholder=""  size="50" />
                                </div>
                            </div>
                            <div className="rp-cod-vers">
                                <div className="fiel-cod-e">
                                    <h4>Duración</h4>
                                    <input disabled type="text" className="inputBloq-field" value="47 min" readOnly size="50" />
                                </div>
                            </div>
                            <div className="rp-cod-vers">
                                <div className="fiel-cod-e">
                                    <h4>Observaciones *</h4>
                                    <input className="input-text" type="text"placeholder=""  size="50" />
                                </div>
                            </div>
                        </div>
                        
                    </section>

                    <section className="rp-organization-section">
                        <h3>Agenda</h3>
                        <div className="rp-cod-vers">
                            <div className="fiel-vers">
                                <input disabled type="text" className="inputBloq-field2" value="1" readOnly size="50" />
                            </div>
                            <div className="fiel-vers">
                                <input className="input-text" type="text"placeholder=""  size="100" />
                            </div>
                        </div>

                        <div className="rp-cod-vers">
                            <div className="fiel-vers">
                                <input disabled type="text" className="inputBloq-field2" value="2" readOnly size="50" />
                            </div>
                            <div className="fiel-vers">
                                <input className="input-text" type="text"placeholder=""  size="100" />
                            </div>
                        </div>

                        <div className="rp-cod-vers">
                            <div className="fiel-vers">
                                <input disabled type="text" className="inputBloq-field2" value="3" readOnly size="50" />
                            </div>
                            <div className="fiel-vers">
                                <input className="input-text" type="text"placeholder=""  size="100" />
                            </div>
                        </div>
                        
                    </section>

                    <section className="rp-organization-section">
                        <h3>Conclusiones</h3>
                        <div className="rp-cod-vers">
                            <div className="fiel-vers">
                                <input disabled type="text" className="inputBloq-field2" value="1" readOnly size="50" />
                            </div>
                            <div className="fiel-vers">
                                <input className="input-text" type="text"placeholder=""  size="100" />
                            </div>
                        </div>

                        <div className="rp-cod-vers">
                            <div className="fiel-vers">
                                <input disabled type="text" className="inputBloq-field2" value="2" readOnly size="50" />
                            </div>
                            <div className="fiel-vers">
                                <input className="input-text" type="text"placeholder=""  size="100" />
                            </div>
                        </div>

                        <div className="rp-cod-vers">
                            <div className="fiel-vers">
                                <input disabled type="text" className="inputBloq-field2" value="3" readOnly size="50" />
                            </div>
                            <div className="fiel-vers">
                                <input className="input-text" type="text"placeholder=""  size="100" />
                            </div>
                        </div>
                        
                    </section>

                    <section className="rp-organizations-section">
                        <h3>Observaciones</h3>

                        <div className="input-text">
                            <textarea className="input-fieldtext" rows="3" placeholder="Añadir observaciones encontradas"></textarea>
                        </div>

                        <div className="rp-buttons">
                            <button onClick={irAEntrevistas} className="rp-button" size="50">Cancelar</button>
                            <button onClick={irAEntrevistas} className="rp-button" size="50">Crear</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default NuevaEntrevista;
