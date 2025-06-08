import React, { useState, useEffect,useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import '../../../styles/stylesNuevaIlacion.css';
import '../../../styles/styles.css';
import axios from "axios";

const EditarRNF = () => {

    const navigate = useNavigate();
    const {orgcod, projcod,rnfcod} = useParams();
    const location = useLocation();
    const { proid } = location.state || {};

    const [version, setVersion] = useState("");
    const [comment, setComentario] = useState("");
    const [creationDate, setFecha] = useState("");
    const [importance, setImportance] = useState("");
    const [qualityAttribute, setQualityAttribute] = useState("");
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [status, setStatus] = useState("");

    const [error, setError] = useState(null);

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

    const fetchRnfData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/projects/${proid}/nfrs/${rnfcod}`);
            const data = response.data;
            const rawDate = new Date(data.creationDate);
            const formattedDate = `${rawDate.getDate()}/${rawDate.getMonth() + 1}/${rawDate.getFullYear()}`;
            setFecha(formattedDate);
            setVersion(data.version);
            setComentario(data.comment);
            setName(data.name);
            setVersion(data.version);
            setQualityAttribute(data.qualityAttribute)
            setStatus(data.status);
            setDescription(data.description)
            setImportance(data.importance);
        } catch (err) {
            setError("Error al obtener los datos del experto: " + err.message);
        }
    };

    useEffect(() => {
            fetchRnfData();
    }, [rnfcod]);
    
    const handleEdit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.put(`${API_BASE_URL}/projects/${proid}/nfrs/${rnfcod}`, {
                name,
                qualityAttribute,
                description,
                status,
                importance,
                comment,
            });
    
            if (response.status === 200) {
                alert("Experto actualizado correctamente");
                irARNF();
            }
        } catch (err) {
            setError("Error al actualizar el experto: " + err.message);
        }
    };

    const irAMenuOrganizaciones = () => {
        navigate("/menuOrganizaciones");
    };
    const irALogin = () => {
        navigate("/");
    };
    const irAListaProyecto = () => {
        navigate("/listaProyectos");
    };
    const irAMenuProyecto = () => {
        navigate("/menuProyecto");
    };
    const irAPlantillas = () => {
        navigate("/plantillas");
    };
    const irARNF = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/rnf`,{
        state: {
            proid:proid
        }
    });
    };

    const [dropdownOpen, setDropdownOpen] = React.useState({
        fuentes: false,
        expertos: false,
    });
    const [selectedItems, setSelectedItems] = React.useState([]);
    const fuentes = ["FUE-0001", "FUE-0002", "FUE-0003"];
    const expertos = ["EXP-0001", "EXP-0002", "EXP-0003"];

    const handleCheckboxChange = (value) => {
        setSelectedItems((prev) =>
            prev.includes(value) 
                ? prev.filter((item) => item !== value) // Elimina si ya está seleccionado
                : [...prev, value] // Agrega si no está seleccionado
        );
    };
    // Cerrar el dropdown al hacer clic fuera
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".custom-select-dropdown")) {
                setDropdownOpen({
                    fuentes: false,
                    expertos: false
                });
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

        
    const toggleDropdown = (dropdown) => {
        setDropdownOpen((prev) => ({
            ...prev,
            [dropdown]: !prev[dropdown]
        }));
    };


    return (
        <div className="ne-container">
            <header className="ne-header">
                <h1>ReqWizards App</h1>
                <div className="flex-container">
                    <span onClick={irAMenuOrganizaciones}>Menú Principal /</span>
                    <span onClick={irAListaProyecto}>Mocar Company /</span>
                    <span onClick={irAMenuProyecto}>Sistema Inventario /</span>
                    <span onClick={irAPlantillas}>Plantillas /</span>
                    <span onClick={irARNF}>Requerimientos No Funcionales/</span>
                    <span>Editar RNF</span>
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
                    <h2>EDITAR REQUERIMIENTO NO FUNCIONAL</h2>
                    <section className="ne-organization">
                        <h3 className="ne-label-container">
                            <label className="ne-label">Código RNF* </label>
                            <label className="ne-label">Version*</label>
                            <label className="ne-label">Fecha*</label>
                        </h3>
                        <div className="ne-input-container">
                            <input disabled type="text" className="ne-input" value={rnfcod} readOnly />
                            <input disabled type="text" className="ne-input" value={version} readOnly />
                            <input disabled type="text" className="ne-input" value={creationDate} readOnly />
                        </div>

                        <div className="ne-cod-vers">
                            <div className="fiel-cod">
                                <h4>Nombre*</h4>
                            </div>
                            <div className="fiel-vers">
                                <span className="message">
                                    <input className="input-text" type="text" value={name} onChange={(e) => setName(e.target.value)}placeholder="Nombre del RNF" size="100" />
                                    <span className="tooltip-text">Ingresar el nombre del RNF</span>
                                </span>
                            </div>
                        </div>

                        <div className="ne-cod-vers">
                            <div className="fiel-cod">
                                <h4>Atributo de Calidad*</h4>
                            </div>
                            <div className="fiel-vers">
                                <select
                                className="estado2-input "
                                style={{ width: "600px" }} 
                                value={qualityAttribute}
                                onChange={(e) => setQualityAttribute(e.target.value)}
                                required
                                >
                                <option value="">Seleccione una opcion</option>
                                <option value="seguridad">Seguridad</option>
                                <option value="accesibilidad">Accesibilidad</option>
                                <option value="eficiencia">Eficiencia</option>
                                <option value="usabilidad">Usabilidad</option>
                                <option value="mantenimiento">Mantenimiento</option>
                                </select>
                                <span className="tooltip-text">Selecciona atributo de calidad</span>
                            </div>
                            
                        </div>
                      

                        <div className="ne-cod-vers">
                            <div className="fiel-cod">
                                <h4>Descripción*</h4>
                            </div>
                            <div className="fiel-vers">
                                <span className="message">
                                    <input className="input-text" type="text" value={description} onChange={(e) => setDescription(e.target.value)} size="100" />
                                    <span className="tooltip-text">Ingresar detalles sobre el requerimiento no funcional</span>
                                </span>
                            </div>
                        </div>

                    </section>

                    <section className="ne-organization">
                        <h3 className="ne-label-container">
                            <label className="ne-label">Autor de plantilla*</label>
                            <label className="ne-label">Fuente</label>
                            <label className="ne-label">Experto</label>
                        </h3>
                        <div className="ne-input-container">
                            
                            <input disabled type="text" className="ne-input" value="AUT-0000" readOnly />
                            <div className="custom-select-dropdown">
                                <div className="dropdown-toggle" onClick={() => toggleDropdown("fuentes")}>
                                    <span>
                                        {selectedItems.length > 0
                                            ? selectedItems.join(", ")
                                            : "Seleccione una o más opciones"}
                                    </span>
                                    <span className="dropdown-arrow">▼</span>
                                </div>
                                {dropdownOpen.fuentes && (
                                    <div className="dropdown-menu">
                                        {fuentes.map((option, index) => (
                                            <label key={index} className="dropdown-item">
                                                <input
                                                    type="checkbox"
                                                    value={option}
                                                    checked={selectedItems.includes(option)}
                                                    onChange={(e) => handleCheckboxChange(e.target.value)}
                                                />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="custom-select-dropdown">
                                <div className="dropdown-toggle" onClick={() => toggleDropdown("expertos")}>
                                    <span>
                                        {selectedItems.length > 0
                                            ? selectedItems.join(", ")
                                            : "Seleccione una o más opciones"}
                                    </span>
                                    <span className="dropdown-arrow">▼</span>
                                </div>
                                {dropdownOpen.expertos && (
                                    <div className="dropdown-menu">
                                        {expertos.map((option, index) => (
                                            <label key={index} className="dropdown-item">
                                                <input
                                                    type="checkbox"
                                                    value={option}
                                                    checked={selectedItems.includes(option)}
                                                    onChange={(e) => handleCheckboxChange(e.target.value)}
                                                />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className="ne-organization">
                        <h3 className="ne-label-container">
                            <label className="ne-label">Importancia*</label>
                            <label className="ne-label">Estado*</label>
                        </h3>
                        <div className="ne-input-container">
                            <select
                                className="ne-input estado-input"
                                value={importance}
                                onChange={(e) => setImportance(e.target.value)}
                                required
                            >
                                <option value="">Seleccione una opcion</option>
                                <option value="por empezar">Alta</option>
                                <option value="en progreso">Media</option>
                                <option value="en progreso">Baja</option>
                            </select>

                            <select
                                className="ne-input estado-input"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                required
                            >
                                <option value="">Seleccione una opcion</option>
                                <option value="por empezar">Activo</option>
                                <option value="en progreso">Inactivo</option>
                            </select>
                            
                        </div>
                        
                    </section>

                    <section className="ne-organizations-section">
                        <h3>Comentario</h3>

                        <div className="input-text">
                            <textarea className="input-fieldtext" rows="3" value={comment} onChange={(e) => setComentario(e.target.value)}placeholder="Añadir comentarios "></textarea>
                        </div>

                        <div className="ne-buttons">
                            <button onClick={irARNF} className="ne-button" size="100">Cancelar</button>
                            <button onClick={handleEdit} className="ne-button" size="100">Guardar RNF</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default EditarRNF;
