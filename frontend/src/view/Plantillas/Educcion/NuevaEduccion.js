import React,{ useState, useEffect,useRef } from "react";
import { useLocation, useNavigate,useParams } from "react-router-dom";
import '../../../styles/stylesNuevaEduccion.css';
import '../../../styles/styles.css';
import axios from "axios";

const NuevaEduccion = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { orgcod, projcod } = useParams();
    const [organizacion, setOrganizacion] = useState({});
    const [proyecto, setProyecto] = useState({});

    const { proid } = location.state || {};

    const [code, setCode] = useState("");
    const [comment, setComment] = useState("");
    const [version, setVersion] = useState("00.01");
    const [creationDate, setCreationDate] = useState(
        new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }));
    const [description, setDescription] = useState("");
    const [importance, setImportance] = useState("");
    const [modificationDate, setModificationDate] = useState(
        new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }));
    const [name, setName] = useState("");
    const [status, setStatus] = useState("");
    const [error, setError]=useState(null);

    const [errorName, setErrorName] = useState("");
    const [errorComment, setErrorComment] = useState("");
    const [errorDescription, setErrorDescription] = useState("");
    const [errorImportance, setErrorImportance] = useState("");
    const [errorStatus, setErrorStatus] = useState("");

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";
    
    useEffect(() => {
    
        const fetchNextCodigoEduccion = async () => {
            try {
                
                // Llamar al endpoint usando parámetros de consulta
                const response = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones/next-code`);

                // Asignar el valor recibido al estado
                setCode(response.data.nextCode || "Ed-001");
            } catch (err) {
                console.error("Error al obtener el siguiente código de experto:", err);
                setError("No se pudo cargar el siguiente código del experto.");
            }
        };

        fetchNextCodigoEduccion();
    }, [API_BASE_URL,orgcod, projcod]);

    //Función para obtener datos de organizacion y proyecto
  useEffect(() => {
    const fetchDatos = async () => {
        try {
            const resOrg = await axios.get(`${API_BASE_URL}/organizations/${orgcod}`);
            setOrganizacion(resOrg.data);

            const resProyecto = await axios.get(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}`);
            setProyecto(resProyecto.data);
        } catch (error) {
            console.error("Error al obtener datos de organización o proyecto", error);
        }
        };
        fetchDatos();
  }, [orgcod, projcod, API_BASE_URL]);

    const registrarEduccion = async (e) => {
        e.preventDefault();

        if (!name) {
            setErrorName("El nombre es obligatorio.");
            return;
        }
        if (!description) {
            setErrorDescription("La descripción es obligatoria");
            return;
        }
        if (!importance) {
            setErrorImportance("Debe seleccionar una importancia.");
            return;
        }
        if (!status) {
            setErrorStatus("Debe seleccionar un estado");
            return;
        }

        try {
            // Realiza la solicitud POST con los datos correctos
            await axios.post(`${API_BASE_URL}/organizations/${orgcod}/projects/${projcod}/educciones`, {
                code,
                name,
                description,
                importance,
                comment, // Asumiendo que 'comentario' es un campo adicional
                status, // Asumiendo que 'estado' es otro campo
            });
            
            // Redirigir a la página de expertos o realizar otra acción
            irAEduccion();
    
        } catch (err) {
            console.error("Error al registrar el experto:", err);
            setError("No se pudo registrar al experto. Inténtalo de nuevo.");
        }
    };

    const irAMenuOrganizaciones = () => {
        navigate("/organizations");
    };
    const irALogin = () => {
        navigate("/");
    };
    const irAListaProyecto = () => {
        navigate(`/organizations/${orgcod}/projects`);
    };
    const irAMenuProyecto = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/menuProyecto`,{
        state: {
            proid:proid
        }
    });
    };
    const irAPlantillas = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/plantillas`,{
        state: {
            proid:proid
        }
    });
    };
    const irAEduccion = () => {
        navigate(`/organizations/${orgcod}/projects/${projcod}/educcion`,{
        state: {
            proid:proid
        }
    });
    };

    const [dropdownOpen, setDropdownOpen] = React.useState({
        actors: false,
        fuentes: false,
        expertos: false,
        ilaciones: false
    });
    const [selectedItems, setSelectedItems] = React.useState([]);
    const actors = ["ACT-0001", "ACT-0002", "ACT-0003"];
    const fuentes = ["FUE-0001", "FUE-0002", "FUE-0003"];
    const expertos = ["EXP-0001", "EXP-0002", "EXP-0003"];
    const ilaciones = ["ILA-0001", "ILA-0002", "ILA-0003"];

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
                    actors: false,
                    fuentes: false,
                    expertos: false,
                    ilaciones: false
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
                    <span onClick={irAListaProyecto}>{organizacion.name || "Organización"} /</span>
                    <span onClick={irAMenuProyecto}>{proyecto.name || "Proyecto"} /</span>
                    <span onClick={irAPlantillas}>Plantillas /</span>
                    <span onClick={irAEduccion}>Educcion /</span>
                    <span>Nueva Educción</span>
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
                    <h2>NUEVA EDUCCIÓN</h2>
                    <section className="ne-organization">
                        <h3 className="ne-label-container">
                            <label className="ne-label">Código </label>
                            <label className="ne-label">Version</label>
                            <label className="ne-label">Fecha</label>
                        </h3>
                        <div className="ne-input-container">
                            <input disabled type="text" className="ne-input" value={code} readOnly />
                            <input disabled type="text" className="ne-input" value={version} readOnly />
                            <input disabled type="text" className="ne-input" value={creationDate} readOnly />
                        </div>

                        <div className="ne-cod-vers">
                            <div className="fiel-cod">
                                <h4>Nombre*</h4>
                            </div>
                            <div className="fiel-vers">
                                <span className="message">
                                    <input
                                    type="text"
                                    className="inputnombre-field"
                                    value={name}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,_\-&\/]*$/;

                                        if (permitido.test(value) && value.length <= 50) {
                                        setName(value);
                                        setErrorName(""); // limpiar el error si todo está bien
                                        } else {
                                        setErrorName("No se permiten caracteres especiales.");
                                        // No actualiza el input → no se muestra el carácter inválido
                                        }
                                    }}
                                    onBlur={() => {
                                        if (!name.trim()) {
                                        setErrorName("Este campo es obligatorio.");
                                        }
                                    }}
                                    maxLength={50}
                                    size="114"
                                    />
                                    {errorName && (
                                    <p style={{ color: 'red', margin: 0 }}>{errorName}</p>)}
                                    <span className="tooltip-text">Nombre de la educción</span>
                                </span>
                            </div>
                        </div>

                        <div className="ne-cod-vers">
                            <div className="fiel-cod">
                                <h4>Descripción*</h4>
                            </div>
                            <div className="fiel-vers">
                                <span className="message">
                                    <input
                                    type="text"
                                    className="inputnombre-field"
                                    value={description}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s().,_\-&\/]*$/;

                                        if (permitido.test(value) && value.length <= 100) {
                                        setDescription(value);
                                        setErrorDescription(""); // limpiar el error si todo está bien
                                        } else {
                                        setErrorDescription("No se permiten caracteres especiales.");
                                        // No actualiza el input → no se muestra el carácter inválido
                                        }
                                    }}
                                    onBlur={() => {
                                        if (!description.trim()) {
                                        setErrorDescription("Este campo es obligatorio.");
                                        }
                                    }}
                                    maxLength={100}
                                    size="114"
                                    />
                                    {errorDescription && (
                                    <p style={{ color: 'red', margin: 0 }}>{errorDescription}</p>)}
                                    <span className="tooltip-text">Añadir descripción de la educción</span>
                                </span>
                            </div>
                        </div>
                    </section>

                    <section className="ne-organization">
                        <h3 className="ne-label-container">
                            <label className="ne-label">Autor de plantilla*</label>
                            <label className="ne-label">Importancia</label>
                            <label className="ne-label">Estado</label>
                        </h3>
                        <div className="ne-input-container">
                            
                            <input disabled type="text" className="ne-input" value="AUT-0000" readOnly />
                            {/* Select de Importancia */}
                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <select
                                    className="ne-input estado-input"
                                    value={importance}
                                    onChange={(e) => {
                                        setImportance(e.target.value);
                                        setErrorImportance(""); // limpiar error al seleccionar
                                    }}
                                    onBlur={() => {
                                        if (!importance) {
                                        setErrorImportance("Debe seleccionar una importancia.");
                                        }
                                    }}
                                    required
                                    >
                                    <option value="">Seleccione una opción</option>
                                    <option value="Baja">Baja</option>
                                    <option value="Media">Media</option>
                                    <option value="Alta">Alta</option>
                                    </select>
                                    {errorImportance && (
                                    <p style={{ color: "red", margin: 0 }}>{errorImportance}</p>
                                    )}
                                </div>

                                {/* Select de Estado */}
                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <select
                                    className="ne-input estado-input"
                                    value={status}
                                    onChange={(e) => {
                                        setStatus(e.target.value);
                                        setErrorStatus(""); // limpiar error al seleccionar
                                    }}
                                    onBlur={() => {
                                        if (!status) {
                                        setErrorStatus("Debe seleccionar un estado.");
                                        }
                                    }}
                                    required
                                    >
                                    <option value="">Seleccione una opción</option>
                                    <option value="Por empezar">Por empezar</option>
                                    <option value="En progreso">En progreso</option>
                                    <option value="Finalizado">Finalizado</option>
                                    </select>
                                    {errorStatus && (
                                    <p style={{ color: "red", margin: 0 }}>{errorStatus}</p>
                                    )}
                                </div>
                            
                        </div>
                    </section>

                    <section className="ne-organizations-section">
                        <h3>Comentario</h3>

                        <div className="input-text">
                            <textarea
                                className="input-fieldtext"
                                rows="3"
                                value={comment}
                                placeholder="Añadir comentarios"
                                maxLength={300}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const permitido = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ0-9\s.,;:()¿?!¡"'\-]*$/;

                                    // Validar: solo permitir si cumple el patrón
                                    if (permitido.test(value)) {
                                    setComment(value);
                                    setErrorComment("");
                                    } else {
                                    setErrorComment("No se permiten caracteres especialeS.");
                                    }
                                }}
                                ></textarea>

                                {errorComment && <p style={{ color: 'red', margin: 0 }}>{errorComment}</p>}
                        </div>

                        <div className="ne-buttons">
                            <button onClick={irAEduccion} className="ne-button" size="50">Cancelar</button>
                            <button onClick={registrarEduccion} className="ne-button" size="50">Crear Educción</button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default NuevaEduccion;
