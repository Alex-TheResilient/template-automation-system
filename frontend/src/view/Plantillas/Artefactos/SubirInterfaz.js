import React from "react";
import { useNavigate,useParams } from "react-router-dom";
import '../../../styles/stylesRiesgo.css';
import '../../../styles/styles.css';

const SubirInterfaz = () => {
    const { orgcod, projcod } = useParams();
    const navigate = useNavigate();

    const irALogin = () => {
        navigate("/");
    };
    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
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
        navigate(`/organizations/${orgcod}/projects`);
    };
    const irAMenuProyecto = () => {
        navigate(`/projects/${projcod}/menuProyecto`);
    };
    const irAPlantillas = () => {
        navigate(`/projects/${projcod}/plantillas`);
    };
    const irAArtefactos = () => {
        navigate("/artefactos");
    };

    return (
        <div className="ne-container">
            <header className="ne-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>Mocar Company /</span>
                    <span onClick={irAMenuProyecto}>Sistema Inventario /</span>
                    <span onClick={irAPlantillas}>Plantillas /</span>
                    <span onClick={irAArtefactos}>Artefactos /</span>
                    <span>Subir Interfaz</span>
                </div>
                </div>
            </header>

            <div className="nesub-container">

                <aside className="sidebar">
                    {/*<div className="nav-button">
                            <button className="atras-button">Atras</button>
                            <button className="adelante-button">Adelante</button>
                        </div>*/}
                    <div className="bar-ne">
                        <p1 onClick={irAMenuOrganizaciones}>MENU PRINCIPAL</p1>
                    </div>

                    <div className="profile-section" >
                        <div className="profile-icon">👤</div>
                        <p2>Nombre Autor - Cod</p2>
                        <button onClick={irALogin}className="logout-button" >Cerrar Sesión</button>
                    </div>
                </aside>

                <main className="ne-content">
                    <h2>NUEVA INTERFAZ</h2>
                    <section className="ne-organization">
                        <h3 className="ne-label-container">
                            <label className="ne-label">Código*</label>
                            <label className="ne-label">Nombre*</label>
                            <label className="ne-label">Fecha*</label>
                        </h3>
                        <div className="ne-input-container">
                            <input disabled type="text" className="ne-input" value="INT-0001" readOnly />
                            <span className="message">
                                    <input className="input-text" type="text" placeholder="" size="80" />
                                    <span className="tooltip-text">Agregar nombre que identifique a la interfaz creada, generalmente el nombre es equivalente al titulo de la interfaz.</span>
                            </span>
                            <input disabled type="text" className="ne-input" value="23/10/2023" readOnly />
                        </div>

                        
                        
                    </section>
                    <span class="message">
                            <input
                                type="file"
                                accept=".jpg,.png,.jpeg,.pdf,.docx"
                                className="subir-button"
                            />
                            <span class="tooltip-text">Seleccionar imagen de la interfaz realizada</span>
                    </span>
                    <span>(.jpg .png .jpeg )</span>

                    <div className="input-text">
                        <textarea className="input-fieldtext" rows="3" readOnly></textarea>
                    </div>

                    <div className="ne-buttons">
                        <button onClick={irAArtefactos} className="ne-button" size="50">Cancelar</button>
                        <button onClick={irAArtefactos} className="ne-button" size="50">Guardar Interfaz</button>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default SubirInterfaz;
