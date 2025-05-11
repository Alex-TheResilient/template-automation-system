import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import '../../../styles/stylesNuevaEvidencia.css';
import '../../../styles/styles.css';

const NuevaEvidencia = () => {

    const navigate = useNavigate();
    const {orgcod, projcod } = useParams();
    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
    };
    const irAEntrevistas = () => {
        navigate(`/projects/${projcod}/entrevistas`);
    };
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
                    <span onClick={irAEntrevistas}>Entrevistas /</span>
                    <span>Nueva Evidencia</span>
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
                    <h2>NUEVA EVIDENCIA</h2>
                    
                    <section className="rr-organization-section">
                        <h3>Informacion de la evidencia</h3>
                        <div className="rr-cod-vers">
                            <div className="fiel-cod">
                                <h4>Codigo*</h4>
                                <div class="codigo-box">
                                    <div class="categoria">
                                        <span class="message">
                                            <input type="text" id="categoria" class="codigo-input" value="EVI" readonly />
                                            <span class="tooltip-text"> Categoria en el codigo de la evidencia </span>
                                        </span>
                                        <h5>Categoria </h5>
                                    </div>

                                    <span class="separator">-</span>
                                    <div class="serie">
                                        <span class="message">
                                            <input type="text" id="serie" class="codigo-input" value="0001" readonly />
                                            <span class="tooltip-text"> Serie en el codigo de la evidencia </span>
                                        </span>
                                        
                                        <h5>Serie</h5>
                                    </div>
                                </div>                          
                            </div>
                            <div className="fiel-cod">
                                <h4>Nombre </h4>
                                <span class="message">
                                    <input  className="inputnombre-field" type="text" placeholder=""  size="50" /> 
                                    <span class="tooltip-text"> Ingresar el nombre de la evidencia </span>
                                </span>                          
                            </div>
                            <div className="fiel-cod">
                                <h4>Entrevista</h4>
                                <span class="message">
                                    <input  className="inputeviden-field" type="text" placeholder=""  size="50" /> 
                                    <span class="tooltip-text"> Ingresar la entrevista</span>
                                </span> 
                                
                            </div>
                            <div className="fiel-cod">
                                <h4>Fecha de Creacion</h4>
                                <span class="message">
                                    <input disabled type="text" className="inputBloq-field" value="26/10/23" readOnly size="50" />
                                    <span class="tooltip-text"> Fecha en la que se creo esta evidencia</span>
                                </span> 
                                
                            </div>
                        </div>
                        <div className="rr-cod-vers">
                            <div className="fiel-cod">
                                <span class="message">
                                    <input
                                    type="file"
                                    accept=".jpg,.png,.jpeg,.pdf,.docx"
                                    /*onChange={handleFileChange}*/
                                    className="acta-button"
                                    />
                                    <span class="tooltip-text">Seleccionar archivo de la evidencia</span>
                                </span> 
                            </div>
                            
                            <div className="fiel-cod" >
                                <span >(.jpg .png .jpeg .pdf .docx)</span>
                            </div>
                        </div>
                     
                    </section>

                    <section className="rr-organizations-section">
                        

                        <div className="input-text">
                            <textarea className="input-fieldtext" rows="3" readOnly></textarea>
                        </div>

                        <div className="rr-buttons">
                            <button onClick={irAEntrevistas} className="rp-button" size="50">Cancelar</button>
                            <button onClick={irAEntrevistas} className="rp-button" size="50">Subir</button>
                        </div>
                    </section>




                </main>
            </div>
        </div>
    );
};

export default NuevaEvidencia;
