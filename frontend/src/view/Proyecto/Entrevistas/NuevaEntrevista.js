import React, { useState } from "react"; 
import axios from "axios"; 
import { useNavigate, useParams, useLocation } from "react-router-dom";
import '../../../styles/stylesNuevaEntrevista.css';
import '../../../styles/styles.css';

const NuevaEntrevista = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {orgcod, projcod } = useParams();
    const { proid } = location.state || {};

    const [version, setVersion] = useState("01.00");
    const [interviewName, setInterviewName] = useState("");
    const [interviewDate, setInterviewDate] = useState("")
    const [intervieweeName, setIntervieweeName] = useState("");
    const [intervieweeRole, setIntervieweeRol] = useState("");
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [observations, setObservations] = useState("");
    const [authorId, setAuthorId] = useState("6a813a0f-2086-42fc-a373-5c86f05bfa08");
    
    const [agendaItems, setAgendaItems] = useState([""]);
    const [conclusions, setConclusions] = useState([""]);
    
    const [status, setStatus] = useState("");
    const [error, setError]=useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";
    const registrarEntrevista = async (e) => {
        e.preventDefault();
        try {
            // Realiza la solicitud POST con los datos correctos
            await axios.post(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/interviews`, {
                version,
                interviewName,
                interviewDate,
                intervieweeName,
                intervieweeRole,
                startTime,
                endTime,
                observations,
                authorId,
                agendaItems: agendaItems.map(item => ({ description: item })),
                conclusions: conclusions.map(item => ({ description: item }))
            });
            
            // Redirigir a la página de expertos o realizar otra acción
            irAEntrevistas();
    
        } catch (err) {
            console.error("Error al registrar el experto:", err);
            setError("No se pudo registrar al experto. Inténtalo de nuevo.");
        }
    };

    const handleAgendaChange = (index, value) => {
    const updated = [...agendaItems];
    updated[index] = value;
    setAgendaItems(updated);
  };

  const handleConclusionChange = (index, value) => {
    const updated = [...conclusions];
    updated[index] = value;
    setConclusions(updated);
  };

  const addAgendaItem = () => {
    setAgendaItems([...agendaItems, ""]);
  };

  const addConclusion = () => {
    setConclusions([...conclusions, ""]);
  };
    

    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
    };
    const irAEntrevistas = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/entrevistas`,{
        state: {
            proid:proid
        }
    });
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
                                <input disabled type="text" className="inputBloq-field" value={version} readOnly size="100" />
                            </div>
                        </div>

                        <div className="rp-cod-vers">
                            <div className="fiel-cod">
                                <h4>Nombre de la entrevista *</h4>
                            </div>
                            <div className="fiel-vers">
                                <span class="message">
                                    <input className="input-text" value={interviewName} onChange={(e) => setInterviewName(e.target.value)} type="text"placeholder=""  size="100" />
                                    <span class="tooltip-text">Fecha de la entrevista con el cliente</span>
                                </span>
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
                                <span class="message">
                                <input className="input-text" value={intervieweeName} onChange={(e) => setIntervieweeName(e.target.value)} type="text"placeholder=""  size="100" />
                                    <span class="tooltip-text">Nombre del cliente o persona a la que se entrevistará</span>
                                </span>
                            </div>
                        </div>

                        <div className="rp-cod-vers">
                            <div className="fiel-cod">
                                <h4>Cargo que ostenta *</h4>
                            </div>
                            <div className="fiel-vers">
                                <span class="message">
                                    <input className="input-text" value={intervieweeRole} onChange={(e) => setIntervieweeRol(e.target.value)} type="text"placeholder=""  size="100" /> 
                                    <span class="tooltip-text">Cargo que tiene en el proyecto la persona entrevistada. Ej. Cliente, Líder del proyecto, etc.</span>
                                </span>
                            </div>
                        </div>
                    </section>

                    <section className="rp-organization-section">
                        <h3>Información del tiempo</h3>
                        <div className="rp-cod-vers">
                            <div className="fiel-cod-e">
                                <h4>Fecha *</h4>
                                    <span class="message">
                                        <input
                                            className="input-text"
                                            type="date"
                                            value={interviewDate}
                                            onChange={(e) => setInterviewDate(e.target.value)}
                                            size="50"
                                        />
                                        <span class="tooltip-text">Fecha en la que se llevará a cabo la entrevista</span>
                                    </span>
                            </div>
                            <div className="rp-cod-vers">
                                <div className="fiel-cod-e">
                                    <h4>Hora de inicio *</h4>
                                    <span class="message">
                                        <input
                                            className="input-text"
                                            type="time"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            size="50"
                                        />
                                        <span class="tooltip-text">Hora de inicio de la entrevista</span>
                                    </span>
                                </div>
                            </div>
                            <div className="rp-cod-vers">
                                <div className="fiel-cod-e">
                                    <h4>Hora de fin *</h4>
                                    <span class="message">
                                        
                                        <input
                                            className="input-text"
                                            type="time"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            size="50"
                                        />
                                        <span class="tooltip-text">Hora de fin de la entrevista</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                    </section>

                    <section className="rp-organization-section">
                        <h3>Agenda</h3>
                        {agendaItems.map((item, index) => (
                        <div className="rp-cod-vers" key={`agenda-${index}`}>
                            <div className="fiel-vers">
                            <input
                                disabled
                                type="text"
                                className="inputBloq-field2"
                                value={index + 1}
                                readOnly
                                size="50"
                            />
                            </div>
                            <div className="fiel-vers">
                            <span className="message">
                                <input
                                className="input-text"
                                type="text"
                                value={item}
                                onChange={(e) => handleAgendaChange(index, e.target.value)}
                                placeholder="Ingrese punto de agenda"
                                size="100"
                                />
                                <span className="tooltip-text">
                                Agregar agenda o puntos a tratar durante la reunión
                                </span>
                            </span>
                            </div>
                        </div>
                        ))}
                        <button type="button" className="rp-button" onClick={addAgendaItem}>
                        + Agregar ítem de agenda
                        </button>
                    </section>

                    <section className="rp-organization-section">
                        <h3>Conclusiones</h3>
                        {conclusions.map((item, index) => (
                        <div className="rp-cod-vers" key={`conclusion-${index}`}>
                            <div className="fiel-vers">
                            <input
                                disabled
                                type="text"
                                className="inputBloq-field2"
                                value={index + 1}
                                readOnly
                                size="50"
                            />
                            </div>
                            <div className="fiel-vers">
                            <span className="message">
                                <input
                                className="input-text"
                                type="text"
                                value={item}
                                onChange={(e) => handleConclusionChange(index, e.target.value)}
                                placeholder="Ingrese conclusión"
                                size="100"
                                />
                                <span className="tooltip-text">
                                Agregar conclusiones llegadas en la reunión
                                </span>
                            </span>
                            </div>
                        </div>
                        ))}
                        <button type="button" className="rp-button" onClick={addConclusion}>
                        + Agregar conclusión
                        </button>
                    </section>

                    <section className="rp-organizations-section">
                        <h3>Observaciones</h3>

                        <div className="input-text">
                            <textarea className="input-fieldtext" rows="3"value={observations} onChange={(e) => setObservations(e.target.value)} placeholder="Añadir observaciones encontradas"></textarea>
                        </div>

                        <div className="rp-buttons">
                            <button onClick={irAEntrevistas} className="rp-button" size="50">Cancelar</button>
                            <button onClick={registrarEntrevista} className="rp-button" size="50">Crear</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default NuevaEntrevista;
