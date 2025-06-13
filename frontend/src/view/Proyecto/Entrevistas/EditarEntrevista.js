import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import '../../../styles/stylesNuevaEntrevista.css';
import '../../../styles/styles.css';
import axios from "axios";

const EditarEntrevista = () => {

    const navigate = useNavigate();
    const {orgcod, projcod } = useParams();
    const location = useLocation();
    const { proid,id } = location.state || {};

    const [version, setVersion] = useState("01.00");
    const [interviewName, setInterviewName] = useState("");
    const [interviewDate, setInterviewDate] = useState("")
    const [intervieweeName, setIntervieweeName] = useState("");
    const [intervieweeRole, setIntervieweeRole] = useState("");
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [observations, setObservations] = useState("");

    const [authorId, setAuthorId] = useState("6a813a0f-2086-42fc-a373-5c86f05bfa08");
    
    const [agendaItems, setAgendaItems] = useState([""]);
    const [conclusions, setConclusions] = useState([""]);
    
    const [error, setError]=useState(null);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";    

    const fetchEntrevistaData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/interviews/${id}`);
            const data = response.data;

            // Formatear fecha para campo de tipo "date" (yyyy-mm-dd)
            const interviewDate = data.interviewDate?.substring(0, 10);
            const startTime = data.startTime?.substring(11, 16); // hh:mm
            const endTime = data.endTime?.substring(11, 16);     // hh:mm

            setInterviewName(data.interviewName || "");
            setVersion(data.version || "01.00");
            setInterviewDate(interviewDate || "");
            setStartTime(startTime || "");
            setEndTime(endTime || "");
            setIntervieweeName(data.intervieweeName || "");
            setIntervieweeRole(data.intervieweeRole || "");
            setObservations(data.observations || "");
            setAuthorId(data.authorId || "");

            // Mapear descripciones de los ítems de agenda
            const mappedAgendaItems = data.agendaItems?.map(item => item.description) || [""];
            setAgendaItems(mappedAgendaItems);

            // Mapear descripciones de las conclusiones
            const mappedConclusions = data.conclusions?.map(item => item.description) || [""];
            setConclusions(mappedConclusions);

        } catch (err) {
            setError("Error al obtener los datos de la entrevista: " + err.message);
            console.error(err);
        }
    };

    useEffect(() => {

        fetchEntrevistaData();
    }, [id]);

    const handleAgendaChange = (index, value) => {
    const updatedItems = [...agendaItems];
    updatedItems[index] = value;
    setAgendaItems(updatedItems);
    };

    const handleConclusionChange = (index, value) => {
    const updatedItems = [...conclusions];
    updatedItems[index] = value;
    setConclusions(updatedItems);
    };

    // Añadir nuevos ítems vacíos
    const addAgendaItem = () => {
    setAgendaItems([...agendaItems, ""]);
    };

    const addConclusion = () => {
    setConclusions([...conclusions, ""]);
    }; 
    
    const handleEdit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.put(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/interviews/${id}`, {
                interviewName,
                version,
                interviewDate,
                intervieweeName,
                intervieweeRole,
                startTime,
                endTime,
                observations,
                agendaItems: agendaItems.map(item => ({
                    description: item
                })),
                conclusions: conclusions.map(item => ({
                    description: item
                }))
            });

            if (response.status === 200) {
                alert("Entrevista actualizada correctamente");
                // Redirige o realiza otra acción
                irAEntrevistas();
            }
        } catch (err) {
            setError("Error al actualizar la entrevista: " + err.message);
        }
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
                    <span>Editar entrevista</span>
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
                    <h2>EDITAR ENTREVISTA</h2>
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
                                <h4>Nombre de entrevista *</h4>
                            </div>
                            <div className="fiel-vers">
                                <span class="message">
                                    <input
                                    className="input-text"
                                    type="text"
                                    placeholder=""
                                    size="100"
                                    value={interviewName} onChange={(e) => setInterviewName(e.target.value)} 
                                    />
                                    <span class="tooltip-text">Nombre de la entrevista</span>
                                </span>
                            </div>
                        </div>

                        <div className="rp-cod-vers">
                            <div className="fiel-cod">
                                <h4>Código del autor</h4>
                            </div>
                            <div className="fiel-vers">
                                <input disabled type="text" className="inputBloq-field" value="AUT-0001" readOnly size="100" />
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
                                    <input
                                        className="input-text"
                                        type="text"
                                        placeholder=""
                                        size="100"
                                        value={intervieweeName} onChange={(e) => setIntervieweeName(e.target.value)} 
                                    />
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
                                <input
                                    className="input-text"
                                    type="text"
                                    placeholder=""
                                    size="100"
                                    value={intervieweeRole} onChange={(e) => setIntervieweeRole(e.target.value)}
                                />
                                    <span class="tooltip-text">Cargo que tiene en el proyecto la persona entrevistada. Ej. Cliente, Líder del proyecto, etc.</span>
                                </span>
                            </div>
                        </div>
                    </section>

                    <section className="rp-organization-section">
                        <h3>Información del tiempo</h3>
                        
                        <div className="rp-cod-vers">
                            {/* Fecha */}
                            <div className="fiel-cod-e">
                                <h4>Fecha *</h4>
                                <input
                                    className="input-text"
                                    type="date"
                                    value={interviewDate}
                                    onChange={(e) => setInterviewDate(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Hora de inicio */}
                            <div className="fiel-cod-e">
                                <h4>Hora de inicio *</h4>
                                <span className="message">
                                    <input
                                        className="input-text"
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        required
                                    />
                                    <span className="tooltip-text">Hora de inicio de la entrevista</span>
                                </span>
                            </div>

                            {/* Hora de fin */}
                            <div className="fiel-cod-e">
                                <h4>Hora de fin *</h4>
                                <span className="message">
                                    <input
                                        className="input-text"
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        required
                                    />
                                    <span className="tooltip-text">Hora de fin de la entrevista</span>
                                </span>
                            </div>
                        </div>
                    </section>

                    <section className="rp-organization-section">
                        <h3>Agenda</h3>
                        {agendaItems.map((item, index) => (
                            <div className="rp-cod-vers" key={index}>
                            <div className="fiel-vers">
                                <input disabled type="text" className="inputBloq-field2" value={index + 1} readOnly size="50" />
                            </div>
                            <div className="fiel-vers">
                                <span className="message">
                                <input
                                    className="input-text"
                                    type="text"
                                    placeholder=""
                                    size="50"
                                    value={item}
                                    onChange={(e) => handleAgendaChange(index, e.target.value)}
                                />
                                <span className="tooltip-text">Modificar agenda o puntos a tratar durante la reunión</span>
                                </span>
                            </div>
                            </div>
                        ))}

                        <button type="button" className="rp-button"onClick={addAgendaItem}>Añadir ítem de agenda</button>
                        </section>

                    <section className="rp-organization-section">
                        <h3>Conclusiones</h3>
                        {conclusions.map((item, index) => (
                            <div className="rp-cod-vers" key={index}>
                            <div className="fiel-vers">
                                <input disabled type="text" className="inputBloq-field2" value={index + 1} readOnly size="50" />
                            </div>
                            <div className="fiel-vers">
                                <span className="message">
                                <input
                                    className="input-text"
                                    type="text"
                                    placeholder=""
                                    size="50"
                                    value={item}
                                    onChange={(e) => handleConclusionChange(index, e.target.value)}
                                />
                                <span className="tooltip-text">Modificar conclusiones de la reunión</span>
                                </span>
                            </div>
                            </div>
                        ))}

                        <button type="button" className="rp-button" onClick={addConclusion}>Añadir conclusión</button>
                        </section>


                    <section className="rp-organizations-section">
                        <h3>Observaciones</h3>

                        <div className="input-text">
                            <input
                                className="input-text"
                                type="text"
                                placeholder=""
                                size="50"
                                value={observations} onChange={(e) => setObservations(e.target.value)} 
                            />
                        </div>

                        <div className="rp-buttons">
                            <button onClick={irAEntrevistas} className="rp-button" size="50">Cancelar</button>
                            <button onClick={handleEdit} className="rp-button" size="50">Guardar cambios</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default EditarEntrevista;
